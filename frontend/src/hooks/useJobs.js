import { useState, useEffect, useCallback } from 'react';
import { fetchJobs } from '../services/jobService';

const useJobs = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobs(params);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, total, pages, loading, error, params, setParams, refetch: load };
};

export default useJobs;
