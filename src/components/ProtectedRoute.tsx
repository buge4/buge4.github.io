import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'veriton_genesis_access',
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        navigate(redirectTo, { replace: true });
      } else {
        // Map roles to access permissions
        const hasAccess = () => {
          if (!requiredRole) return true;
          
          // super_admin has access to everything
          if (userRole === 'super_admin') return true;
          
          // For veriton-genesis access
          if (requiredRole === 'veriton_genesis_access' && userRole === 'super_admin') return true;
          
          // For admin panel access
          if (requiredRole === 'admin' && (userRole === 'super_admin' || userRole === 'ai_admin')) return true;
          
          // Exact role match
          if (userRole === requiredRole) return true;
          
          return false;
        };

        if (!hasAccess()) {
          setAccessDenied(true);
        }
      }
    }
  }, [user, userRole, loading, navigate, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="text-[#c8d0dd] text-lg">Loading...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-[#1a1f35] rounded-xl p-8 border border-[#ff3355]">
            <h2 className="text-3xl font-bold text-[#ff3355] mb-4">
              Access Denied
            </h2>
            <p className="text-[#c8d0dd] mb-6">
              You do not have permission to access this page.
            </p>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="px-6 py-3 bg-[#00d9ff] text-[#0a0e1a] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-150"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
