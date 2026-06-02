const TOKEN_KEY = 'jp_token';
const REFRESH_KEY = 'jp_refresh';
const USER_KEY = 'jp_user';
const THEME_KEY = 'jp_theme';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_KEY);

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const getTheme = () => localStorage.getItem(THEME_KEY) || 'light';
export const setTheme = (theme) => localStorage.setItem(THEME_KEY, theme);

export const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return !exp || exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const clearAuth = () => {
  removeToken();
  removeRefreshToken();
  removeUser();
};
