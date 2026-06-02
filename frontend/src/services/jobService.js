import api from './api';

export const fetchJobs = (params) => api.get('/jobs', { params }).then((r) => r.data);
export const fetchRecommendedJobs = () => api.get('/jobs/recommended/list').then((r) => r.data);
export const fetchJob = (id) => api.get(`/jobs/${id}`).then((r) => r.data);
export const fetchMatchScore = (id) => api.get(`/jobs/${id}/match-score`).then((r) => r.data);
export const generateCoverLetter = (id) =>
  api.post(`/jobs/${id}/cover-letter`).then((r) => r.data);
export const createJob = (data) => api.post('/jobs', data).then((r) => r.data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
export const applyJob = (id, data) => api.post(`/jobs/${id}/apply`, data).then((r) => r.data);
