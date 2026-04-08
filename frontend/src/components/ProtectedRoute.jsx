import { Navigate, useLocation } from 'react-router-dom';

import Loader from './Loader';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return <Loader label="Проверяем сессию" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
