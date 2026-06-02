import api from './api';

export const fetchAnalytics = () => api.get('/analytics').then((r) => r.data);
