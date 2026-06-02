import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchAnalytics } from '../services/analyticsService';
import Spinner from '../components/common/Spinner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics().then(setData);
  }, []);

  if (!data) return <Spinner />;

  const statusData =
    data.applicationsByStatus?.map((s) => ({
      name: s._id || 'unknown',
      count: s.count,
    })) || [];

  const typeData =
    data.jobsByType?.map((t) => ({
      name: t._id || 'unknown',
      value: t.count,
    })) || [];

  const statCards = [
    { label: 'Total jobs', value: data.totalJobs },
    { label: 'Active jobs', value: data.activeJobs },
    { label: 'Applications', value: data.totalApplications },
    ...(data.adminStats?.totalUsers
      ? [
          { label: 'Total users', value: data.adminStats.totalUsers },
          { label: 'Jobseekers', value: data.adminStats.jobseekers },
          { label: 'Employers', value: data.adminStats.employers },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card text-center py-4">
            <p className="text-2xl font-bold text-primary-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-semibold mb-4">Applications by status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No application data yet.</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Jobs by type</h2>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No job type data yet.</p>
          )}
        </div>
      </div>

      {data.recentApplications?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4">Recent applications</h2>
          <ul className="space-y-2">
            {data.recentApplications.map((app) => (
              <li
                key={app._id}
                className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span>
                  <span className="font-medium">{app.applicant?.name}</span>
                  <span className="text-gray-500"> → {app.job?.title}</span>
                </span>
                <span className="capitalize text-gray-500">{app.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Analytics;
