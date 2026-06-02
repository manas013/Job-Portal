import axios from 'axios';
import { API_URL } from '../utils/constants';
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearAuth,
  isTokenExpired,
} from '../utils/storage';

const api = axios.create({ baseURL: API_URL });

let refreshing = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  setToken(data.token);
  setRefreshToken(data.refreshToken);
  return data.token;
};

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'];

const redirectToLogin = () => {
  clearAuth();
  if (!PUBLIC_PATHS.some((p) => window.location.pathname.startsWith(p))) {
    window.location.href = '/login';
  }
};

api.interceptors.request.use(async (config) => {
  let token = getToken();
  if (!token) return config;

  if (isTokenExpired(token)) {
    try {
      if (!refreshing) refreshing = refreshAccessToken();
      token = await refreshing;
      refreshing = null;
    } catch {
      refreshing = null;
      redirectToLogin();
      return Promise.reject(new axios.Cancel('Session expired'));
    }
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) refreshing = refreshAccessToken();
        const token = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        refreshing = null;
        redirectToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
