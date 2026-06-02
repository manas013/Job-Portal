import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchCompanyPublic } from '../services/companyService';
import { mediaUrl } from '../utils/mediaUrl';
import JobCard from '../components/common/JobCard';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const CompanyPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyPublic(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!data?.company) {
    return <EmptyState title="Company not found" message="This company page does not exist." />;
  }

  const { company, jobs } = data;

  return (
    <>
      <Helmet>
        <title>{company.name} | JobPortal Careers</title>
        <meta name="description" content={company.description?.slice(0, 160) || `${company.name} open positions`} />
      </Helmet>
      <div>
        <div className="card mb-8 flex flex-col sm:flex-row gap-6 items-start">
          {company.logo ? (
            <img
              src={mediaUrl(company.logo)}
              alt={company.name}
              className="w-24 h-24 rounded-xl object-cover border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600">
              {company.name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{company.name}</h1>
            {company.location && (
              <p className="text-gray-500 mt-1">📍 {company.location}</p>
            )}
            {company.website && (
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary-600 mt-2 inline-block"
              >
                Visit website →
              </a>
            )}
            {company.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{company.description}</p>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Open positions ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <EmptyState title="No open jobs" message="Check back later for new openings." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
        <Link to="/jobs" className="btn-secondary mt-6 inline-block">Browse all jobs</Link>
      </div>
    </>
  );
};

export default CompanyPage;
