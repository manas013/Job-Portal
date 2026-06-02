import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

export default GuestRoute;
