import { useState } from 'react';
import { proposeInterview } from '../../services/interviewService';
import toast from 'react-hot-toast';

const ProposeInterviewButton = ({ application, onDone }) => {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!start || !end) return toast.error('Pick start and end time');
    try {
      await proposeInterview({
        applicationId: application._id,
        proposedSlots: [{ start: new Date(start).toISOString(), end: new Date(end).toISOString() }],
      });
      toast.success('Interview slots proposed');
      setOpen(false);
      onDone?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (!open) {
    return (
      <button type="button" className="text-xs text-primary-600 hover:underline" onClick={() => setOpen(true)}>
        Schedule interview
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 w-full">
      <input type="datetime-local" className="input text-xs" value={start} onChange={(e) => setStart(e.target.value)} required />
      <input type="datetime-local" className="input text-xs" value={end} onChange={(e) => setEnd(e.target.value)} required />
      <div className="flex gap-1">
        <button type="submit" className="btn-primary text-xs py-1 px-2">Send</button>
        <button type="button" className="btn-secondary text-xs py-1 px-2" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
};

export default ProposeInterviewButton;
