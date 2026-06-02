import { useEffect, useState } from 'react';
import { fetchUsers, toggleUserActive, adminDeleteJob } from '../services/userService';
import { fetchJobs, deleteJob } from '../services/jobService';
import toast from 'react-hot-toast';
import Badge from '../components/common/Badge';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    const [u, j] = await Promise.all([fetchUsers(), fetchJobs({ limit: 50 })]);
    setUsers(u);
    setJobs(j.jobs);
  };

  useEffect(() => { load(); }, []);

  const toggleUser = async (id) => {
    await toggleUserActive(id);
    toast.success('User updated');
    load();
  };

  const removeJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    await adminDeleteJob(id).catch(() => deleteJob(id));
    toast.success('Job deleted');
    load();
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Admin panel</h1>
      <section>
        <h2 className="text-lg font-semibold mb-4">Users ({users.length})</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td><Badge label={u.role} /></td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button type="button" className="text-primary-600 text-xs" onClick={() => toggleUser(u._id)}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4">All jobs</h2>
        <ul className="space-y-2">
          {jobs.map((j) => (
            <li key={j._id} className="card flex justify-between items-center py-3">
              <span>{j.title} — {j.company}</span>
              <button type="button" className="text-red-500 text-sm" onClick={() => removeJob(j._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
