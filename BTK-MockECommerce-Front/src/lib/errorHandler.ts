import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const createApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError(
      'Network error. Please check your connection and try again.',
      0,
      'NETWORK_ERROR'
    );
  }

  // Handle HTTP errors (axios-style errors)
  if (error && typeof error === 'object' && 'response' in error) {
    const httpError = error as { response: { status: number; data?: { message?: string; code?: string } } };
    const status = httpError.response.status;
    const data = httpError.response.data;
    
    let message = 'An unexpected error occurred';
    
    switch (status) {
      case 400:
        message = data?.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'You are not authorized. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 422:
        message = data?.message || 'Validation error. Please check your input.';
        break;
      case 429:
        message = 'Too many requests. Please wait a moment and try again.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        message = data?.message || `HTTP ${status}: Unknown error`;
    }

    return new AppError(message, status, data?.code, data);
  }

  // Handle other errors
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  return new AppError(
    errorMessage,
    undefined,
    'UNKNOWN_ERROR',
    error
  );
};

export const handleApiError = (error: unknown, context?: string): AppError => {
  const apiError = createApiError(error);
  
  // Log error for debugging
  console.error(`API Error${context ? ` in ${context}` : ''}:`, {
    message: apiError.message,
    status: apiError.status,
    code: apiError.code,
    details: apiError.details,
    stack: apiError.stack
  });

  // Show user-friendly toast notification
  const toastMessage = context 
    ? `${context}: ${apiError.message}`
    : apiError.message;

  if (apiError.status === 401) {
    toast.error('Session expired', {
      description: 'Please log in again to continue.',
      action: {
        label: 'Login',
        onClick: () => window.location.href = '/login'
      }
    });
  } else if (apiError.status && apiError.status >= 500) {
    toast.error('Server Error', {
      description: 'Something went wrong on our end. Please try again later.'
    });
  } else {
    toast.error('Error', {
      description: toastMessage
    });
  }

  return apiError;
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw handleApiError(error, context);
  }
};

// Retry utility for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const apiError = createApiError(error);
      
      // Don't retry on client errors (4xx) except 408, 429
      if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
        if (apiError.status !== 408 && apiError.status !== 429) {
          throw handleApiError(error, context);
        }
      }

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Retrying operation (attempt ${attempt + 1}/${maxRetries}) in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw handleApiError(lastError, context);
};
