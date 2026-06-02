import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <ForgotForm />
  </div>
);

const ForgotForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      toast.success(res.message);
      if (res.resetUrl) console.log('Dev reset URL:', res.resetUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full">
      <h1 className="text-xl font-bold mb-4">Forgot password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      </form>
      <Link to="/login" className="text-sm text-primary-600 mt-4 inline-block">Back to login</Link>
    </div>
  );
};

export default ForgotPassword;
