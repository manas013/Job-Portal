import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPipeline, updateApplication } from '../services/applicationService';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import ProposeInterviewButton from '../components/common/ProposeInterviewButton';

const COLUMNS = [
  { id: 'pending', label: 'Pending', color: 'border-t-gray-400' },
  { id: 'reviewed', label: 'Reviewed', color: 'border-t-blue-500' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'border-t-amber-500' },
  { id: 'hired', label: 'Hired', color: 'border-t-green-500' },
  { id: 'rejected', label: 'Rejected', color: 'border-t-red-500' },
];

const PipelineCard = ({ app, onMove }) => (
  <div
    draggable
    onDragStart={(e) => e.dataTransfer.setData('applicationId', app._id)}
    className="card p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
  >
    <div className="flex gap-2 mb-2">
      <Avatar user={app.applicant} size="sm" />
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{app.applicant?.name}</p>
        <p className="text-xs text-gray-500 truncate">{app.job?.title}</p>
      </div>
    </div>
    <p className="text-xs text-gray-400">{app.job?.company}</p>
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex gap-2 flex-wrap">
        <Link to={`/messages/${app.applicant?._id}`} className="text-xs text-primary-600">Message</Link>
        <Link to={`/jobs/${app.job?._id}/applicants`} className="text-xs text-gray-500">Details</Link>
      </div>
      <ProposeInterviewButton application={app} />
    </div>
    <select
      className="input text-xs mt-2 py-1"
      value={app.status}
      onChange={(e) => onMove(app._id, e.target.value)}
    >
      {COLUMNS.map((c) => (
        <option key={c.id} value={c.id}>{c.label}</option>
      ))}
    </select>
  </div>
);

const Pipeline = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchPipeline().then(setApps).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleMove = async (id, status) => {
    try {
      const updated = await updateApplication(id, { status });
      setApps((list) => list.map((a) => (a._id === id ? updated : a)));
      toast.success(`Moved to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
      load();
    }
  };

  const onDrop = (status) => (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (id) handleMove(id, status);
  };

  const onDragOver = (e) => e.preventDefault();

  if (loading) return <Spinner />;

  if (!apps.length) {
    return (
      <EmptyState
        title="No applicants yet"
        message="Post jobs and applicants will appear here."
        action={<Link to="/jobs/new" className="btn-primary">Post a job</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Applicant pipeline</h1>
      <p className="text-sm text-gray-500 mb-6">Drag cards between columns or use the dropdown to update status.</p>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[420px]">
        {COLUMNS.map((col) => {
          const columnApps = apps.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-t-4 ${col.color} p-3`}
              onDrop={onDrop(col.id)}
              onDragOver={onDragOver}
            >
              <h2 className="font-semibold text-sm mb-3 flex justify-between">
                {col.label}
                <span className="text-gray-400 font-normal">{columnApps.length}</span>
              </h2>
              <div className="space-y-2 min-h-[200px]">
                {columnApps.map((app) => (
                  <PipelineCard key={app._id} app={app} onMove={handleMove} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
