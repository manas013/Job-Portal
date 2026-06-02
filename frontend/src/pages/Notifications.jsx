import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchNotifications, markAllRead, markOneRead } from '../services/notificationService';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => fetchNotifications().then(setItems).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleClick = async (n) => {
    if (!n.read) {
      await markOneRead(n._id);
      setItems((list) => list.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    }
    if (n.link) navigate(n.link);
  };

  if (loading) return <Spinner />;

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-500">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button type="button" className="btn-secondary text-sm" onClick={handleMarkAll}>
            Mark all read
          </button>
        )}
      </div>

      {!items.length ? (
        <EmptyState title="No notifications" message="You're all caught up!" />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n._id}>
              <button
                type="button"
                onClick={() => handleClick(n)}
                className={`card w-full text-left hover:shadow-md transition-shadow ${
                  !n.read ? 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex justify-between gap-2">
                  <p className="font-medium text-sm">{n.title}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                {n.link && (
                  <span className="text-xs text-primary-600 mt-2 inline-block">View →</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
