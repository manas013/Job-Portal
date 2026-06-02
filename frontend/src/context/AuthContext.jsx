import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, fetchMe, logoutUser } from '../services/authService';
import {
  getToken,
  setToken,
  setRefreshToken,
  setUser,
  clearAuth,
  getUser,
  getRefreshToken,
  isTokenExpired,
} from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser);
  const [loading, setLoading] = useState(!!getToken());

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      if (!getRefreshToken()) {
        clearAuth();
        setUserState(null);
        setLoading(false);
        return;
      }
    }
    try {
      const u = await fetchMe();
      setUserState(u);
      setUser(u);
    } catch {
      clearAuth();
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser(getRefreshToken());
    } catch {
      /* ignore */
    }
    clearAuth();
    setUserState(null);
  }, []);

  const setAuthFromCallback = useCallback((data) => {
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    setUserState(data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setAuthFromCallback,
        refreshUser: loadUser,
        isAuthenticated: !!user && !!getToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
