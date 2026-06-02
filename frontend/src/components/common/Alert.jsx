const variants = {
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const Alert = ({ message, variant = 'error' }) => {
  if (!message) return null;
  return (
    <div className={`rounded-lg border p-4 text-sm ${variants[variant]}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
