/**
 * Xano Backend Configuration
 * Configure your Xano workspace and API endpoints
 */

export const xanoConfig = {
  // Workspace configuration
  workspaceId: process.env.XANO_WORKSPACE_ID,
  apiKey: process.env.XANO_API_KEY,
  
  // Environment URLs
  environments: {
    development: process.env.XANO_DEV_URL || 'https://your-workspace.xano.io/api:your-dev-branch',
    staging: process.env.XANO_STAGING_URL || 'https://your-workspace.xano.io/api:your-staging-branch', 
    production: process.env.XANO_PROD_URL || 'https://your-workspace.xano.io/api:your-prod-branch'
  },
  
  // Current environment
  currentEnv: process.env.NODE_ENV || 'development',
  
  // API endpoints structure
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register', 
      refresh: '/auth/refresh',
      logout: '/auth/logout'
    },
    users: {
      profile: '/user/me',
      update: '/user/update',
      delete: '/user/delete'
    }
    // Add your custom endpoints here
  },
  
  // Request configuration
  request: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
  }
};

/**
 * Get current environment URL
 */
export const getCurrentApiUrl = () => {
  return xanoConfig.environments[xanoConfig.currentEnv];
};

/**
 * Build full endpoint URL
 * @param {string} endpoint - Endpoint path
 */
export const buildEndpointUrl = (endpoint) => {
  const baseUrl = getCurrentApiUrl();
  return `${baseUrl}${endpoint}`;
};