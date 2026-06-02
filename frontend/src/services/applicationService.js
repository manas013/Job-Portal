import api from './api';

export const fetchMyApplications = () => api.get('/applications/me').then((r) => r.data);
export const fetchPipeline = () => api.get('/applications/pipeline').then((r) => r.data);
export const fetchJobApplicants = (jobId) =>
  api.get(`/applications/job/${jobId}`).then((r) => r.data);
export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data).then((r) => r.data);
export const withdrawApplication = (id) =>
  api.post(`/applications/${id}/withdraw`).then((r) => r.data);
