// Authentication Context and Provider

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';
import type {
  User,
  AuthContextType,
  LoginRequest,
  RegisterRequest
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        // Validate stored token
        const isValid = await validateToken();
        if (isValid) {
          setToken(storedToken);
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid data
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(credentials);
      
      if (response.success && response.userData && response.tokenData) {
        setUser(response.userData);
        setToken(response.tokenData.accessToken);
        authService.storeUser(response.userData);
        
        toast({
          title: "Login Successful",
          description: response.message || "Welcome back!",
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      if (response.success && response.userData && response.tokenData) {
        setUser(response.userData);
        setToken(response.tokenData.accessToken);
        authService.storeUser(response.userData);
        
        toast({
          title: "Registration Successful",
          description: response.message || "Welcome to our platform!",
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user and clear state
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  /**
   * Validate current token
   */
  const validateToken = async (): Promise<boolean> => {
    try {
      const currentToken = token || authService.getStoredToken();
      if (!currentToken) return false;

      const response = await authService.validateToken(currentToken);
      return response.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  /**
   * Refresh token if needed
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const success = await authService.refreshTokenIfNeeded();
      if (!success) {
        logout();
        throw new Error('Session expired. Please login again.');
      }
    } catch (error: unknown) {
      toast({
        title: "Session Expired",
        description: error instanceof Error ? error.message : "Please login again.",
        variant: "destructive",
      });
      logout();
      throw error;
    }
  };

  // Auto-refresh token every 10 minutes
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      refreshToken().catch(() => {
        // Error already handled in refreshToken function
      });
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!(user && token),
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    validateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook for authentication state only (lighter version)
 */
export const useAuthState = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
};