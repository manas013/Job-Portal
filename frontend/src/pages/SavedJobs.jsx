import { useEffect, useState } from 'react';
import { fetchSavedJobs, unsaveJob } from '../services/savedJobService';
import JobCard from '../components/common/JobCard';
import EmptyState from '../components/common/EmptyState';
import { JobCardSkeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchSavedJobs().then(setJobs).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleUnsave = async (id) => {
    await unsaveJob(id);
    toast.success('Removed from saved');
    load();
  };

  if (loading) return <div className="grid md:grid-cols-2 gap-4">{[1, 2].map((i) => <JobCardSkeleton key={i} />)}</div>;

  if (!jobs.length) {
    return (
      <EmptyState
        title="No saved jobs"
        message="Bookmark jobs while browsing to find them here."
        action={<Link to="/jobs" className="btn-primary">Browse jobs</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved jobs</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="relative">
            <JobCard job={job} />
            <button
              type="button"
              className="absolute top-3 right-3 text-xs btn-secondary py-1 px-2"
              onClick={() => handleUnsave(job._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
