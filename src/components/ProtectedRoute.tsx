import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}