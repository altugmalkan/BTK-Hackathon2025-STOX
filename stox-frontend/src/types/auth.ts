// Authentication Type Definitions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin' | 'moderator';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userData: User;
  tokenData: TokenData;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  userData: User;
  tokenData: TokenData;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  userId: string;
  email: string;
  role: string;
  exp: number;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  userData: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

export interface ValidationError {
  field: string;
  message: string;
}