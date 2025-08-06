import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { api, AuthResponse } from "@/lib/api";

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Customer" | "Seller" | "Admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to check existing token
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  registerSeller: (sellerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    storeName: string;
    logoUrl?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = api.getAuthToken();
      if (token) {
        try {
          // Verify token is still valid
          const response = await api.testToken();
          if (response.isAuthenticated) {
            // Extract user info from token response
            const user: User = {
              id: response.userId,
              firstName: "", // We'll need to get this from somewhere
              lastName: "",
              email: response.userName,
              role: response.roles[0] as "Customer" | "Seller" | "Admin",
            };

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, token },
            });
          } else {
            // Token is invalid, clear it
            api.setAuthToken(null);
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          // Token verification failed, clear it
          api.setAuthToken(null);
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkExistingAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response: AuthResponse = await api.login({ email, password });

      if (response.isAuthenticated && response.token) {
        const user: User = {
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          email: response.email || email,
          role:
            (response.role as "Customer" | "Seller" | "Admin") || "Customer",
        };

        // Set token in API client
        api.setAuthToken(response.token);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: response.token },
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const registerUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response: AuthResponse = await api.registerUser({
        ...userData,
        role: "Customer",
      });

      if (response.isAuthenticated && response.token) {
        const user: User = {
          firstName: response.firstName || userData.firstName,
          lastName: response.lastName || userData.lastName,
          email: response.email || userData.email,
          role: "Customer",
        };

        // Set token in API client
        api.setAuthToken(response.token);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: response.token },
        });
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const registerSeller = async (sellerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    storeName: string;
    logoUrl?: string;
  }) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { password, ...sellerDataSafe } = sellerData;
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Calling API registerSeller with:', { ...sellerDataSafe, password: '[REDACTED]' });
      }
      const response: AuthResponse = await api.registerSeller(sellerData);
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Received response:', response);
      }

      if (response.isAuthenticated && response.token) {
        const user: User = {
          firstName: response.firstName || sellerData.firstName,
          lastName: response.lastName || sellerData.lastName,
          email: response.email || sellerData.email,
          role: "Seller",
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: Setting token and user:', { user, token: response.token });
        }
        // Set token in API client
        api.setAuthToken(response.token);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: response.token },
        });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('AuthContext: Response missing isAuthenticated or token:', response);
        }
        throw new Error(response.message || "Seller registration failed");
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('AuthContext: registerSeller error:', error);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Seller registration failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    api.setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    state,
    login,
    registerUser,
    registerSeller,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
