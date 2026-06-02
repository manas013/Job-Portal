import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications, withdrawApplication } from '../services/applicationService';
import Badge from '../components/common/Badge';
import ApplicationTimeline from '../components/common/ApplicationTimeline';
import EmptyState from '../components/common/EmptyState';
import { JobCardSkeleton } from '../components/common/Skeleton';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => fetchMyApplications().then(setApps).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application? You cannot undo this.')) return;
    try {
      await withdrawApplication(id);
      toast.success('Application withdrawn');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const canWithdraw = (status) => !['hired', 'withdrawn', 'rejected'].includes(status);

  if (loading) return <div className="grid gap-4">{[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}</div>;

  if (!apps.length) {
    return (
      <EmptyState
        title="No applications yet"
        message="Browse jobs and apply to track them here."
        action={<Link to="/jobs" className="btn-primary">Browse jobs</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My applications</h1>
      <div className="space-y-4">
        {apps.map((app) => (
          <div key={app._id} className="card">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-primary-600 hover:underline">
                  {app.job?.title}
                </Link>
                <p className="text-sm text-gray-500">{app.job?.company}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge label={app.status} />
                <button
                  type="button"
                  className="text-xs text-primary-600"
                  onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                >
                  {expanded === app._id ? 'Hide timeline' : 'View timeline'}
                </button>
                {canWithdraw(app.status) && (
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:underline"
                    onClick={() => handleWithdraw(app._id)}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
            {expanded === app._id && <ApplicationTimeline application={app} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
