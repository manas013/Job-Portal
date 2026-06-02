import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { setToken, setRefreshToken } from '../utils/storage';
import { fetchMe } from '../services/authService';
import Spinner from '../components/common/Spinner';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromCallback } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setToken(token);
    setRefreshToken(refreshToken);
    fetchMe()
      .then((user) => {
        setAuthFromCallback({ token, refreshToken, user });
        navigate('/dashboard');
      })
      .catch(() => navigate('/login'));
  }, [params, navigate, setAuthFromCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default AuthCallback;
