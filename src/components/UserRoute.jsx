import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * UserRoute: Chỉ cho phép role 'customer'.
 * - admin   → redirect /admin/dashboard
 * - owner   → redirect /owner/dashboard
 * - chưa đăng nhập → redirect /login (giữ current path để redirect lại sau khi login)
 */
const UserRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'owner') return <Navigate to="/owner/dashboard" replace />;

  return children;
};

export default UserRoute;
