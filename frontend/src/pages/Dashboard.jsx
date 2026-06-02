import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useJobs from '../hooks/useJobs';
import { fetchSavedJobs } from '../services/savedJobService';
import { fetchMyApplications } from '../services/applicationService';
import { fetchAlerts } from '../services/alertService';
import { fetchRecommendedJobs } from '../services/jobService';
import { fetchProfile } from '../services/userService';
import { useEffect, useState } from 'react';
import JobCard from '../components/common/JobCard';
import Spinner from '../components/common/Spinner';
import Avatar from '../components/common/Avatar';
import { deleteJob } from '../services/jobService';
import toast from 'react-hot-toast';

const Icons = {
  applications: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  saved: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  alerts: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  profile: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  messages: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  post: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  analytics: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  company: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  pipeline: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  interviews: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  admin: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

const QuickCard = ({ link, profileUser }) => {
  const isProfile = link.id === 'profile';
  const colorMap = {
    applications: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    saved: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    alerts: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    profile: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    messages: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    post: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    analytics: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    pipeline: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    company: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    interviews: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    admin: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  const colors = colorMap[link.id] || colorMap.profile;

  return (
    <Link
      to={link.to}
      className="card hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center py-5 px-3 min-h-[130px] gap-2"
    >
      {isProfile ? (
        <div className="flex flex-col items-center gap-2">
          <Avatar user={profileUser} size="lg" />
          {!profileUser?.avatar && (
            <span className={`p-2 rounded-full ${colors}`}>{Icons.profile}</span>
          )}
        </div>
      ) : (
        <span className={`p-3 rounded-xl ${colors}`}>{Icons[link.id]}</span>
      )}
      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{link.label}</p>
      {link.count !== undefined && (
        <p className="text-xl font-bold text-primary-600">{link.count}</p>
      )}
    </Link>
  );
};

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const isEmployer = user?.role === 'employer' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const isSeeker = user?.role === 'jobseeker';

  const jobParams = isEmployer ? { mine: 'true', limit: 12 } : { limit: 8 };
  const { jobs, loading, refetch } = useJobs(jobParams);
  const [savedCount, setSavedCount] = useState(0);
  const [appCount, setAppCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        setProfileUser(p);
        refreshUser();
      })
      .catch(() => setProfileUser(user));
  }, []);

  useEffect(() => {
    if (isSeeker) {
      fetchSavedJobs().then((j) => setSavedCount(j.length));
      fetchMyApplications().then((a) => setAppCount(a.length));
      fetchAlerts().then((a) => setAlertCount(a.length));
      fetchRecommendedJobs().then((j) => setRecommended(j.slice(0, 4)));
    }
  }, [isSeeker]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    await deleteJob(id);
    toast.success('Job deleted');
    refetch();
  };

  const quickLinks = [
    ...(isSeeker
      ? [
          { id: 'applications', to: '/applications', label: 'My applications', count: appCount },
          { id: 'saved', to: '/saved-jobs', label: 'Saved jobs', count: savedCount },
          { id: 'alerts', to: '/alerts', label: 'Job alerts', count: alertCount },
        ]
      : []),
    ...(isEmployer
      ? [
          { id: 'post', to: '/jobs/new', label: 'Post a job' },
          { id: 'pipeline', to: '/pipeline', label: 'Applicant pipeline' },
          { id: 'analytics', to: '/analytics', label: 'Analytics' },
          { id: 'company', to: '/profile', label: 'Company profile' },
        ]
      : []),
    ...(isAdmin ? [{ id: 'admin', to: '/admin', label: 'Admin panel' }] : []),
    { id: 'profile', to: '/profile', label: 'Profile' },
    { id: 'messages', to: '/messages', label: 'Messages' },
    { id: 'interviews', to: '/interviews', label: 'Interviews' },
  ];

  const displayUser = profileUser || user;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-primary-100 dark:border-gray-700">
        <Avatar user={displayUser} size="xl" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome, {displayUser?.name}</h1>
          <p className="text-sm text-gray-500 capitalize">{displayUser?.role} dashboard</p>
          {displayUser?.avatar && (
            <p className="text-xs text-green-600 mt-1">Profile photo active</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((l) => (
          <QuickCard key={`${l.id}-${l.to}`} link={l} profileUser={displayUser} />
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">{isEmployer ? 'Your job listings' : 'Recommended for you'}</h2>
      {loading && isEmployer ? (
        <Spinner />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {(isSeeker ? (recommended.length ? recommended : jobs) : jobs).map((job) => (
            <div key={job._id} className="relative">
              <JobCard job={job} />
              {isEmployer && (
                <div className="flex gap-2 mt-2">
                  <Link to={`/jobs/${job._id}/edit`} className="text-xs btn-secondary py-1 px-2">Edit</Link>
                  <Link to={`/jobs/${job._id}/applicants`} className="text-xs btn-primary py-1 px-2">Applicants</Link>
                  <button type="button" className="text-xs text-red-500" onClick={() => handleDelete(job._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
