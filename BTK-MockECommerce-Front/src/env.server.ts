import { validateServerEnv } from './env.schema';

/**
 * Server environment configuration
 * These variables are only available at build time and in server contexts
 * 
 * This module should NOT be imported in client-side code
 */

// Validate and export server environment variables
export const serverEnv = validateServerEnv();

// Convenience exports
export const NODE_ENV = serverEnv.NODE_ENV;

// Environment detection
export const isDevelopment = NODE_ENV === 'development';
export const isProduction = NODE_ENV === 'production';
export const isTest = NODE_ENV === 'test';

// Log server environment info (only at build time)
if (isDevelopment) {
  console.log('🔧 Server Environment:', {
    NODE_ENV,
  });
}
