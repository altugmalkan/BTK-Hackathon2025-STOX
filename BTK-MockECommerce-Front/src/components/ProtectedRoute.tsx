import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Customer' | 'Seller' | 'Admin';
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireAuth = true 
}) => {
  const { state } = useAuth();
  const { user, isLoading } = state;
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If specific role is required but user doesn't have it
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirect based on user's actual role
    const redirectPath = user.role === 'Seller' ? '/seller/dashboard' : '/';
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }

  // If user is logged in but trying to access auth pages
  if (!requireAuth && user && (location.pathname === '/login' || location.pathname === '/register')) {
    const redirectPath = user.role === 'Seller' ? '/seller/dashboard' : '/';
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
