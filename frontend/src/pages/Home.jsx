import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
import useAuth from '../hooks/useAuth';
import { fetchRecommendedJobs } from '../services/jobService';
import JobCard from '../components/common/JobCard';
import Spinner from '../components/common/Spinner';

/* Dot-grid SVG data URI used as a repeating background texture */
const DOT_GRID =
  "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23ffffff' fill-opacity='0.25'/%3E%3C/svg%3E";

const STATS = [
  { label: 'Jobs Posted', value: '12,000+' },
  { label: 'Companies', value: '3,500+' },
  { label: 'Hired Monthly', value: '8,000+' },
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'Smart Search',
    desc: 'Filter by role, type, experience level, and location in seconds.',
  },
  {
    icon: '🚀',
    title: 'One-Click Apply',
    desc: 'Apply to jobs instantly — no repetitive form filling.',
  },
  {
    icon: '🏢',
    title: 'Top Employers',
    desc: 'Connect with verified companies actively looking to hire.',
  },
];

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { jobs, loading } = useJobs({ limit: 6 });
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'jobseeker') {
      setRecLoading(true);
      fetchRecommendedJobs()
        .then((data) => setRecommended(data.slice(0, 4)))
        .finally(() => setRecLoading(false));
    }
  }, [isAuthenticated, user?.role]);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-24">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 animate-gradient-x" />
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url("${DOT_GRID}")` }}
        />
        {/* Animated blobs */}
        <div
          aria-hidden
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-400 opacity-30 blur-3xl animate-blob"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -right-10 w-[28rem] h-[28rem] rounded-full bg-purple-500 opacity-25 blur-3xl animate-blob animation-delay-2000"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-400 opacity-20 blur-2xl animate-blob animation-delay-4000"
        />
        {/* Floating ring decoration */}
        <div
          aria-hidden
          className="absolute top-8 right-16 w-24 h-24 rounded-full border-2 border-white/20 animate-spin-slow"
        />
        <div
          aria-hidden
          className="absolute bottom-12 left-12 w-14 h-14 rounded-full border border-white/30 animate-float animation-delay-1000"
        />

        {/* Content */}
        <div className="relative text-center">
          <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white/90 tracking-widest uppercase mb-6 animate-slide-down">
            Your career starts here
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight animate-fade-in-up animation-delay-150">
            Find Your{' '}
            <span className="relative inline-block">
              <span className="animate-shimmer bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent">
                Dream Job
              </span>
            </span>
            <br />
            Today
          </h1>
          <p className="mt-5 text-lg text-blue-100 max-w-xl mx-auto animate-fade-in-up animation-delay-300">
            Connect with top employers and land the role you deserve — no fluff,
            just real opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-500">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-semibold text-indigo-700 shadow-lg hover:bg-blue-50 transition-colors"
            >
              Browse Jobs
              <span className="animate-bounce-x">→</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl border-2 border-white/60 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 animate-fade-in-up animation-delay-700">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="mt-16 grid sm:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="card text-center hover:shadow-md transition-shadow animate-fade-in-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {isAuthenticated && user?.role === 'jobseeker' && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recommended for you</h2>
            <Link to="/jobs" className="text-sm text-primary-600 hover:underline">See more →</Link>
          </div>
          {recLoading ? (
            <Spinner />
          ) : recommended.length === 0 ? (
            <p className="text-sm text-gray-500">Complete your profile skills to get better matches.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recommended.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Latest Jobs ─────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Latest Openings</h2>
          <Link to="/jobs" className="text-sm text-primary-600 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No jobs yet — check back soon!</p>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <div
                key={job._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
