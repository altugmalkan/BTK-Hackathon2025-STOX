import { validateClientEnv } from './env.schema';

/**
 * Client environment configuration
 * Only VITE_* prefixed variables are accessible in the browser
 * 
 * This module should be imported only in client-side code
 */

// Validate and export client environment variables
export const clientEnv = validateClientEnv();

// Convenience exports for commonly used values
export const API_BASE_URL = clientEnv.VITE_API_BASE_URL;
export const APP_NAME = clientEnv.VITE_APP_NAME;
export const APP_VERSION = clientEnv.VITE_APP_VERSION;
export const IS_DEV_TOOLS_ENABLED = clientEnv.VITE_ENABLE_DEV_TOOLS;

// Environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Log environment info in development
if (isDevelopment) {
  console.log('🌍 Client Environment:', {
    API_BASE_URL,
    APP_NAME,
    APP_VERSION,
    IS_DEV_TOOLS_ENABLED,
  });
}
