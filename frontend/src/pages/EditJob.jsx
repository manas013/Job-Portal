import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJob, updateJob } from '../services/jobService';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob(id).then((job) =>
      setForm({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        type: job.type,
        experience: job.experience,
        skills: (job.skills || []).join(', '),
        isActive: job.isActive,
      })
    );
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateJob(id, {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Job updated');
      navigate(`/jobs/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit job</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
          {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input className="input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Job is active
        </label>
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
};

export default EditJob;
