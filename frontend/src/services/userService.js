import api from './api';

export const fetchProfile = () => api.get('/users/profile').then((r) => r.data);
export const updateProfile = (data) => api.put('/users/profile', data).then((r) => r.data);
export const uploadResume = (file) => {
  const form = new FormData();
  form.append('resume', file);
  return api.post('/users/upload/resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append('avatar', file);
  return api.post('/users/upload/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
export const fetchUsers = () => api.get('/users').then((r) => r.data);
export const toggleUserActive = (id) =>
  api.put(`/users/${id}/toggle-active`).then((r) => r.data);
export const adminDeleteJob = (id) =>
  api.delete(`/users/jobs/${id}`).then((r) => r.data);
