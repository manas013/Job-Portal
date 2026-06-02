import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import {
  fetchInterviews,
  proposeInterview,
  selectInterviewSlot,
  cancelInterview,
} from '../services/interviewService';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const Interviews = () => {
  const { user } = useAuth();
  const isSeeker = user?.role === 'jobseeker';
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposeFor, setProposeFor] = useState(null);
  const [slots, setSlots] = useState([{ start: '', end: '' }, { start: '', end: '' }]);

  const load = () => fetchInterviews().then(setInterviews).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSelect = async (interviewId, slotId) => {
    await selectInterviewSlot(interviewId, slotId);
    toast.success('Interview time confirmed');
    load();
  };

  const handleCancel = async (id) => {
    await cancelInterview(id);
    toast.success('Interview cancelled');
    load();
  };

  const handlePropose = async (e) => {
    e.preventDefault();
    const valid = slots.filter((s) => s.start && s.end);
    if (!valid.length) return toast.error('Add at least one time slot');
    try {
      await proposeInterview({
        applicationId: proposeFor._id,
        proposedSlots: valid.map((s) => ({
          start: new Date(s.start).toISOString(),
          end: new Date(s.end).toISOString(),
        })),
      });
      toast.success('Interview slots sent');
      setProposeFor(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Interviews</h1>

      {!interviews.length ? (
        <EmptyState
          title="No interviews scheduled"
          message={
            isSeeker
              ? 'When an employer proposes times, they will appear here.'
              : 'Propose interview slots from the applicant pipeline or applicants page.'
          }
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <div key={iv._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{iv.job?.title}</p>
                  <p className="text-sm text-gray-500">{iv.job?.company}</p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">Status: {iv.status}</p>
                </div>
                {iv.status !== 'cancelled' && (
                  <button type="button" className="text-xs text-red-500" onClick={() => handleCancel(iv._id)}>
                    Cancel
                  </button>
                )}
              </div>

              {iv.status === 'confirmed' && iv.selectedSlot && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  Confirmed: {new Date(iv.selectedSlot.start).toLocaleString()} –{' '}
                  {new Date(iv.selectedSlot.end).toLocaleTimeString()}
                </p>
              )}

              {isSeeker && iv.status === 'proposed' && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Select a time slot:</p>
                  {iv.proposedSlots?.map((slot) => (
                    <button
                      key={slot._id}
                      type="button"
                      className="btn-secondary w-full text-sm"
                      onClick={() => handleSelect(iv._id, slot._id)}
                    >
                      {new Date(slot.start).toLocaleString()} – {new Date(slot.end).toLocaleTimeString()}
                    </button>
                  ))}
                </div>
              )}

              {!isSeeker && iv.status === 'proposed' && (
                <p className="mt-2 text-xs text-gray-500">Waiting for candidate to select a slot</p>
              )}
            </div>
          ))}
        </div>
      )}

      {proposeFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handlePropose} className="card max-w-md w-full space-y-3">
            <h2 className="font-bold">Propose interview slots</h2>
            <p className="text-sm text-gray-500">{proposeFor.applicant?.name || 'Applicant'}</p>
            {slots.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  className="input text-sm"
                  value={s.start}
                  onChange={(e) => {
                    const next = [...slots];
                    next[i].start = e.target.value;
                    setSlots(next);
                  }}
                  required
                />
                <input
                  type="datetime-local"
                  className="input text-sm"
                  value={s.end}
                  onChange={(e) => {
                    const next = [...slots];
                    next[i].end = e.target.value;
                    setSlots(next);
                  }}
                  required
                />
              </div>
            ))}
            <button type="button" className="text-sm text-primary-600" onClick={() => setSlots([...slots, { start: '', end: '' }])}>
              + Add slot
            </button>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary flex-1" onClick={() => setProposeFor(null)}>Cancel</button>
              <button type="submit" className="btn-primary flex-1">Send proposal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Interviews;
