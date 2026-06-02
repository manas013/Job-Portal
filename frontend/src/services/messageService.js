import api from './api';

export const fetchConversations = () => api.get('/messages/conversations').then((r) => r.data);
export const fetchMessages = (userId) => api.get(`/messages/${userId}`).then((r) => r.data);
export const sendMessage = (data) => api.post('/messages', data).then((r) => r.data);
