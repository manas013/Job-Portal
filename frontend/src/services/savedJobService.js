import api from './api';

export const fetchSavedJobs = () => api.get('/saved-jobs').then((r) => r.data);
export const saveJob = (jobId) => api.post(`/saved-jobs/${jobId}`).then((r) => r.data);
export const unsaveJob = (jobId) => api.delete(`/saved-jobs/${jobId}`).then((r) => r.data);
