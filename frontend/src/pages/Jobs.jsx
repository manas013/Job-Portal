import { useState } from 'react';
import useJobs from '../hooks/useJobs';
import JobCard from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'salary-desc', label: 'Salary: High to low' },
  { value: 'salary-asc', label: 'Salary: Low to high' },
  { value: 'deadline', label: 'Deadline soonest' },
];

const Jobs = () => {
  const [search, setSearch] = useState('');
  const { jobs, total, pages, loading, error, params, setParams } = useJobs({ page: 1, limit: 12 });

  const handleSearch = (e) => {
    e.preventDefault();
    setParams((p) => ({ ...p, search, page: 1 }));
  };

  const handleFilter = (key, value) =>
    setParams((p) => ({ ...p, [key]: value || undefined, page: 1 }));

  const handlePage = (page) => setParams((p) => ({ ...p, page }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">{total} jobs available</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1"
          placeholder="Search jobs, companies, skills..."
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        <select onChange={(e) => handleFilter('type', e.target.value)} className="input w-auto text-sm" value={params.type || ''}>
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select onChange={(e) => handleFilter('experience', e.target.value)} className="input w-auto text-sm" value={params.experience || ''}>
          <option value="">All Levels</option>
          {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select onChange={(e) => handleFilter('sort', e.target.value)} className="input w-auto text-sm" value={params.sort || ''}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="Min salary"
          className="input w-28 text-sm"
          onChange={(e) => handleFilter('salaryMin', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max salary"
          className="input w-28 text-sm"
          onChange={(e) => handleFilter('salaryMax', e.target.value)}
        />
      </div>

      {error && <Alert message={error} />}
      {loading ? (
        <div className="grid gap-4">{[1, 2, 3, 4].map((i) => <JobCardSkeleton key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs found" message="Try adjusting your filters or search terms." />
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePage(p)}
                  className={p === params.page ? 'btn-primary px-3 py-1.5 text-sm' : 'btn-secondary px-3 py-1.5 text-sm'}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
