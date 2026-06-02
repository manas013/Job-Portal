import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '../components/common/Alert';
import AnimatedBlobs from '../components/common/AnimatedBlobs';
import { USER_ROLES } from '../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: form ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12 order-2 lg:order-1">
        <div className="w-full max-w-md animate-fade-in-left">
          <Link to="/" className="text-xl font-bold text-primary-600 block mb-8 lg:hidden">
            JobPortal
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
          <Alert message={error} />
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  className="input" placeholder="John Doe" required
                />
              </div>
              <div className="sm:col-span-2">
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
                  className="input" placeholder="Min. 6 chars" required minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select name="role" value={form.role} onChange={handleChange} className="input capitalize">
                  {USER_ROLES.map((r) => (
                    <option key={r} value={r} className="capitalize">{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { role: 'jobseeker', icon: '🧑‍💼', label: 'Job Seeker', desc: 'Find & apply to jobs' },
                { role: 'employer', icon: '🏢', label: 'Employer', desc: 'Post & manage listings' },
              ].map(({ role, icon, label, desc }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role }))}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    form.role === role
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Right panel: animated illustration ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 flex-col items-center justify-center p-12 overflow-hidden order-1 lg:order-2">
        <AnimatedBlobs />
        <div
          aria-hidden
          className="absolute bottom-10 right-10 w-20 h-20 rounded-full border-2 border-white/25 animate-spin-slow"
        />
        <div
          aria-hidden
          className="absolute top-16 left-8 w-12 h-12 rounded-full border border-white/30 animate-float animation-delay-2000"
        />
        <div className="relative text-white text-center">
          {/* SVG users icon */}
          <svg
            className="w-24 h-24 mx-auto mb-6 animate-float animation-delay-300"
            fill="none"
            viewBox="0 0 96 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="30" r="14" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2.5" />
            <circle cx="64" cy="30" r="14" fill="white" fillOpacity="0.10" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M8 76c0-15.464 12.536-28 28-28s28 12.536 28 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M64 48c8.837 0 16 8.059 16 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          </svg>
          <h2 className="text-3xl font-bold mb-3 animate-fade-in-up">Join Our Community</h2>
          <p className="text-purple-200 max-w-xs animate-fade-in-up animation-delay-300">
            Thousands of professionals find their next opportunity on JobPortal every month.
          </p>
          <div className="mt-10 space-y-3 animate-fade-in-up animation-delay-500">
            {[
              '✓  Free to register — always',
              '✓  Instant job match alerts',
              '✓  Direct employer contact',
            ].map((item) => (
              <div key={item} className="glass px-4 py-2.5 text-sm text-white/90 text-left">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
