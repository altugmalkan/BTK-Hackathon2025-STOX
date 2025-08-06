// Authentication Page - Login and Registration

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type AuthMode = 'login' | 'register';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { isAuthenticated, isLoading } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <img src="/logo.png" alt="Stox" className="h-12 w-auto" />
          <span className="text-2xl font-gotham-black">stox</span>
        </div>

        {/* Auth Forms */}
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}

        {/* Terms and Privacy */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Devam ederek, Stox\'un{' '}
          <a href="#" className="underline hover:text-foreground">
            Hizmet Şartlarını
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-foreground">
            Gizlilik Politikasını
            onaylıyorsunuz.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;