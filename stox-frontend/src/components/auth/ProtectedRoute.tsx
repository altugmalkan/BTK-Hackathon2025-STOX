// Protected Route Component

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'moderator';
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallback 
}) => {
  const { user, isAuthenticated, isLoading } = useAuthState();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // For role-based restrictions, you might want to show an access denied page
    // or redirect to a different route
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold">Erişim Reddedildi</h1>
          <p className="text-muted-foreground">
            Bu sayfaya erişim izniniz yok. Gerekli rol: {requiredRole}
          </p>
          <p className="text-sm text-muted-foreground">
            Mevcut rolünüz: {user?.role || 'bilinmiyor'}
          </p>
        </div>
      </div>
    );
  }

  // If authenticated and has required role (if specified), render children
  return <>{children}</>;
};

export default ProtectedRoute;