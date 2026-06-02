import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ token, password });
      toast.success('Password updated');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Reset password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" className="input" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Saving…' : 'Update password'}</button>
        </form>
        <Link to="/login" className="text-sm text-primary-600 mt-4 inline-block">Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
