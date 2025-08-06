import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Environment validation
function validateEnvironment(mode: string) {
  const requiredViteVars = [
    'VITE_API_BASE_URL',
  ];
  
  const missingVars = requiredViteVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables for ${mode} mode:`);
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);  
    });
    console.error('\n💡 Please check your .env file or environment configuration.');
    console.error('📝 See .env.example for required variables.\n');
    process.exit(1);
  }
  
  console.log(`✅ Environment validation passed for ${mode} mode`);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Set env vars for validation
  Object.assign(process.env, env);
  
  // Validate environment variables on build
  if (mode !== 'development') {
    validateEnvironment(mode);
  }
  
  // For development, set default API URL if not provided
  if (mode === 'development' && !env.VITE_API_BASE_URL) {
    console.warn('⚠️  VITE_API_BASE_URL is not set for development mode. Please define it in your .env.development file or environment variables.');
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
