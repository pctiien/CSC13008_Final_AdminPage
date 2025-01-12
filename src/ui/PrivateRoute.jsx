import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user } = useAuth(); // Lấy thông tin user từ context
  if (!user) {
    // Nếu không có user, chuyển hướng về trang login
    return <Navigate to="/" replace />;
  }

  // Nếu có user, render các component bên trong route
  return <Outlet />;
};

export default PrivateRoute;
