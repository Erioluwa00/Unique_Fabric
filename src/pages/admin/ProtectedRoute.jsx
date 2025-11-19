import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Shows loading while checking authentication
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin privileges but user is not admin
  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need administrator privileges to access this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;