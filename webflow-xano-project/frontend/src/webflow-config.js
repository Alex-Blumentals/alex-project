/**
 * Webflow Configuration
 * Configure your Webflow site settings and API connections
 */

export const webflowConfig = {
  // Site configuration
  siteId: process.env.WEBFLOW_SITE_ID,
  apiToken: process.env.WEBFLOW_API_TOKEN,
  
  // Collection IDs (replace with your actual collection IDs)
  collections: {
    // Example: blog: 'collection_id_here',
    // Example: products: 'collection_id_here',
  },
  
  // Custom domains
  customDomain: process.env.WEBFLOW_CUSTOM_DOMAIN,
  
  // Development settings
  development: {
    localPort: 3000,
    watchFiles: true,
    hotReload: true
  },
  
  // Build settings
  build: {
    outputDir: '../dist',
    optimizeAssets: true,
    generateSitemap: true
  }
};

// Webflow API client initialization
export const initWebflowClient = () => {
  if (!webflowConfig.apiToken) {
    throw new Error('WEBFLOW_API_TOKEN is required');
  }
  
  // Initialize Webflow API client here
  return {
    siteId: webflowConfig.siteId,
    token: webflowConfig.apiToken
  };
};