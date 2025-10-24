import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AdminAuthGuardProps {
  children: ReactNode;
  requiredRole?: 'ai_admin' | 'super_admin';
  redirectTo?: string;
}

const AdminAuthGuard = ({ 
  children, 
  requiredRole = 'ai_admin', 
  redirectTo = '/' 
}: AdminAuthGuardProps) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      setRoleLoading(true);
      
      const { data: userRoleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error checking user role:', error);
        setHasAccess(false);
        return;
      }

      const userRoleValue = userRoleData?.role || 'basic_user';
      setUserRole(userRoleValue);
      
      // Check if user has required role or higher
      const hasRequiredRole = checkRoleHierarchy(userRoleValue, requiredRole);
      setHasAccess(hasRequiredRole);
      
    } catch (error) {
      console.error('Error in checkUserRole:', error);
      setHasAccess(false);
    } finally {
      setRoleLoading(false);
    }
  };

  const checkRoleHierarchy = (userRole: string, requiredRole: string): boolean => {
    const roleHierarchy = {
      'basic_user': 0,
      'authenticated': 1,
      'employee': 2,
      'manager': 3,
      'ai_admin': 4,
      'super_admin': 5
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have the required permissions to access this area.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Current Role: <span className="font-medium">{userRole || 'Unknown'}</span></p>
            <p>Required Role: <span className="font-medium">{requiredRole}</span></p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;