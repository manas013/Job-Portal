import { useEffect, useState } from 'react';
import { fetchAlerts, createAlert, deleteAlert } from '../services/alertService';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ keywords: '', type: '', experience: '', location: '', salaryMin: '' });

  const load = () => fetchAlerts().then(setAlerts);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAlert({ ...form, salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined });
      toast.success('Alert created');
      setForm({ keywords: '', type: '', experience: '', location: '', salaryMin: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    await deleteAlert(id);
    toast.success('Alert deleted');
    load();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Job alerts</h1>
      <form onSubmit={handleCreate} className="card space-y-3 mb-8">
        <input className="input" placeholder="Keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="">Any type</option>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
          <option value="">Any experience</option>
          {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="input" type="number" placeholder="Min salary" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
        <button type="submit" className="btn-primary">Create alert</button>
      </form>
      {!alerts.length ? (
        <EmptyState title="No alerts" message="Create an alert to get notified about matching jobs." />
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li key={a._id} className="card flex justify-between items-center">
              <div>
                <p className="font-medium">{a.keywords || 'Any job'}</p>
                <p className="text-xs text-gray-500">{[a.type, a.experience, a.location].filter(Boolean).join(' · ')}</p>
              </div>
              <button type="button" className="text-red-500 text-sm" onClick={() => handleDelete(a._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobAlerts;
