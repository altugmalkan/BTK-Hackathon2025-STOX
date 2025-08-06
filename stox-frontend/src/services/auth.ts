// Authentication Service Functions

import { apiClient } from '@/lib/api';
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  ProfileResponse,
  User,
  TokenData
} from '@/types/auth';

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
      
      // Store tokens after successful registration
      if (response.tokenData) {
        this.storeTokens(response.tokenData);
      }
      
      return response;
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login existing user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Store tokens after successful login
      if (response.tokenData) {
        this.storeTokens(response.tokenData);
      }
      
      return response;
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Validate JWT token
   */
  async validateToken(token?: string): Promise<ValidateTokenResponse> {
    const tokenToValidate = token || this.getStoredToken();
    
    if (!tokenToValidate) {
      throw new Error('No token provided');
    }

    try {
      const response = await apiClient.post<ValidateTokenResponse>('/auth/validate', {
        token: tokenToValidate
      });
      
      return response;
    } catch (error: unknown) {
      // If token is invalid, remove it from storage
      this.clearTokens();
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>('/auth/profile', {
        userId
      });
      
      return response;
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user (clear tokens)
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();
    return !!(token && refreshToken);
  }

  /**
   * Get current access token
   */
  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get current refresh token
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userJson = localStorage.getItem('userData');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Store tokens and user data in localStorage
   */
  private storeTokens(tokenData: TokenData, userData?: User): void {
    localStorage.setItem('accessToken', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    localStorage.setItem('tokenExpiry', (Date.now() + tokenData.expiresIn * 1000).toString());
    
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  /**
   * Store user data separately
   */
  storeUser(userData: User): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  /**
   * Clear all stored authentication data
   */
  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userData');
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    
    return Date.now() > parseInt(expiry);
  }

  /**
   * Auto-refresh token if needed
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isTokenExpired()) {
      return true;
    }

    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return false;
    }

    try {
      // Note: This would typically call a refresh endpoint
      // For now, we'll validate the current token
      const currentToken = this.getStoredToken();
      if (currentToken) {
        await this.validateToken(currentToken);
        return true;
      }
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Handle authentication errors consistently
   */
  private handleAuthError(error: unknown): Error {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      this.clearTokens();
    }
    
    // Format validation errors
    if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
      const messages = error.errors.map((err: { message: string }) => err.message).join(', ');
      return new Error(messages);
    }
    
    return error instanceof Error ? error : new Error(String(error));
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();