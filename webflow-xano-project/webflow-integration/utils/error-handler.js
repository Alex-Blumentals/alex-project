/**
 * Comprehensive Error Handler for Webflow + Xano Integration
 * 
 * This module provides centralized error handling, fallback mechanisms,
 * and recovery strategies for all aspects of the Webflow + Xano integration.
 * 
 * Features:
 * - Global error catching and handling
 * - Network error recovery
 * - Fallback content and functionality
 * - Error reporting and analytics
 * - User-friendly error messages
 * - Automatic retry mechanisms
 */

(function(window) {
  'use strict';

  /**
   * Error Handler for Webflow + Xano Integration
   */
  class WebflowErrorHandler {
    constructor(config = {}) {
      this.config = {
        // Error handling configuration
        enableGlobalErrorHandling: true,
        enableNetworkErrorHandling: true,
        enableFallbackContent: true,
        enableErrorReporting: true,
        enableUserFeedback: true,
        
        // Retry configuration
        maxRetries: 3,
        retryDelays: [1000, 2000, 4000], // Progressive delays
        retryOnCodes: [408, 429, 500, 502, 503, 504],
        
        // Fallback configuration
        fallbackTimeout: 5000,
        fallbackContent: {
          default: '<div class="error-fallback">Content temporarily unavailable. Please try again later.</div>',
          network: '<div class="error-fallback">Network connection issue. Please check your internet connection.</div>',
          auth: '<div class="error-fallback">Please log in to view this content.</div>',
          notFound: '<div class="error-fallback">Content not found.</div>',
          serverError: '<div class="error-fallback">Server error. We\'re working to fix this issue.</div>'
        },
        
        // User notification configuration
        showErrorToasts: true,
        toastDuration: 5000,
        errorToastClass: 'error-toast',
        
        // Error reporting
        reportErrors: true,
        reportingEndpoint: null,
        reportingBatchSize: 10,
        reportingInterval: 30000,
        
        // Debug configuration
        debugMode: false,
        logErrors: true,
        
        ...config
      };

      // Get configuration from environment config
      if (window.WebflowXanoConfig) {
        const errorConfig = window.WebflowXanoConfig.getFeatureConfig('errorHandling');
        const debugMode = window.WebflowXanoConfig.isDebug();
        this.config = { 
          ...this.config, 
          ...errorConfig,
          debugMode: debugMode,
          logErrors: debugMode || this.config.logErrors
        };
      }

      // State management
      this.errorQueue = [];
      this.retryQueue = new Map();
      this.fallbackElements = new Map();
      this.errorStats = {
        totalErrors: 0,
        networkErrors: 0,
        apiErrors: 0,
        jsErrors: 0,
        lastError: null
      };

      this.init();
    }

    /**
     * Initialize error handler
     */
    init() {
      // Set up global error handling
      if (this.config.enableGlobalErrorHandling) {
        this.setupGlobalErrorHandling();
      }

      // Set up network error handling
      if (this.config.enableNetworkErrorHandling) {
        this.setupNetworkErrorHandling();
      }

      // Set up error reporting
      if (this.config.enableErrorReporting && this.config.reportingEndpoint) {
        this.setupErrorReporting();
      }

      // Set up periodic retry processing
      this.setupRetryProcessing();

      this.log('🔧 WebflowErrorHandler initialized');
    }

    /**
     * Set up global error handling
     */
    setupGlobalErrorHandling() {
      // Handle JavaScript errors
      window.addEventListener('error', (event) => {
        this.handleJavaScriptError({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.handlePromiseRejection({
          reason: event.reason,
          promise: event.promise,
          timestamp: Date.now(),
          url: window.location.href
        });
      });

      // Handle API errors from Xano client
      document.addEventListener('xano:error', (event) => {
        this.handleApiError({
          endpoint: event.detail.endpoint,
          error: event.detail.error,
          response: event.detail.response,
          timestamp: Date.now()
        });
      });

      // Handle form submission errors
      document.addEventListener('webflow:formSubmitError', (event) => {
        this.handleFormError({
          form: event.detail.form,
          error: event.detail.error,
          timestamp: Date.now()
        });
      });

      // Handle content loading errors
      document.addEventListener('webflow:contentError', (event) => {
        this.handleContentError({
          element: event.detail.element,
          error: event.detail.error,
          config: event.detail.config,
          timestamp: Date.now()
        });
      });
    }

    /**
     * Set up network error handling
     */
    setupNetworkErrorHandling() {
      // Monitor network status
      window.addEventListener('online', () => {
        this.handleNetworkReconnect();
      });

      window.addEventListener('offline', () => {
        this.handleNetworkDisconnect();
      });

      // Check initial network status
      if (!navigator.onLine) {
        this.handleNetworkDisconnect();
      }
    }

    /**
     * Set up error reporting
     */
    setupErrorReporting() {
      // Batch and send error reports
      setInterval(() => {
        this.sendErrorReports();
      }, this.config.reportingInterval);

      // Send reports on page unload
      window.addEventListener('beforeunload', () => {
        this.sendErrorReports(true);
      });
    }

    /**
     * Set up retry processing
     */
    setupRetryProcessing() {
      setInterval(() => {
        this.processRetryQueue();
      }, 1000);
    }

    /**
     * Handle JavaScript errors
     */
    handleJavaScriptError(errorInfo) {
      this.errorStats.totalErrors++;
      this.errorStats.jsErrors++;
      this.errorStats.lastError = errorInfo;

      const error = {
        type: 'javascript',
        severity: this.determineErrorSeverity(errorInfo.message, errorInfo.error),
        message: errorInfo.message,
        stack: errorInfo.error?.stack,
        filename: errorInfo.filename,
        lineno: errorInfo.lineno,
        colno: errorInfo.colno,
        url: errorInfo.url,
        userAgent: errorInfo.userAgent,
        timestamp: errorInfo.timestamp
      };

      this.logError('JavaScript Error:', error);
      this.queueErrorReport(error);

      // Show user notification for severe errors
      if (error.severity === 'critical' && this.config.showErrorToasts) {
        this.showErrorToast('An unexpected error occurred. Please refresh the page if issues persist.');
      }
    }

    /**
     * Handle promise rejections
     */
    handlePromiseRejection(rejectionInfo) {
      this.errorStats.totalErrors++;
      this.errorStats.jsErrors++;

      const error = {
        type: 'promise_rejection',
        severity: 'error',
        message: rejectionInfo.reason?.message || String(rejectionInfo.reason),
        stack: rejectionInfo.reason?.stack,
        url: rejectionInfo.url,
        timestamp: rejectionInfo.timestamp
      };

      this.logError('Unhandled Promise Rejection:', error);
      this.queueErrorReport(error);
    }

    /**
     * Handle API errors
     */
    handleApiError(errorInfo) {
      this.errorStats.totalErrors++;
      this.errorStats.apiErrors++;

      const error = {
        type: 'api',
        severity: this.determineApiErrorSeverity(errorInfo.error, errorInfo.response),
        endpoint: errorInfo.endpoint,
        message: errorInfo.error,
        statusCode: errorInfo.response?.status,
        responseData: errorInfo.response?.data,
        timestamp: errorInfo.timestamp
      };

      this.logError('API Error:', error);
      this.queueErrorReport(error);

      // Handle specific error types
      this.handleSpecificApiError(error);

      // Queue for retry if appropriate
      if (this.shouldRetryError(error)) {
        this.queueForRetry(error);
      }
    }

    /**
     * Handle form submission errors
     */
    handleFormError(errorInfo) {
      const error = {
        type: 'form',
        severity: 'warning',
        formName: errorInfo.form.getAttribute('data-name') || errorInfo.form.id,
        message: errorInfo.error,
        timestamp: errorInfo.timestamp
      };

      this.logError('Form Error:', error);
      this.queueErrorReport(error);

      // Show fallback content for form
      this.showFormErrorFallback(errorInfo.form, errorInfo.error);
    }

    /**
     * Handle content loading errors
     */
    handleContentError(errorInfo) {
      const error = {
        type: 'content',
        severity: 'warning',
        endpoint: errorInfo.config.endpoint,
        elementId: errorInfo.element.id,
        elementClasses: errorInfo.element.className,
        message: errorInfo.error,
        timestamp: errorInfo.timestamp
      };

      this.logError('Content Error:', error);
      this.queueErrorReport(error);

      // Show fallback content
      this.showContentErrorFallback(errorInfo.element, errorInfo.config, errorInfo.error);

      // Queue for retry if appropriate
      if (this.shouldRetryError(error)) {
        this.queueForRetry(error);
      }
    }

    /**
     * Handle network disconnection
     */
    handleNetworkDisconnect() {
      this.log('🔌 Network disconnected');
      
      // Show offline indicator
      this.showNetworkStatus(false);
      
      // Activate offline fallbacks
      this.activateOfflineFallbacks();
      
      if (this.config.showErrorToasts) {
        this.showErrorToast('You appear to be offline. Some features may be limited.', 'warning');
      }
    }

    /**
     * Handle network reconnection
     */
    handleNetworkReconnect() {
      this.log('🔌 Network reconnected');
      
      // Hide offline indicator
      this.showNetworkStatus(true);
      
      // Retry failed requests
      this.retryFailedRequests();
      
      // Reload failed content
      this.reloadFailedContent();
      
      if (this.config.showErrorToasts) {
        this.showErrorToast('Connection restored. Reloading content...', 'success');
      }
    }

    /**
     * Handle specific API error types
     */
    handleSpecificApiError(error) {
      switch (error.statusCode) {
        case 401:
          this.handleAuthenticationError(error);
          break;
        case 403:
          this.handleAuthorizationError(error);
          break;
        case 404:
          this.handleNotFoundError(error);
          break;
        case 429:
          this.handleRateLimitError(error);
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          this.handleServerError(error);
          break;
        default:
          this.handleGenericApiError(error);
      }
    }

    /**
     * Handle authentication errors
     */
    handleAuthenticationError(error) {
      this.log('🔑 Authentication error');
      
      // Try to refresh token if available
      if (window.xanoClient && window.xanoClient.refreshToken) {
        this.queueForRetry(error, 'auth_refresh');
      }
      
      // Show authentication fallback
      this.showGlobalFallback('auth');
      
      // Trigger authentication event
      this.dispatchEvent('authenticationRequired', { error });
    }

    /**
     * Handle authorization errors
     */
    handleAuthorizationError(error) {
      this.log('🚫 Authorization error');
      this.showErrorToast('You do not have permission to access this resource.');
    }

    /**
     * Handle not found errors
     */
    handleNotFoundError(error) {
      this.log('❌ Resource not found');
      // Usually not retriable, show appropriate fallback
    }

    /**
     * Handle rate limiting errors
     */
    handleRateLimitError(error) {
      this.log('⏱️ Rate limited');
      
      // Queue for retry with exponential backoff
      this.queueForRetry(error, 'rate_limit');
      
      this.showErrorToast('Request rate limit exceeded. Retrying automatically...');
    }

    /**
     * Handle server errors
     */
    handleServerError(error) {
      this.log('🔥 Server error');
      this.errorStats.networkErrors++;
      
      // Queue for retry
      this.queueForRetry(error, 'server_error');
      
      this.showErrorToast('Server error occurred. Retrying automatically...');
    }

    /**
     * Handle generic API errors
     */
    handleGenericApiError(error) {
      this.log('⚠️ Generic API error');
      this.showErrorToast('An error occurred while processing your request.');
    }

    /**
     * Queue error for retry
     */
    queueForRetry(error, retryType = 'default') {
      const retryKey = `${error.type}_${error.timestamp}`;
      
      this.retryQueue.set(retryKey, {
        error: error,
        retryType: retryType,
        attempts: 0,
        maxAttempts: this.config.maxRetries,
        nextRetry: Date.now() + this.config.retryDelays[0],
        originalContext: this.captureRetryContext(error)
      });
      
      this.log(`📤 Queued for retry: ${retryKey}`);
    }

    /**
     * Process retry queue
     */
    async processRetryQueue() {
      const now = Date.now();
      
      for (const [retryKey, retryInfo] of this.retryQueue) {
        if (now >= retryInfo.nextRetry) {
          await this.processRetry(retryKey, retryInfo);
        }
      }
    }

    /**
     * Process individual retry
     */
    async processRetry(retryKey, retryInfo) {
      const { error, retryType, attempts, maxAttempts, originalContext } = retryInfo;
      
      if (attempts >= maxAttempts) {
        this.log(`❌ Max retries exceeded for: ${retryKey}`);
        this.retryQueue.delete(retryKey);
        this.handleRetryFailure(error, originalContext);
        return;
      }

      try {
        this.log(`🔄 Retrying (${attempts + 1}/${maxAttempts}): ${retryKey}`);
        
        let success = false;
        
        switch (retryType) {
          case 'auth_refresh':
            success = await this.retryWithAuthRefresh(error, originalContext);
            break;
          case 'rate_limit':
            success = await this.retryWithBackoff(error, originalContext);
            break;
          case 'server_error':
          case 'default':
            success = await this.retryOriginalRequest(error, originalContext);
            break;
        }

        if (success) {
          this.log(`✅ Retry successful: ${retryKey}`);
          this.retryQueue.delete(retryKey);
          this.handleRetrySuccess(error, originalContext);
        } else {
          // Schedule next retry
          const nextDelay = this.config.retryDelays[Math.min(attempts, this.config.retryDelays.length - 1)];
          retryInfo.attempts++;
          retryInfo.nextRetry = Date.now() + nextDelay;
        }

      } catch (retryError) {
        this.logError(`Retry failed for ${retryKey}:`, retryError);
        retryInfo.attempts++;
        retryInfo.nextRetry = Date.now() + this.config.retryDelays[Math.min(attempts, this.config.retryDelays.length - 1)];
      }
    }

    /**
     * Retry with authentication refresh
     */
    async retryWithAuthRefresh(error, context) {
      if (window.xanoClient && window.xanoClient.refreshToken) {
        const refreshSuccess = await window.xanoClient.refreshToken();
        if (refreshSuccess) {
          return this.retryOriginalRequest(error, context);
        }
      }
      return false;
    }

    /**
     * Retry with exponential backoff
     */
    async retryWithBackoff(error, context) {
      // Add extra delay for rate limiting
      await this.delay(2000);
      return this.retryOriginalRequest(error, context);
    }

    /**
     * Retry original request
     */
    async retryOriginalRequest(error, context) {
      try {
        if (context.type === 'api' && window.xanoClient) {
          const response = await window.xanoClient.makeRequest(context.endpoint);
          return response.success;
        }
        
        if (context.type === 'content' && window.webflowContentLoader) {
          await window.webflowContentLoader.reloadContent(context.selector);
          return true;
        }
        
        if (context.type === 'form' && window.webflowFormHandler) {
          await window.webflowFormHandler.submitForm(context.formId);
          return true;
        }
        
        return false;
      } catch (retryError) {
        return false;
      }
    }

    /**
     * Capture context for retry
     */
    captureRetryContext(error) {
      const context = {
        type: error.type,
        timestamp: error.timestamp
      };

      if (error.endpoint) {
        context.endpoint = error.endpoint;
      }

      if (error.formName) {
        context.formId = error.formName;
      }

      if (error.elementId) {
        context.selector = `#${error.elementId}`;
      }

      return context;
    }

    /**
     * Handle retry success
     */
    handleRetrySuccess(error, context) {
      this.dispatchEvent('retrySuccess', { error, context });
      
      if (this.config.showErrorToasts) {
        this.showErrorToast('Connection restored and request completed.', 'success');
      }
    }

    /**
     * Handle retry failure
     */
    handleRetryFailure(error, context) {
      this.dispatchEvent('retryFailure', { error, context });
      
      // Show permanent fallback
      this.showPermanentFallback(error, context);
    }

    /**
     * Show fallback content
     */
    showContentErrorFallback(element, config, error) {
      const fallbackContent = this.determineFallbackContent(error);
      element.innerHTML = fallbackContent;
      element.classList.add('has-error-fallback');
      
      this.fallbackElements.set(element, {
        originalContent: null,
        fallbackReason: error,
        timestamp: Date.now()
      });
    }

    /**
     * Show form error fallback
     */
    showFormErrorFallback(form, error) {
      const fallbackContent = this.determineFallbackContent(error);
      
      let errorContainer = form.querySelector('.form-error-fallback');
      if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'form-error-fallback';
        form.appendChild(errorContainer);
      }
      
      errorContainer.innerHTML = fallbackContent;
      errorContainer.style.display = 'block';
    }

    /**
     * Show global fallback
     */
    showGlobalFallback(type) {
      const fallbackContent = this.config.fallbackContent[type] || this.config.fallbackContent.default;
      
      // Create or update global fallback overlay
      let overlay = document.getElementById('webflow-global-fallback');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'webflow-global-fallback';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: Arial, sans-serif;
        `;
        document.body.appendChild(overlay);
      }
      
      overlay.innerHTML = `
        <div style="max-width: 500px; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          ${fallbackContent}
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
      
      overlay.style.display = 'flex';
    }

    /**
     * Show permanent fallback
     */
    showPermanentFallback(error, context) {
      if (context.type === 'content' && context.selector) {
        const element = document.querySelector(context.selector);
        if (element) {
          const fallbackContent = this.determineFallbackContent(error.message);
          element.innerHTML = fallbackContent + '<br><small>Unable to load content after multiple attempts.</small>';
          element.classList.add('permanent-fallback');
        }
      }
    }

    /**
     * Determine appropriate fallback content
     */
    determineFallbackContent(error) {
      const errorMessage = String(error).toLowerCase();
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return this.config.fallbackContent.network;
      }
      
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
        return this.config.fallbackContent.auth;
      }
      
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return this.config.fallbackContent.notFound;
      }
      
      if (errorMessage.includes('50') || errorMessage.includes('server')) {
        return this.config.fallbackContent.serverError;
      }
      
      return this.config.fallbackContent.default;
    }

    /**
     * Activate offline fallbacks
     */
    activateOfflineFallbacks() {
      // Hide elements that require network
      const networkElements = document.querySelectorAll('[data-requires-network]');
      networkElements.forEach(element => {
        element.style.display = 'none';
        element.setAttribute('data-hidden-offline', 'true');
      });
      
      // Show offline alternatives
      const offlineElements = document.querySelectorAll('[data-offline-alternative]');
      offlineElements.forEach(element => {
        element.style.display = 'block';
      });
    }

    /**
     * Show network status indicator
     */
    showNetworkStatus(isOnline) {
      let indicator = document.getElementById('network-status-indicator');
      
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'network-status-indicator';
        indicator.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          z-index: 9998;
          transition: all 0.3s ease;
        `;
        document.body.appendChild(indicator);
      }
      
      if (isOnline) {
        indicator.style.background = '#27ae60';
        indicator.style.color = 'white';
        indicator.textContent = '🔌 Online';
        
        // Hide after 3 seconds
        setTimeout(() => {
          indicator.style.display = 'none';
        }, 3000);
      } else {
        indicator.style.background = '#e74c3c';
        indicator.style.color = 'white';
        indicator.textContent = '📵 Offline';
        indicator.style.display = 'block';
      }
    }

    /**
     * Show error toast notification
     */
    showErrorToast(message, type = 'error') {
      if (!this.config.showErrorToasts) return;
      
      const toast = document.createElement('div');
      toast.className = `${this.config.errorToastClass} toast-${type}`;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        max-width: 400px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        z-index: 9997;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        cursor: pointer;
      `;
      
      // Set background color based on type
      const colors = {
        error: '#e74c3c',
        warning: '#f39c12',
        success: '#27ae60',
        info: '#3498db'
      };
      toast.style.background = colors[type] || colors.error;
      
      toast.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span>${message}</span>
          <span style="margin-left: 15px; cursor: pointer; font-weight: bold;">&times;</span>
        </div>
      `;
      
      // Add click to dismiss
      toast.addEventListener('click', () => {
        toast.remove();
      });
      
      document.body.appendChild(toast);
      
      // Auto-remove after duration
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'slideOut 0.3s ease';
          setTimeout(() => toast.remove(), 300);
        }
      }, this.config.toastDuration);
      
      // Add CSS animations
      if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    /**
     * Retry failed requests after reconnection
     */
    async retryFailedRequests() {
      // Process all queued retries immediately
      for (const [retryKey, retryInfo] of this.retryQueue) {
        await this.processRetry(retryKey, retryInfo);
      }
    }

    /**
     * Reload failed content after reconnection
     */
    async reloadFailedContent() {
      // Restore elements that were hidden due to network issues
      const hiddenElements = document.querySelectorAll('[data-hidden-offline]');
      hiddenElements.forEach(element => {
        element.style.display = '';
        element.removeAttribute('data-hidden-offline');
      });
      
      // Hide offline alternatives
      const offlineElements = document.querySelectorAll('[data-offline-alternative]');
      offlineElements.forEach(element => {
        element.style.display = 'none';
      });
      
      // Reload content with fallbacks
      for (const [element, fallbackInfo] of this.fallbackElements) {
        if (window.webflowContentLoader) {
          try {
            await window.webflowContentLoader.reloadContent(element);
            element.classList.remove('has-error-fallback', 'permanent-fallback');
            this.fallbackElements.delete(element);
          } catch (error) {
            this.logError('Failed to reload content:', error);
          }
        }
      }
    }

    /**
     * Queue error for reporting
     */
    queueErrorReport(error) {
      if (!this.config.reportErrors) return;
      
      this.errorQueue.push(error);
      
      // Send immediately if queue is full
      if (this.errorQueue.length >= this.config.reportingBatchSize) {
        this.sendErrorReports();
      }
    }

    /**
     * Send error reports
     */
    async sendErrorReports(immediate = false) {
      if (!this.config.reportingEndpoint || this.errorQueue.length === 0) return;
      
      const errors = [...this.errorQueue];
      this.errorQueue = [];
      
      const report = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        stats: this.errorStats,
        errors: errors
      };
      
      try {
        if (immediate && navigator.sendBeacon) {
          // Use sendBeacon for unload events
          navigator.sendBeacon(
            this.config.reportingEndpoint,
            JSON.stringify(report)
          );
        } else {
          await fetch(this.config.reportingEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
          });
        }
        
        this.log(`📊 Sent error report with ${errors.length} errors`);
      } catch (error) {
        this.logError('Failed to send error report:', error);
        // Re-queue the errors
        this.errorQueue.unshift(...errors);
      }
    }

    /**
     * Utility methods
     */
    determineErrorSeverity(message, error) {
      const criticalKeywords = ['undefined', 'null', 'reference', 'syntax'];
      const messageLower = message.toLowerCase();
      
      if (criticalKeywords.some(keyword => messageLower.includes(keyword))) {
        return 'critical';
      }
      
      if (error && error.stack) {
        return 'error';
      }
      
      return 'warning';
    }

    determineApiErrorSeverity(message, response) {
      if (!response) return 'error';
      
      const status = response.status;
      
      if (status >= 500) return 'critical';
      if (status >= 400) return 'error';
      return 'warning';
    }

    shouldRetryError(error) {
      if (error.type === 'api' && error.statusCode) {
        return this.config.retryOnCodes.includes(error.statusCode);
      }
      
      if (error.type === 'content' || error.type === 'form') {
        return true;
      }
      
      return false;
    }

    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    dispatchEvent(eventName, detail = {}) {
      const event = new CustomEvent(`webflow:error:${eventName}`, { detail });
      document.dispatchEvent(event);
    }

    log(...args) {
      if (this.config.logErrors || this.config.debugMode) {
        console.log('[WebflowErrorHandler]', ...args);
      }
    }

    logError(...args) {
      console.error('[WebflowErrorHandler Error]', ...args);
    }

    /**
     * Public API methods
     */

    // Manually report error
    reportError(error, context = {}) {
      const errorReport = {
        type: 'manual',
        severity: context.severity || 'warning',
        message: error.message || String(error),
        stack: error.stack,
        context: context,
        timestamp: Date.now()
      };

      this.queueErrorReport(errorReport);
    }

    // Get error statistics
    getErrorStats() {
      return { ...this.errorStats };
    }

    // Clear error queue
    clearErrorQueue() {
      this.errorQueue = [];
    }

    // Get retry queue status
    getRetryQueueStatus() {
      return {
        size: this.retryQueue.size,
        items: Array.from(this.retryQueue.keys())
      };
    }

    // Manually retry failed operations
    async retryAll() {
      await this.retryFailedRequests();
    }

    // Show custom error message
    showError(message, type = 'error') {
      this.showErrorToast(message, type);
    }

    // Test error handling (development only)
    testErrorHandling() {
      if (!this.config.debugMode) {
        console.warn('Error testing is only available in debug mode');
        return;
      }

      // Test JavaScript error
      setTimeout(() => {
        throw new Error('Test JavaScript Error');
      }, 1000);

      // Test promise rejection
      setTimeout(() => {
        Promise.reject(new Error('Test Promise Rejection'));
      }, 2000);

      // Test API error
      if (window.xanoClient) {
        setTimeout(() => {
          window.xanoClient.makeRequest('/nonexistent-endpoint');
        }, 3000);
      }
    }
  }

  // Add CSS for animations and styles
  const errorHandlerStyles = document.createElement('style');
  errorHandlerStyles.textContent = `
    .error-fallback {
      padding: 20px;
      text-align: center;
      color: #666;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin: 10px 0;
    }
    
    .has-error-fallback {
      opacity: 0.7;
    }
    
    .permanent-fallback {
      opacity: 0.5;
    }
  `;
  document.head.appendChild(errorHandlerStyles);

  // Create global instance
  window.WebflowErrorHandler = WebflowErrorHandler;
  window.webflowErrorHandler = new WebflowErrorHandler();

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebflowErrorHandler;
  }

})(typeof window !== 'undefined' ? window : global);