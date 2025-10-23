import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ children, redirectTo = '/chat' }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // For now, we'll redirect to the main page
    // In a real app, you'd redirect to a login page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;