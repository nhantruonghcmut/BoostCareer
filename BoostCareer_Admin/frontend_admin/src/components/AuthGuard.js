import React from 'react';
import { useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
// import { CSpinner } from '@coreui/react';

/**
 * AuthGuard component that wraps protected routes
 * Uses authEnabled flag from Redux state to determine whether to enforce authentication
 */
const AuthGuard = ({ children }) => {
  // Get auth state from Redux with fallback values if it's undefined
  const auth = useSelector((state) => state.auth) || { 
    token: null, 
    loading: false,
    authEnabled: false 
  };

  // Safely access auth properties with default values
  const { token = null, loading = false, authEnabled = false } = auth;
  
  // Log authentication state
  console.log('Auth state:', { token, loading, authEnabled });
  
  // If authentication is disabled, always return children
  if (!authEnabled) {
    return children;
  }
  
  // Authentication is enabled but has been temporarily disabled in this component
  // Always return children without checking authentication
  return children;

  /* AUTHENTICATION LOGIC TEMPORARILY DISABLED
  const location = useLocation();

  // If auth is loading, show spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    // Save the location the user was trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  */

  // If authenticated, render children
  return children;
};

export default AuthGuard;
