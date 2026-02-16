import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import type { DemoProfile } from '../types';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  allowedProfile: DemoProfile;
  children: ReactNode;
}

const ProtectedRoute = ({ allowedProfile, children }: ProtectedRouteProps) => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  if (profile !== allowedProfile) {
    return <Navigate to={profile === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
