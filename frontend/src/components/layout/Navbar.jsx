import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import { fetchNotifications, markAllRead } from '../../services/notificationService';
import { googleAuthUrl } from '../../services/authService';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { notifications: liveNotifications } = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications().then(setNotifications);
  }, [isAuthenticated, liveNotifications.length]);

  const allNotifs = [...liveNotifications, ...notifications].slice(0, 10);
  const unread = allNotifs.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMarkRead = async () => {
    await markAllRead();
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    setNotifOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900" onClick={() => setOpen(false)}>Home</Link>
      <Link to="/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900" onClick={() => setOpen(false)}>Browse Jobs</Link>
      {isAuthenticated && (
        <>
          <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Dashboard</Link>
          {user?.role === 'jobseeker' && (
            <>
              <Link to="/applications" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Applications</Link>
              <Link to="/saved-jobs" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Saved</Link>
            </>
          )}
          {(user?.role === 'employer' || user?.role === 'admin') && (
            <>
              <Link to="/pipeline" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Pipeline</Link>
              <Link to="/jobs/new" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Post Job</Link>
            </>
          )}
          <Link to="/notifications" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Notifications</Link>
          <Link to="/interviews" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Interviews</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>Admin</Link>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">JobPortal</Link>

          <div className="hidden md:flex items-center gap-4">{navLinks}</div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="btn-secondary text-xs px-2 py-1" aria-label="Toggle theme">
              {isDark ? '☀️' : '🌙'}
            </button>

            {isAuthenticated && (
              <div className="relative">
                <Link to="/notifications" className="btn-secondary text-xs px-2 py-1 relative inline-flex items-center">
                  🔔 {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{unread}</span>}
                </Link>
                <button type="button" className="btn-secondary text-xs px-2 py-1 hidden sm:inline" onClick={() => setNotifOpen(!notifOpen)} aria-label="Quick preview">
                  ▾
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-72 card z-50 max-h-80 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button type="button" className="text-xs text-primary-600" onClick={handleMarkRead}>Mark all read</button>
                    </div>
                    {allNotifs.length === 0 ? (
                      <p className="text-xs text-gray-500">No notifications</p>
                    ) : (
                      allNotifs.map((n, i) => (
                        <div key={n._id || i} className="text-xs py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="font-medium">{n.title}</p>
                          <p className="text-gray-500">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                  <Avatar user={user} size="sm" />
                  <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">{user?.name}</span>
                </Link>
                <button type="button" onClick={handleLogout} className="btn-secondary text-xs px-3 py-1.5">Logout</button>
              </>
            ) : (
              <>
                <a href={googleAuthUrl()} className="hidden sm:inline btn-secondary text-sm">Google</a>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}

            <button type="button" className="md:hidden btn-secondary text-xs px-2" onClick={() => setOpen(!open)} aria-label="Menu">
              ☰
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
            {navLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
