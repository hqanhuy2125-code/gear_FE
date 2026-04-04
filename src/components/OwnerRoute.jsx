import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * OwnerRoute: Chỉ cho phép role 'owner'.
 * - admin   → redirect /admin/dashboard
 * - customer / chưa đăng nhập → redirect /login hoặc /
 */
const OwnerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role !== 'owner') return <Navigate to="/" replace />;
  return children;
};

export default OwnerRoute;
