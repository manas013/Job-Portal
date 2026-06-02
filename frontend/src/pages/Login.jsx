import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '../components/common/Alert';
import AnimatedBlobs from '../components/common/AnimatedBlobs';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: animated illustration ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex-col items-center justify-center p-12 overflow-hidden">
        <AnimatedBlobs />
        {/* Spinning ring */}
        <div
          aria-hidden
          className="absolute top-12 right-12 w-20 h-20 rounded-full border-2 border-white/25 animate-spin-slow"
        />
        <div
          aria-hidden
          className="absolute bottom-16 left-8 w-12 h-12 rounded-full border border-white/30 animate-float animation-delay-1000"
        />
        <div className="relative text-white text-center">
          {/* SVG briefcase icon */}
          <svg
            className="w-24 h-24 mx-auto mb-6 animate-float"
            fill="none"
            viewBox="0 0 96 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="12" y="32" width="72" height="52" rx="8" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2.5" />
            <path d="M32 32V24a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 52h72" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="48" cy="52" r="4" fill="white" fillOpacity="0.7" />
          </svg>
          <h2 className="text-3xl font-bold mb-3 animate-fade-in-up">Welcome Back!</h2>
          <p className="text-blue-200 max-w-xs animate-fade-in-up animation-delay-300">
            Sign in to access your personalized dashboard and latest job matches.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 animate-fade-in-up animation-delay-500">
            {['10K+ Jobs', '3K+ Firms', '99% Match'].map((s) => (
              <div key={s} className="glass px-3 py-2 text-sm font-semibold text-white/90">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-right">
          <Link to="/" className="text-xl font-bold text-primary-600 block mb-8 lg:hidden">
            JobPortal
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create one free
            </Link>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </p>
          <Alert message={error} />
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                className="input" placeholder="••••••••" required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
