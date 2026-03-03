// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../ui/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader variant="fullPage" color="green" text="Authenticating..." />;
  }

  if (!isAuthenticated()) {
    // Save current location for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for userType instead of role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;