/**
 * Environment-Specific Configuration for Webflow + Xano Integration
 * 
 * This module provides centralized environment configuration management
 * for development, staging, and production environments.
 * 
 * Usage in Webflow custom code:
 * <script src="environment-config.js"></script>
 * <script>
 *   const config = WebflowXanoConfig.getConfig();
 *   console.log('Environment:', config.environment);
 * </script>
 */

(function(window) {
  'use strict';

  /**
   * Environment Configuration Manager
   */
  class WebflowXanoConfig {
    constructor() {
      this.environment = this.detectEnvironment();
      this.config = this.loadEnvironmentConfig();
    }

    /**
     * Detect current environment based on hostname and other indicators
     */
    detectEnvironment() {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const search = window.location.search;

      // Check for development environment
      if (hostname === 'localhost' || 
          hostname === '127.0.0.1' ||
          hostname.includes('local') ||
          search.includes('dev=true')) {
        return 'development';
      }

      // Check for staging environment
      if (hostname.includes('webflow.io') ||
          hostname.includes('staging') ||
          hostname.includes('test') ||
          pathname.includes('/staging') ||
          search.includes('env=staging')) {
        return 'staging';
      }

      // Check for custom staging domains
      if (hostname.includes('your-staging-domain.com')) {
        return 'staging';
      }

      // Default to production
      return 'production';
    }

    /**
     * Load environment-specific configuration
     */
    loadEnvironmentConfig() {
      const baseConfig = {
        // Default configuration
        retryAttempts: 3,
        retryDelay: 1000,
        timeout: 10000,
        debugMode: false,
        enableAnalytics: true,
        enableErrorTracking: true,
        cacheEnabled: true,
        authTokenKey: 'xano_auth_token',
        refreshTokenKey: 'xano_refresh_token',
        
        // Form configuration
        formDefaults: {
          showLoadingStates: true,
          resetOnSuccess: false,
          redirectDelay: 2000
        },

        // Content loading defaults
        contentDefaults: {
          showLoadingStates: true,
          enableCaching: true,
          cacheTimeout: 300000, // 5 minutes
          fallbackEnabled: true
        },

        // Performance settings
        performance: {
          enableRequestBatching: true,
          requestBatchDelay: 50,
          enableConnectionPooling: true,
          maxConcurrentRequests: 5
        }
      };

      const environmentConfigs = {
        development: {
          ...baseConfig,
          debugMode: true,
          enableAnalytics: false,
          enableErrorTracking: false,
          cacheEnabled: false,
          retryAttempts: 1,
          timeout: 5000,

          // Xano Development Configuration
          xanoBaseUrl: 'https://x8ki-letl-twmt.n7c.xano.io/api:v1',
          xanoWorkspaceId: 'dev-workspace-id',
          
          // Webflow Development Configuration
          webflowSiteId: 'dev-site-id',
          webflowBaseUrl: 'https://webflow.com/api',
          
          // Development-specific settings
          mockApiEnabled: false,
          slowNetworkSimulation: false,
          verboseLogging: true,
          showDebugInfo: true,
          enableTestMode: true,

          // Form configuration for development
          formDefaults: {
            ...baseConfig.formDefaults,
            showValidationErrors: true,
            enableDevTools: true
          },

          // Content defaults for development
          contentDefaults: {
            ...baseConfig.contentDefaults,
            enableCaching: false,
            showContentIds: true,
            enablePlaceholders: true
          }
        },

        staging: {
          ...baseConfig,
          debugMode: true,
          enableAnalytics: true,
          enableErrorTracking: true,
          retryAttempts: 2,
          timeout: 8000,

          // Xano Staging Configuration
          xanoBaseUrl: 'https://staging-workspace.xano.io/api:v1',
          xanoWorkspaceId: 'staging-workspace-id',
          
          // Webflow Staging Configuration
          webflowSiteId: 'staging-site-id',
          webflowBaseUrl: 'https://webflow.com/api',
          
          // Staging-specific settings
          mockApiEnabled: false,
          slowNetworkSimulation: false,
          verboseLogging: true,
          showDebugInfo: false,
          enableTestMode: false,

          // Analytics configuration
          analytics: {
            googleAnalyticsId: 'GA-STAGING-ID',
            mixpanelToken: 'staging-mixpanel-token',
            enableHeatmaps: false
          },

          // Error tracking
          errorTracking: {
            sentryDsn: 'https://staging-sentry-dsn',
            environment: 'staging',
            sampleRate: 1.0
          }
        },

        production: {
          ...baseConfig,
          debugMode: false,
          enableAnalytics: true,
          enableErrorTracking: true,
          retryAttempts: 3,
          timeout: 10000,

          // Xano Production Configuration
          xanoBaseUrl: 'https://production-workspace.xano.io/api:v1',
          xanoWorkspaceId: 'production-workspace-id',
          
          // Webflow Production Configuration
          webflowSiteId: 'production-site-id',
          webflowBaseUrl: 'https://webflow.com/api',
          
          // Production-specific settings
          mockApiEnabled: false,
          slowNetworkSimulation: false,
          verboseLogging: false,
          showDebugInfo: false,
          enableTestMode: false,

          // Analytics configuration
          analytics: {
            googleAnalyticsId: 'GA-PRODUCTION-ID',
            mixpanelToken: 'production-mixpanel-token',
            enableHeatmaps: true,
            facebookPixelId: 'your-facebook-pixel-id',
            linkedInPartnerId: 'your-linkedin-partner-id'
          },

          // Error tracking
          errorTracking: {
            sentryDsn: 'https://production-sentry-dsn',
            environment: 'production',
            sampleRate: 0.1, // Lower sample rate for production
            ignoreErrors: [
              'Network Error',
              'Loading chunk',
              'Script error'
            ]
          },

          // Performance optimizations
          performance: {
            ...baseConfig.performance,
            enableRequestBatching: true,
            requestBatchDelay: 25, // Faster batching in production
            enableConnectionPooling: true,
            maxConcurrentRequests: 8,
            enableServiceWorker: true
          },

          // Security settings
          security: {
            enableCSP: true,
            enableHSTS: true,
            csrfProtection: true,
            rateLimiting: {
              enabled: true,
              maxRequests: 100,
              timeWindow: 60000 // 1 minute
            }
          }
        }
      };

      return environmentConfigs[this.environment] || environmentConfigs.production;
    }

    /**
     * Get current configuration
     */
    getConfig() {
      return {
        environment: this.environment,
        ...this.config
      };
    }

    /**
     * Get environment-specific API URLs
     */
    getApiUrls() {
      return {
        xano: this.config.xanoBaseUrl,
        webflow: this.config.webflowBaseUrl
      };
    }

    /**
     * Get authentication configuration
     */
    getAuthConfig() {
      return {
        tokenKey: this.config.authTokenKey,
        refreshTokenKey: this.config.refreshTokenKey,
        xanoWorkspaceId: this.config.xanoWorkspaceId
      };
    }

    /**
     * Get performance configuration
     */
    getPerformanceConfig() {
      return this.config.performance || {};
    }

    /**
     * Get analytics configuration
     */
    getAnalyticsConfig() {
      if (!this.config.enableAnalytics) {
        return { enabled: false };
      }
      
      return {
        enabled: true,
        ...this.config.analytics
      };
    }

    /**
     * Get error tracking configuration
     */
    getErrorTrackingConfig() {
      if (!this.config.enableErrorTracking) {
        return { enabled: false };
      }
      
      return {
        enabled: true,
        ...this.config.errorTracking
      };
    }

    /**
     * Check if debug mode is enabled
     */
    isDebugMode() {
      return this.config.debugMode || this.environment === 'development';
    }

    /**
     * Check if development environment
     */
    isDevelopment() {
      return this.environment === 'development';
    }

    /**
     * Check if staging environment
     */
    isStaging() {
      return this.environment === 'staging';
    }

    /**
     * Check if production environment
     */
    isProduction() {
      return this.environment === 'production';
    }

    /**
     * Override configuration for testing
     */
    setTestConfig(overrides = {}) {
      if (this.environment !== 'development') {
        console.warn('Test configuration can only be set in development environment');
        return;
      }

      this.config = {
        ...this.config,
        ...overrides,
        enableTestMode: true,
        mockApiEnabled: overrides.mockApiEnabled !== undefined ? overrides.mockApiEnabled : true
      };
    }

    /**
     * Get configuration for specific feature
     */
    getFeatureConfig(featureName) {
      const featureConfigs = {
        forms: this.config.formDefaults || {},
        content: this.config.contentDefaults || {},
        auth: this.getAuthConfig(),
        analytics: this.getAnalyticsConfig(),
        errorTracking: this.getErrorTrackingConfig(),
        performance: this.getPerformanceConfig(),
        security: this.config.security || {}
      };

      return featureConfigs[featureName] || {};
    }

    /**
     * Log configuration for debugging
     */
    logConfig() {
      if (this.isDebugMode()) {
        console.group('🔧 WebflowXanoConfig');
        console.log('Environment:', this.environment);
        console.log('Xano Base URL:', this.config.xanoBaseUrl);
        console.log('Debug Mode:', this.config.debugMode);
        console.log('Analytics Enabled:', this.config.enableAnalytics);
        console.log('Error Tracking Enabled:', this.config.enableErrorTracking);
        console.log('Cache Enabled:', this.config.cacheEnabled);
        console.groupEnd();
      }
    }

    /**
     * Validate configuration
     */
    validateConfig() {
      const required = ['xanoBaseUrl', 'xanoWorkspaceId'];
      const missing = required.filter(key => !this.config[key]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required configuration: ${missing.join(', ')}`);
      }

      // Validate URLs
      try {
        new URL(this.config.xanoBaseUrl);
        if (this.config.webflowBaseUrl) {
          new URL(this.config.webflowBaseUrl);
        }
      } catch (error) {
        throw new Error('Invalid URL in configuration: ' + error.message);
      }

      return true;
    }
  }

  // Create singleton instance
  const configManager = new WebflowXanoConfig();

  // Global API
  window.WebflowXanoConfig = {
    // Get the singleton instance
    getInstance: () => configManager,
    
    // Quick access methods
    getConfig: () => configManager.getConfig(),
    getEnvironment: () => configManager.environment,
    isDebug: () => configManager.isDebugMode(),
    isDevelopment: () => configManager.isDevelopment(),
    isStaging: () => configManager.isStaging(),
    isProduction: () => configManager.isProduction(),
    
    // Feature-specific configs
    getApiUrls: () => configManager.getApiUrls(),
    getAuthConfig: () => configManager.getAuthConfig(),
    getAnalyticsConfig: () => configManager.getAnalyticsConfig(),
    getErrorTrackingConfig: () => configManager.getErrorTrackingConfig(),
    getPerformanceConfig: () => configManager.getPerformanceConfig(),
    getFeatureConfig: (featureName) => configManager.getFeatureConfig(featureName),
    
    // Utility methods
    logConfig: () => configManager.logConfig(),
    validateConfig: () => configManager.validateConfig(),
    setTestConfig: (overrides) => configManager.setTestConfig(overrides)
  };

  // Auto-validate configuration
  try {
    configManager.validateConfig();
    if (configManager.isDebugMode()) {
      configManager.logConfig();
    }
  } catch (error) {
    console.error('[WebflowXanoConfig] Configuration validation failed:', error.message);
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.WebflowXanoConfig;
  }

})(typeof window !== 'undefined' ? window : global);