const EmptyState = ({ title, message, action }) => (
  <div className="text-center py-16 px-4">
    <div className="text-4xl mb-3">📭</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
