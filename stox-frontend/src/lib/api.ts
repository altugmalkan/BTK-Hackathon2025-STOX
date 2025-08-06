// API Configuration and HTTP Client Utilities
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://34.88.39.152/api/v1' 
  : '/api/v1'; // Use proxy in development

interface ApiError {
  errors?: Array<{
    field: string;
    message: string;
  }>;
  message?: string;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  userData?: T;
  tokenData?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  valid?: boolean;
  userId?: string;
  email?: string;
  role?: string;
  exp?: number;
}

interface ApiErrorExtended extends Error {
  status?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network error occurred' };
      }

      const error = new Error(errorData.message || 'API request failed') as ApiErrorExtended;
      error.status = response.status;
      error.errors = errorData.errors;
      throw error;
    }

    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    } else if (contentType?.startsWith('image/')) {
      return response.blob() as T;
    } else {
      return response.text() as T;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getMultipartHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get<T = unknown>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async postMultipart<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // Health check
  async healthCheck(): Promise<string> {
    const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return response.text();
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };