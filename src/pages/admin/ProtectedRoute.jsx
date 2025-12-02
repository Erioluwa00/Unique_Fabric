import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, getUserRole } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin - if yes, redirect to admin panel
  const userRole = getUserRole();
  const isAdmin = ['admin', 'manager', 'staff'].includes(userRole);
  
  if (isAdmin) {
    // If admin tries to access any protected user route, redirect to admin panel
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;