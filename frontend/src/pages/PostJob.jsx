import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobService';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import toast from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '', type: 'full-time',
    experience: 'mid', skills: '', deadline: '',
    salaryMin: '', salaryMax: '', currency: 'USD',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const job = await createJob({
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        type: form.type,
        experience: form.experience,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline || undefined,
        salary: {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
          currency: form.currency,
        },
      });
      toast.success('Job posted');
      navigate(`/jobs/${job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, props = {}) => (
    <input
      className="input"
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      {...props}
    />
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Post a job</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {field('title', { placeholder: 'Job title', required: true })}
        {field('company', { placeholder: 'Company', required: true })}
        {field('location', { placeholder: 'Location', required: true })}
        <textarea className="input min-h-[120px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
          {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {field('skills', { placeholder: 'Skills (comma separated)' })}
        <div className="grid grid-cols-3 gap-2">
          {field('salaryMin', { type: 'number', placeholder: 'Min salary' })}
          {field('salaryMax', { type: 'number', placeholder: 'Max salary' })}
          {field('currency', { placeholder: 'USD' })}
        </div>
        {field('deadline', { type: 'date' })}
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Posting…' : 'Post job'}</button>
      </form>
    </div>
  );
};

export default PostJob;
