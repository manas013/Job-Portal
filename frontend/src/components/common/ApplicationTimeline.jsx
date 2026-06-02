const STATUS_STEPS = ['pending', 'reviewed', 'shortlisted', 'hired'];
const STATUS_COLORS = {
  pending: 'bg-gray-400',
  reviewed: 'bg-blue-500',
  shortlisted: 'bg-amber-500',
  rejected: 'bg-red-500',
  hired: 'bg-green-500',
  withdrawn: 'bg-gray-400',
};

const ApplicationTimeline = ({ application }) => {
  const history = application.statusHistory?.length
    ? [...application.statusHistory].sort(
        (a, b) => new Date(a.changedAt) - new Date(b.changedAt)
      )
    : [{ status: application.status || 'pending', changedAt: application.createdAt, note: 'Applied' }];

  const isRejected = application.status === 'rejected';

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Application timeline</p>
      <ol className="relative border-l-2 border-gray-200 dark:border-gray-600 ml-2 space-y-4">
        {history.map((entry, i) => (
          <li key={entry._id || i} className="ml-4">
            <span
              className={`absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-gray-800 ${STATUS_COLORS[entry.status] || 'bg-gray-400'}`}
            />
            <p className="text-sm font-medium capitalize text-gray-900 dark:text-gray-100">{entry.status}</p>
            <p className="text-xs text-gray-500">
              {new Date(entry.changedAt).toLocaleString()}
            </p>
            {entry.note && <p className="text-xs text-gray-400 mt-0.5">{entry.note}</p>}
          </li>
        ))}
        {isRejected && !history.some((h) => h.status === 'rejected') && (
          <li className="ml-4">
            <span className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-red-500 ring-4 ring-white dark:ring-gray-800" />
            <p className="text-sm font-medium text-red-600">Rejected</p>
          </li>
        )}
      </ol>
    </div>
  );
};

export default ApplicationTimeline;
