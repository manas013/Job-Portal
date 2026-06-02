import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
