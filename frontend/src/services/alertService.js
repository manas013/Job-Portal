import api from './api';

export const fetchAlerts = () => api.get('/alerts').then((r) => r.data);
export const createAlert = (data) => api.post('/alerts', data).then((r) => r.data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`).then((r) => r.data);
