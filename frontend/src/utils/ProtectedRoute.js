import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { isLogin, user } = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute check:', { isLogin, userRole: user?.role, allowedRoles });

  // Not logged in - redirect to login
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but not authorized for this route
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to home page if user lacks proper role
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;