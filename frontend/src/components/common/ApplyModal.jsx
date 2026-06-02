import { useState, useEffect } from 'react';
import { applyJob, generateCoverLetter, fetchMatchScore } from '../../services/jobService';
import MatchBadge from './MatchBadge';
import toast from 'react-hot-toast';

const ApplyModal = ({ job, open, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ coverLetter: '', expectedSalary: '' });
  const [loading, setLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  useEffect(() => {
    if (open && job?._id) {
      fetchMatchScore(job._id).then((d) => setMatchScore(d.matchScore)).catch(() => {});
    }
  }, [open, job?._id]);

  if (!open) return null;

  const handleGenerateLetter = async () => {
    setGeneratingLetter(true);
    try {
      const { coverLetter } = await generateCoverLetter(job._id);
      setForm((f) => ({ ...f, coverLetter }));
      toast.success('Cover letter generated — edit as needed');
    } catch {
      toast.error('Could not generate cover letter');
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await applyJob(job._id, {
        coverLetter: form.coverLetter,
        expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
      });
      toast.success('Application submitted!');
      onSuccess?.();
      onClose();
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold">Apply to {job.title}</h2>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
          {matchScore != null && <MatchBadge score={matchScore} />}
        </div>

        {step === 1 && (
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">Step 1: Cover letter</p>
              <button
                type="button"
                className="text-xs btn-secondary py-1 px-2"
                onClick={handleGenerateLetter}
                disabled={generatingLetter}
              >
                {generatingLetter ? 'Generating…' : '✨ AI draft'}
              </button>
            </div>
            <textarea
              className="input min-h-[140px]"
              placeholder="Cover letter..."
              value={form.coverLetter}
              onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
            />
            <button type="button" className="btn-primary w-full" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Step 2: Expected salary (optional)</p>
            <input
              type="number"
              className="input"
              placeholder="Expected annual salary"
              value={form.expectedSalary}
              onChange={(e) => setForm((f) => ({ ...f, expectedSalary: e.target.value }))}
            />
            <div className="flex gap-2">
              <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn-primary flex-1" disabled={loading} onClick={handleSubmit}>
                {loading ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </div>
        )}

        <button type="button" className="text-sm text-gray-500 mt-4 hover:text-gray-700" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ApplyModal;
