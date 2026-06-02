import { Link } from 'react-router-dom';
import Badge from './Badge';
import MatchBadge from './MatchBadge';

const JobCard = ({ job }) => (
  <div className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 truncate block">
          {job.title}
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{job.company} · {job.location}</p>
      </div>
      <div className="flex flex-col gap-2 items-end flex-shrink-0">
        {job.matchScore != null && <MatchBadge score={job.matchScore} />}
        <div className="flex gap-2">
          <Badge label={job.type} />
          <Badge label={job.experience} />
        </div>
      </div>
    </div>
    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{job.description}</p>
    {job.skills?.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1">
        {job.skills.slice(0, 5).map((s) => (
          <span key={s} className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">{s}</span>
        ))}
      </div>
    )}
    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
      <span>{job.applicants?.length ?? 0} applicants</span>
      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);

export default JobCard;
