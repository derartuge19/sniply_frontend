import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export function StaffRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Note: is_staff is not currently in the user object from login/register
  // This will need to be updated once backend includes it, or we fetch from admin endpoint
  // For now, we'll check a flag in localStorage or fetch admin data
  const isStaff = localStorage.getItem('is_staff') === 'true';
  
  if (!isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
