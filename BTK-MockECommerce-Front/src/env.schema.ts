import { z } from 'zod';

/**
 * Environment variables schema for Market Hub Dashboard
 * This schema defines all environment variables and their types
 */

// Client-side environment variables (VITE_* prefix required)
const clientSchema = z.object({
  VITE_API_BASE_URL: z.string().url().describe('Base URL for API endpoints'),
  VITE_APP_NAME: z.string().default('Market Hub Dashboard').describe('Application name'),
  VITE_APP_VERSION: z.string().optional().describe('Application version'),
  VITE_ENABLE_DEV_TOOLS: z
    .string()
    .transform(val => val === 'true')
    .default('false')
    .describe('Enable development tools in production'),
});

// Server-side environment variables (for build-time and server functions)
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // Add server-only secrets here if needed for serverless functions
});

// Combined schema for all environments
export const envSchema = {
  client: clientSchema,
  server: serverSchema,
};

// Type definitions
export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

/**
 * Validates client environment variables
 * This runs in the browser and should only access VITE_* variables
 */
export function validateClientEnv(): ClientEnv {
  try {
    return clientSchema.parse({
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
      VITE_ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS,
    });
  } catch (error) {
    console.error('❌ Invalid client environment variables:', error);
    throw new Error(
      `Invalid client environment variables. Please check your .env file and ensure all VITE_* variables are properly set.`
    );
  }
}

/**
 * Validates server environment variables  
 * This runs at build time and on server
 */
export function validateServerEnv(): ServerEnv {
  try {
    return serverSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('❌ Invalid server environment variables:', error);
    throw new Error(
      `Invalid server environment variables. Please check your environment configuration.`
    );
  }
}
