import api from './api';

export const fetchInterviews = () => api.get('/interviews').then((r) => r.data);
export const proposeInterview = (data) => api.post('/interviews', data).then((r) => r.data);
export const selectInterviewSlot = (id, slotId) =>
  api.put(`/interviews/${id}/select`, { slotId }).then((r) => r.data);
export const cancelInterview = (id) => api.put(`/interviews/${id}/cancel`).then((r) => r.data);
