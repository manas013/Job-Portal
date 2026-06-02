import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchJob, fetchMatchScore } from '../services/jobService';
import MatchBadge from '../components/common/MatchBadge';
import { saveJob, unsaveJob } from '../services/savedJobService';
import { fetchMyApplications } from '../services/applicationService';
import useAuth from '../hooks/useAuth';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import ApplyModal from '../components/common/ApplyModal';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApply, setShowApply] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    fetchJob(id)
      .then(setJob)
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'jobseeker') {
      fetchMyApplications().then((apps) => {
        setHasApplied(apps.some((a) => a.job?._id === id && a.status !== 'withdrawn'));
      });
      fetchMatchScore(id).then((d) => setMatchScore(d.matchScore)).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const toggleSave = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      if (saved) {
        await unsaveJob(id);
        setSaved(false);
        toast.success('Removed from saved');
      } else {
        await saveJob(id);
        setSaved(true);
        toast.success('Job saved');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="py-20"><Spinner /></div>;
  if (error) return <Alert message={error} />;
  if (!job) return null;

  const isOwner =
    user &&
    (job.postedBy?._id === user._id || job.postedBy === user._id || user.role === 'admin');

  return (
    <>
      <Helmet>
        <title>{job.title} at {job.company} | JobPortal</title>
        <meta name="description" content={job.description?.slice(0, 160)} />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
          ← Back
        </button>
        <div className="card">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{job.company} · {job.location}</p>
            </div>
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            {matchScore != null && user?.role === 'jobseeker' && <MatchBadge score={matchScore} />}
            <div className="flex gap-2">
              <Badge label={job.type} />
              <Badge label={job.experience} />
            </div>
          </div>
          </div>
          {job.salary?.min && (
            <p className="text-sm text-green-600 font-medium mb-4">
              {job.salary.currency} {job.salary.min.toLocaleString()} – {job.salary.max?.toLocaleString()}
            </p>
          )}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          {job.skills?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="rounded-md bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-6">
            {user?.role === 'jobseeker' && (
              <>
                <button
                  type="button"
                  className="btn-primary flex-1"
                  disabled={hasApplied}
                  onClick={() => (isAuthenticated ? setShowApply(true) : navigate('/login'))}
                >
                  {hasApplied ? 'Already applied' : 'Apply now'}
                </button>
                <button type="button" className="btn-secondary" onClick={toggleSave}>
                  {saved ? 'Unsave' : 'Save job'}
                </button>
              </>
            )}
            {isOwner && (
              <>
                <Link to={`/jobs/${id}/edit`} className="btn-secondary">Edit</Link>
                <Link to={`/jobs/${id}/applicants`} className="btn-primary">View applicants</Link>
              </>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">
            {job.applicants?.length ?? 0} applicants · Posted {new Date(job.createdAt).toLocaleDateString()}
            {job.deadline && ` · Deadline ${new Date(job.deadline).toLocaleDateString()}`}
          </p>
        </div>
      </div>
      <ApplyModal
        job={job}
        open={showApply}
        onClose={() => setShowApply(false)}
        onSuccess={() => setHasApplied(true)}
      />
    </>
  );
};

export default JobDetail;
