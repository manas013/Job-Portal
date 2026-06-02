import api from './api';

export const registerUser = (data) => api.post('/auth/register', data).then((r) => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then((r) => r.data);
export const fetchMe = () => api.get('/auth/me').then((r) => r.data);
export const logoutUser = (refreshToken) => api.post('/auth/logout', { refreshToken });
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then((r) => r.data);
export const resetPassword = (data) =>
  api.post('/auth/reset-password', data).then((r) => r.data);

export const googleAuthUrl = () => {
  const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
  return `${base}/api/auth/google`;
};
