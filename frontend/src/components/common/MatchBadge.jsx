const MatchBadge = ({ score }) => {
  if (score == null) return null;
  const color =
    score >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
    score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}% match
    </span>
  );
};

export default MatchBadge;
