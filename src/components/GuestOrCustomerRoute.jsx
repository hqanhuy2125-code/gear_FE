import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * GuestOrCustomerRoute: Cho phép Guest (chưa login) hoặc Customer.
 * - admin   → redirect /admin/dashboard
 * - owner   → redirect /owner/dashboard
 */
const GuestOrCustomerRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
  }

  return children;
};

export default GuestOrCustomerRoute;
