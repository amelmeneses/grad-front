import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';
import Forbidden from './Forbidden';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: number[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    // 401: no está logueado
    return <Navigate to="/login" replace />;
  }
  const role = getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    // 403: está logueado pero sin permiso
    return <Forbidden />;
  }
  // autorizado
  return children;
}
