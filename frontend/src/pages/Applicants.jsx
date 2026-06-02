import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobApplicants, updateApplication } from '../services/applicationService';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Avatar from '../components/common/Avatar';
import ProposeInterviewButton from '../components/common/ProposeInterviewButton';
import { mediaUrl } from '../utils/mediaUrl';

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchJobApplicants(jobId).then(setApps).finally(() => setLoading(false));
  useEffect(() => { load(); }, [jobId]);

  const updateStatus = async (id, status) => {
    await updateApplication(id, { status });
    toast.success('Status updated');
    load();
  };

  const updateNotes = async (id, employerNotes) => {
    await updateApplication(id, { employerNotes });
    toast.success('Notes saved');
    load();
  };

  if (loading) return <Spinner />;
  if (!apps.length) return <EmptyState title="No applicants" message="Share this job to get applications." />;

  return (
    <div>
      <button type="button" className="text-sm text-gray-500 mb-4" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>
      <div className="space-y-4">
        {apps.map((app) => (
          <div key={app._id} className="card">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <Avatar user={app.applicant} size="md" />
                <div>
                <p className="font-semibold">{app.applicant?.name}</p>
                <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                {app.applicant?.resumeUrl && (
                  <a href={mediaUrl(app.applicant.resumeUrl)} target="_blank" rel="noreferrer" className="text-xs text-primary-600">
                    View resume
                  </a>
                )}
                {app.coverLetter && <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{app.coverLetter}</p>}
                {app.expectedSalary && <p className="text-xs text-gray-400 mt-1">Expected: ${app.expectedSalary.toLocaleString()}</p>}
                </div>
              </div>
              <Badge label={app.status} />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {STATUSES.map((s) => (
                <button key={s} type="button" className="text-xs btn-secondary py-1 px-2 capitalize" onClick={() => updateStatus(app._id, s)}>
                  {s}
                </button>
              ))}
              <Link to={`/messages/${app.applicant._id}`} className="text-xs btn-primary py-1 px-2">Message</Link>
              <ProposeInterviewButton application={app} />
            </div>
            <textarea
              className="input mt-3 text-sm"
              placeholder="Private notes…"
              defaultValue={app.employerNotes}
              onBlur={(e) => updateNotes(app._id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applicants;
