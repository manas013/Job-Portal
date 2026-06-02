import api from './api';

export const fetchMyCompany = () => api.get('/companies').then((r) => r.data);
export const upsertCompany = (data) => api.put('/companies', data).then((r) => r.data);
export const fetchCompany = (id) => api.get(`/companies/${id}`).then((r) => r.data);
export const fetchCompanyPublic = (id) => api.get(`/companies/public/${id}`).then((r) => r.data);
export const uploadCompanyLogo = (file) => {
  const form = new FormData();
  form.append('logo', file);
  return api.post('/companies/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
