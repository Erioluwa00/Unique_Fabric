// pages/admin/RoleProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'staff'],
  requireAdmin = false 
}) => {
  const { user, loading, getUserRole } = useContext(AuthContext);
  const location = useLocation();

  // Show loading while checking authentication
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

  // Get user role
  const userRole = getUserRole();

  // If route requires admin privileges but user is not admin/manager/staff
  if (requireAdmin && !['admin', 'manager', 'staff'].includes(userRole)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need administrator privileges to access this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Your role: <strong>{userRole}</strong> | Required: <strong>{allowedRoles.join(', ')}</strong></p>
        <Navigate to="/admin" replace />
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;