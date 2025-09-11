/**
 * Webflow + Xano Integration Client
 * 
 * This script provides a comprehensive interface for integrating Webflow with Xano backend.
 * It includes environment detection, error handling, authentication, and dynamic content loading.
 * 
 * Usage: Include this in Webflow's custom code section (head or footer)
 */

class WebflowXanoClient {
  constructor(config = {}) {
    // Environment detection
    this.environment = this.detectEnvironment();
    
    // Configuration with environment-specific overrides
    this.config = {
      // Default configuration
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 10000,
      debugMode: false,
      fallbackContent: {},
      ...config,
      // Environment-specific API URLs
      ...this.getEnvironmentConfig()
    };
    
    // Initialize authentication state
    this.authToken = this.getStoredToken();
    this.isAuthenticated = !!this.authToken;
    
    // Request queue for managing API calls
    this.requestQueue = [];
    this.isProcessingQueue = false;
    
    // Error tracking
    this.errorCount = 0;
    this.maxErrors = 10;
    
    // Debug logging
    if (this.config.debugMode) {
      console.log('🚀 WebflowXanoClient initialized', {
        environment: this.environment,
        config: this.config
      });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  /**
   * Detect current environment based on URL
   */
  detectEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    }
    
    if (hostname.includes('webflow.io') || hostname.includes('staging')) {
      return 'staging';
    }
    
    return 'production';
  }
  
  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig() {
    const configs = {
      development: {
        xanoBaseUrl: 'https://x8ki-letl-twmt.n7c.xano.io/api:v1',
        debugMode: true,
        retryAttempts: 1,
        timeout: 5000
      },
      staging: {
        xanoBaseUrl: 'https://staging-workspace.xano.io/api:v1',
        debugMode: true,
        retryAttempts: 2,
        timeout: 8000
      },
      production: {
        xanoBaseUrl: 'https://production-workspace.xano.io/api:v1',
        debugMode: false,
        retryAttempts: 3,
        timeout: 10000
      }
    };
    
    return configs[this.environment] || configs.production;
  }
  
  /**
   * Initialize the client
   */
  init() {
    this.log('🔧 Initializing Webflow Xano integration...');
    
    // Set up global error handling
    this.setupErrorHandling();
    
    // Initialize authentication check
    this.checkAuthStatus();
    
    // Set up form handlers
    this.setupFormHandlers();
    
    // Load dynamic content
    this.loadDynamicContent();
    
    // Set up periodic token refresh
    this.setupTokenRefresh();
    
    this.log('✅ Webflow Xano integration initialized successfully');
  }
  
  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.logError('Global JavaScript Error', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });
  }
  
  /**
   * Make authenticated API request to Xano
   */
  async makeRequest(endpoint, options = {}) {
    const requestConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: this.config.timeout,
      ...options
    };
    
    // Add authentication token if available
    if (this.authToken) {
      requestConfig.headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    const url = `${this.config.xanoBaseUrl}${endpoint}`;
    
    try {
      const response = await this.requestWithRetry(url, requestConfig);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.log('✅ API Request successful', { endpoint, data });
      
      return { success: true, data, status: response.status };
      
    } catch (error) {
      this.logError(`API Request failed: ${endpoint}`, error);
      
      // Handle specific error cases
      if (error.message.includes('401')) {
        this.handleAuthenticationError();
      }
      
      return { success: false, error: error.message, status: error.status };
    }
  }
  
  /**
   * Request with retry logic
   */
  async requestWithRetry(url, config, attempt = 1) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        this.log(`⏳ Retrying request (${attempt}/${this.config.retryAttempts})...`);
        await this.delay(this.config.retryDelay * attempt);
        return this.requestWithRetry(url, config, attempt + 1);
      }
      throw error;
    }
  }
  
  /**
   * Authentication methods
   */
  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.success && response.data.authToken) {
      this.setAuthToken(response.data.authToken);
      this.isAuthenticated = true;
      this.log('✅ User authenticated successfully');
      
      // Trigger authenticated event
      this.dispatchEvent('userAuthenticated', response.data);
    }
    
    return response;
  }
  
  async logout() {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      this.log('⚠️ Logout request failed, but continuing with local cleanup');
    }
    
    this.clearAuthToken();
    this.isAuthenticated = false;
    
    this.dispatchEvent('userLoggedOut');
    this.log('✅ User logged out');
  }
  
  async refreshToken() {
    if (!this.authToken) return false;
    
    const response = await this.makeRequest('/auth/refresh', {
      method: 'POST'
    });
    
    if (response.success && response.data.authToken) {
      this.setAuthToken(response.data.authToken);
      return true;
    }
    
    this.handleAuthenticationError();
    return false;
  }
  
  /**
   * Token management
   */
  setAuthToken(token) {
    this.authToken = token;
    try {
      localStorage.setItem('xano_auth_token', token);
    } catch (error) {
      this.log('⚠️ Could not store auth token in localStorage');
    }
  }
  
  getStoredToken() {
    try {
      return localStorage.getItem('xano_auth_token');
    } catch (error) {
      this.log('⚠️ Could not retrieve auth token from localStorage');
      return null;
    }
  }
  
  clearAuthToken() {
    this.authToken = null;
    try {
      localStorage.removeItem('xano_auth_token');
    } catch (error) {
      this.log('⚠️ Could not clear auth token from localStorage');
    }
  }
  
  handleAuthenticationError() {
    this.log('🔑 Authentication error - clearing token');
    this.clearAuthToken();
    this.isAuthenticated = false;
    this.dispatchEvent('authenticationError');
  }
  
  /**
   * Check authentication status
   */
  async checkAuthStatus() {
    if (!this.authToken) return false;
    
    const response = await this.makeRequest('/auth/me');
    
    if (response.success) {
      this.isAuthenticated = true;
      this.dispatchEvent('userAuthenticated', response.data);
      return true;
    } else {
      this.handleAuthenticationError();
      return false;
    }
  }
  
  /**
   * Set up automatic token refresh
   */
  setupTokenRefresh() {
    // Refresh token every 30 minutes
    setInterval(() => {
      if (this.isAuthenticated) {
        this.refreshToken();
      }
    }, 30 * 60 * 1000);
  }
  
  /**
   * Form handling
   */
  setupFormHandlers() {
    // Find all forms with data-xano attribute
    const xanoForms = document.querySelectorAll('[data-xano-form]');
    
    xanoForms.forEach(form => {
      const endpoint = form.getAttribute('data-xano-form');
      const method = form.getAttribute('data-xano-method') || 'POST';
      const requiresAuth = form.hasAttribute('data-xano-auth');
      
      form.addEventListener('submit', (event) => {
        this.handleFormSubmit(event, endpoint, method, requiresAuth);
      });
    });
    
    this.log(`📝 Set up ${xanoForms.length} Xano form handlers`);
  }
  
  async handleFormSubmit(event, endpoint, method, requiresAuth) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    
    // Check authentication if required
    if (requiresAuth && !this.isAuthenticated) {
      this.showFormError(form, 'Please log in to submit this form.');
      return;
    }
    
    try {
      // Show loading state
      this.setFormLoading(form, true);
      if (submitButton) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
      }
      
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Make API request
      const response = await this.makeRequest(endpoint, {
        method: method,
        body: JSON.stringify(data)
      });
      
      if (response.success) {
        this.handleFormSuccess(form, response.data);
        this.dispatchEvent('formSubmitSuccess', { form, data: response.data });
      } else {
        this.handleFormError(form, response.error);
        this.dispatchEvent('formSubmitError', { form, error: response.error });
      }
      
    } catch (error) {
      this.handleFormError(form, 'An unexpected error occurred. Please try again.');
      this.dispatchEvent('formSubmitError', { form, error: error.message });
    } finally {
      // Reset form state
      this.setFormLoading(form, false);
      if (submitButton) {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    }
  }
  
  setFormLoading(form, isLoading) {
    if (isLoading) {
      form.classList.add('is-loading');
    } else {
      form.classList.remove('is-loading');
    }
  }
  
  handleFormSuccess(form, data) {
    // Clear any previous errors
    this.clearFormMessages(form);
    
    // Show success message
    const successElement = form.querySelector('.form-success') || 
                          form.querySelector('[data-form-success]');
    
    if (successElement) {
      successElement.style.display = 'block';
      successElement.textContent = successElement.getAttribute('data-success-message') || 
                                   'Form submitted successfully!';
    }
    
    // Reset form if specified
    if (form.hasAttribute('data-reset-on-success')) {
      form.reset();
    }
    
    // Redirect if specified
    const redirectUrl = form.getAttribute('data-success-redirect');
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
  }
  
  handleFormError(form, errorMessage) {
    this.showFormError(form, errorMessage);
  }
  
  showFormError(form, message) {
    const errorElement = form.querySelector('.form-error') || 
                        form.querySelector('[data-form-error]');
    
    if (errorElement) {
      errorElement.style.display = 'block';
      errorElement.textContent = message;
    } else {
      // Create error element if it doesn't exist
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.color = '#e74c3c';
      errorDiv.style.marginTop = '10px';
      errorDiv.textContent = message;
      form.appendChild(errorDiv);
    }
  }
  
  clearFormMessages(form) {
    const errorElement = form.querySelector('.form-error') || 
                        form.querySelector('[data-form-error]');
    const successElement = form.querySelector('.form-success') || 
                          form.querySelector('[data-form-success]');
    
    if (errorElement) errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
  }
  
  /**
   * Dynamic content loading
   */
  async loadDynamicContent() {
    const contentElements = document.querySelectorAll('[data-xano-content]');
    
    for (const element of contentElements) {
      await this.loadContentForElement(element);
    }
    
    this.log(`📄 Loaded ${contentElements.length} dynamic content elements`);
  }
  
  async loadContentForElement(element) {
    const endpoint = element.getAttribute('data-xano-content');
    const template = element.getAttribute('data-xano-template');
    const fallback = element.getAttribute('data-xano-fallback');
    const requiresAuth = element.hasAttribute('data-xano-auth');
    
    // Check authentication if required
    if (requiresAuth && !this.isAuthenticated) {
      this.showContentFallback(element, fallback || 'Please log in to view this content.');
      return;
    }
    
    try {
      // Show loading state
      element.classList.add('is-loading');
      
      const response = await this.makeRequest(endpoint);
      
      if (response.success) {
        this.renderContent(element, response.data, template);
        this.dispatchEvent('contentLoaded', { element, data: response.data });
      } else {
        this.showContentFallback(element, fallback || 'Content could not be loaded.');
      }
      
    } catch (error) {
      this.showContentFallback(element, fallback || 'An error occurred while loading content.');
    } finally {
      element.classList.remove('is-loading');
    }
  }
  
  renderContent(element, data, template) {
    if (template && this.config.templates && this.config.templates[template]) {
      // Use template function if available
      element.innerHTML = this.config.templates[template](data);
    } else if (Array.isArray(data)) {
      // Render array data
      element.innerHTML = data.map(item => this.renderContentItem(item)).join('');
    } else {
      // Render single item
      element.innerHTML = this.renderContentItem(data);
    }
  }
  
  renderContentItem(item) {
    // Simple template rendering
    let html = '<div class="content-item">';
    
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        html += `<div class="content-${key}">${value}</div>`;
      }
    });
    
    html += '</div>';
    return html;
  }
  
  showContentFallback(element, message) {
    element.innerHTML = `<div class="content-fallback">${message}</div>`;
  }
  
  /**
   * Utility methods
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  log(...args) {
    if (this.config.debugMode) {
      console.log('[WebflowXano]', ...args);
    }
  }
  
  logError(message, error) {
    console.error('[WebflowXano Error]', message, error);
    
    this.errorCount++;
    
    // If too many errors, disable further requests
    if (this.errorCount >= this.maxErrors) {
      console.error('[WebflowXano] Too many errors - some functionality may be disabled');
    }
  }
  
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(`xano:${eventName}`, { detail });
    document.dispatchEvent(event);
  }
  
  /**
   * Public API methods
   */
  async getData(endpoint) {
    return this.makeRequest(endpoint);
  }
  
  async postData(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async updateData(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async deleteData(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE'
    });
  }
  
  // Reload dynamic content
  async reloadContent(selector = '[data-xano-content]') {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      await this.loadContentForElement(element);
    }
  }
  
  // Get current environment
  getEnvironment() {
    return this.environment;
  }
  
  // Get authentication status
  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

// Auto-initialize with default configuration
// This can be overridden by calling new WebflowXanoClient(customConfig)
window.xanoClient = window.xanoClient || new WebflowXanoClient();

// Make it globally available
window.WebflowXanoClient = WebflowXanoClient;