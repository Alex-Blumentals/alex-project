/**
 * Environment Configuration Utilities
 * Helper functions for managing environment variables and configurations
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment types
 */
export const Environment = {
  DEVELOPMENT: 'development',
  STAGING: 'staging', 
  PRODUCTION: 'production'
};

/**
 * Get current environment
 */
export const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || Environment.DEVELOPMENT;
};

/**
 * Check if running in development
 */
export const isDevelopment = () => {
  return getCurrentEnvironment() === Environment.DEVELOPMENT;
};

/**
 * Check if running in production
 */
export const isProduction = () => {
  return getCurrentEnvironment() === Environment.PRODUCTION;
};

/**
 * Check if running in staging
 */
export const isStaging = () => {
  return getCurrentEnvironment() === Environment.STAGING;
};

/**
 * Get required environment variable
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value
 * @throws {Error} If required variable is missing
 */
export const getRequiredEnv = (key, fallback = null) => {
  const value = process.env[key] || fallback;
  
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
};

/**
 * Get optional environment variable
 * @param {string} key - Environment variable key  
 * @param {string} fallback - Fallback value
 */
export const getOptionalEnv = (key, fallback = null) => {
  return process.env[key] || fallback;
};

/**
 * Get boolean environment variable
 * @param {string} key - Environment variable key
 * @param {boolean} fallback - Fallback value
 */
export const getBooleanEnv = (key, fallback = false) => {
  const value = process.env[key];
  if (!value) return fallback;
  
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Get numeric environment variable
 * @param {string} key - Environment variable key
 * @param {number} fallback - Fallback value
 */
export const getNumericEnv = (key, fallback = 0) => {
  const value = process.env[key];
  if (!value) return fallback;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Validate required environment variables
 * @param {Array<string>} requiredVars - Array of required variable names
 * @throws {Error} If any required variables are missing
 */
export const validateRequiredEnvVars = (requiredVars) => {
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

/**
 * Environment-specific configuration
 */
export const envConfig = {
  // Current environment
  environment: getCurrentEnvironment(),
  
  // Development flags
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),
  isStaging: isStaging(),
  
  // Common configuration
  port: getNumericEnv('DEV_PORT', 3000),
  hotReload: getBooleanEnv('HOT_RELOAD', true),
  watchFiles: getBooleanEnv('WATCH_FILES', true),
  
  // Build configuration
  buildOptimizeAssets: getBooleanEnv('BUILD_OPTIMIZE_ASSETS', true),
  buildGenerateSitemap: getBooleanEnv('BUILD_GENERATE_SITEMAP', true),
  
  // Logging
  logLevel: getOptionalEnv('LOG_LEVEL', 'info'),
  logFile: getOptionalEnv('LOG_FILE', './logs/app.log'),
  
  // CORS
  corsOrigin: getOptionalEnv('CORS_ORIGIN', 'http://localhost:3000')
};