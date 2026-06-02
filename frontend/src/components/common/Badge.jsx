const colors = {
  'full-time': 'bg-green-100 text-green-800',
  'part-time': 'bg-yellow-100 text-yellow-800',
  contract: 'bg-purple-100 text-purple-800',
  internship: 'bg-pink-100 text-pink-800',
  remote: 'bg-blue-100 text-blue-800',
  entry: 'bg-gray-100 text-gray-700',
  mid: 'bg-indigo-100 text-indigo-800',
  senior: 'bg-orange-100 text-orange-800',
  lead: 'bg-red-100 text-red-800',
};

const Badge = ({ label }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[label] || 'bg-gray-100 text-gray-700'}`}>
    {label}
  </span>
);

export default Badge;
