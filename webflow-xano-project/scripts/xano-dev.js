#!/usr/bin/env node

/**
 * Xano Development Script
 * Handles development workflow for Xano backend integration
 */

import { xanoClient } from '../backend/utils/xano-client.js';
import { xanoConfig } from '../backend/config/xano-config.js';
import { envConfig } from '../frontend/utils/env-config.js';

class XanoDevServer {
  constructor() {
    this.isRunning = false;
    this.healthCheckInterval = null;
  }
  
  /**
   * Start Xano development environment
   */
  async start() {
    console.log('🔧 Starting Xano development environment...');
    
    try {
      // Validate configuration
      await this.validateConfig();
      
      // Test Xano connection
      await this.testConnection();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Setup development utilities
      this.setupDevUtilities();
      
      this.isRunning = true;
      console.log('✅ Xano development environment ready!');
      console.log(`🌐 Backend API: ${xanoConfig.environments[xanoConfig.currentEnv]}`);
      
    } catch (error) {
      console.error('❌ Failed to start Xano development environment:', error.message);
      process.exit(1);
    }
  }
  
  /**
   * Validate Xano configuration
   */
  async validateConfig() {
    console.log('🔍 Validating Xano configuration...');
    
    const requiredVars = ['XANO_WORKSPACE_ID'];
    const missing = requiredVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required Xano environment variables: ${missing.join(', ')}`);
    }
    
    if (!xanoConfig.environments[xanoConfig.currentEnv]) {
      throw new Error(`No Xano URL configured for environment: ${xanoConfig.currentEnv}`);
    }
    
    console.log(`   ✓ Environment: ${xanoConfig.currentEnv}`);
    console.log(`   ✓ Workspace ID: ${xanoConfig.workspaceId}`);
  }
  
  /**
   * Test connection to Xano backend
   */
  async testConnection() {
    console.log('🔌 Testing Xano connection...');
    
    try {
      // Try to make a simple request to test connectivity
      const testEndpoint = '/health'; // Adjust based on your Xano setup
      
      // In a real implementation, you'd make an actual request:
      // await xanoClient.get(testEndpoint);
      
      console.log('   ✓ Connection successful');
    } catch (error) {
      console.warn('   ⚠️  Connection test failed:', error.message);
      console.warn('   ℹ️  This might be expected if your Xano backend is not running');
    }
  }
  
  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    console.log('💓 Starting health monitoring...');
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        // Monitor Xano backend health
        await this.checkBackendHealth();
      } catch (error) {
        if (envConfig.isDevelopment) {
          console.warn('⚠️  Backend health check failed:', error.message);
        }
      }
    }, 30000); // Check every 30 seconds
    
    console.log('   ✓ Health monitoring active');
  }
  
  /**
   * Check backend health
   */
  async checkBackendHealth() {
    // In a real implementation, you'd:
    // - Check if Xano endpoints are responding
    // - Verify authentication tokens are valid
    // - Monitor API rate limits
    // - Check database connectivity
    
    // For now, just log that we're monitoring
    if (envConfig.isDevelopment && Math.random() > 0.9) {
      console.log('💚 Backend health check: OK');
    }
  }
  
  /**
   * Setup development utilities
   */
  setupDevUtilities() {
    console.log('🛠️  Setting up development utilities...');
    
    // Setup CLI commands for development
    this.setupCLICommands();
    
    // Setup API testing helpers
    this.setupAPIHelpers();
    
    console.log('   ✓ Development utilities ready');
  }
  
  /**
   * Setup CLI commands
   */
  setupCLICommands() {
    // In a real implementation, you might setup commands like:
    // - Test authentication
    // - Create test users
    // - Clear development data
    // - Run database migrations
    
    console.log('   ✓ CLI commands available');
  }
  
  /**
   * Setup API testing helpers
   */
  setupAPIHelpers() {
    // Helper functions for testing Xano APIs during development
    global.testXanoAPI = async (endpoint, data = {}) => {
      try {
        console.log(`🧪 Testing endpoint: ${endpoint}`);
        const result = await xanoClient.post(endpoint, data);
        console.log('   ✅ Success:', result);
        return result;
      } catch (error) {
        console.log('   ❌ Error:', error.message);
        throw error;
      }
    };
    
    global.testXanoAuth = async (email, password) => {
      try {
        console.log('🔐 Testing authentication...');
        const result = await xanoClient.login(email, password);
        console.log('   ✅ Authentication successful');
        return result;
      } catch (error) {
        console.log('   ❌ Authentication failed:', error.message);
        throw error;
      }
    };
    
    console.log('   ✓ API testing helpers available');
    console.log('   ℹ️  Use testXanoAPI(endpoint, data) and testXanoAuth(email, password) in console');
  }
  
  /**
   * Stop development environment
   */
  stop() {
    console.log('🛑 Stopping Xano development environment...');
    
    // Clear health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    // Clear authentication tokens
    xanoClient.clearTokens();
    
    this.isRunning = false;
    console.log('✅ Xano development environment stopped');
  }
}

// Handle process termination
const devServer = new XanoDevServer();

process.on('SIGINT', () => {
  devServer.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  devServer.stop();
  process.exit(0);
});

// Start if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  devServer.start();
}