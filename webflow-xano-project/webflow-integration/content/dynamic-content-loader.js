/**
 * Dynamic Content Loader for Webflow + Xano Integration
 * 
 * This module provides powerful dynamic content loading capabilities
 * including CMS integration, real-time updates, caching, and templating.
 * 
 * Usage in Webflow:
 * 1. Add data attributes to elements that should load dynamic content
 * 2. Include this script after environment-config.js and xano-client.js
 * 3. Content will be automatically loaded on page load
 */

(function(window) {
  'use strict';

  /**
   * Dynamic Content Loader for Webflow + Xano Integration
   */
  class WebflowContentLoader {
    constructor(config = {}) {
      this.config = {
        // Default configuration
        autoInit: true,
        enableCaching: true,
        cacheTimeout: 300000, // 5 minutes
        enableRealTimeUpdates: false,
        realTimeInterval: 30000, // 30 seconds
        maxRetries: 3,
        retryDelay: 1000,
        batchRequests: true,
        batchDelay: 100,
        enableIntersectionObserver: true,
        loadingPlaceholder: '<div class="content-loading">Loading...</div>',
        errorPlaceholder: '<div class="content-error">Failed to load content.</div>',
        emptyPlaceholder: '<div class="content-empty">No content available.</div>',
        ...config
      };

      // Get configuration from environment config
      if (window.WebflowXanoConfig) {
        const contentConfig = window.WebflowXanoConfig.getFeatureConfig('content');
        this.config = { ...this.config, ...contentConfig };
      }

      this.contentElements = new Map();
      this.cache = new Map();
      this.loadQueue = [];
      this.templates = new Map();
      this.observers = new Map();
      this.xanoClient = window.xanoClient;
      this.intersectionObserver = null;
      this.batchTimer = null;

      if (this.config.autoInit) {
        this.init();
      }
    }

    /**
     * Initialize content loader
     */
    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }

      this.log('🔧 WebflowContentLoader initialized');
    }

    /**
     * Set up content loader
     */
    setup() {
      // Set up intersection observer for lazy loading
      if (this.config.enableIntersectionObserver) {
        this.setupIntersectionObserver();
      }

      // Register default templates
      this.registerDefaultTemplates();

      // Load all content elements
      this.loadAllContent();

      // Set up real-time updates
      if (this.config.enableRealTimeUpdates) {
        this.setupRealTimeUpdates();
      }

      this.log('✅ WebflowContentLoader setup complete');
    }

    /**
     * Set up intersection observer for lazy loading
     */
    setupIntersectionObserver() {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const contentId = element.getAttribute('data-content-id');
            if (contentId && !element.hasAttribute('data-loaded')) {
              this.loadContentForElement(element);
              this.intersectionObserver.unobserve(element);
            }
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });
    }

    /**
     * Load all content elements
     */
    loadAllContent() {
      const contentElements = document.querySelectorAll('[data-xano-content]');
      
      contentElements.forEach((element, index) => {
        this.setupContentElement(element, index);
      });

      // Process batch loading
      if (this.config.batchRequests && this.loadQueue.length > 0) {
        this.processBatchLoading();
      }

      this.log(`📄 Found ${contentElements.length} content elements`);
    }

    /**
     * Set up individual content element
     */
    setupContentElement(element, index) {
      const contentId = element.getAttribute('data-content-id') || `content-${index}`;
      const config = this.extractContentConfig(element);

      // Store element configuration
      this.contentElements.set(contentId, {
        element: element,
        config: config,
        loaded: false,
        loading: false,
        error: null,
        lastUpdate: null
      });

      element.setAttribute('data-content-id', contentId);

      // Determine loading strategy
      if (config.lazy && this.intersectionObserver) {
        // Lazy load with intersection observer
        this.intersectionObserver.observe(element);
      } else if (config.lazy) {
        // Lazy load without intersection observer (scroll-based)
        this.setupScrollLazyLoading(element);
      } else {
        // Immediate loading or batch loading
        if (this.config.batchRequests) {
          this.loadQueue.push(contentId);
        } else {
          this.loadContentForElement(element);
        }
      }
    }

    /**
     * Extract content configuration from element
     */
    extractContentConfig(element) {
      return {
        endpoint: element.getAttribute('data-xano-content'),
        template: element.getAttribute('data-xano-template'),
        fallback: element.getAttribute('data-xano-fallback'),
        requiresAuth: element.hasAttribute('data-xano-auth'),
        lazy: element.hasAttribute('data-lazy-load'),
        realTime: element.hasAttribute('data-real-time'),
        cacheKey: element.getAttribute('data-cache-key'),
        cacheTtl: parseInt(element.getAttribute('data-cache-ttl')) || this.config.cacheTimeout,
        transform: element.getAttribute('data-transform'),
        filter: element.getAttribute('data-filter'),
        sort: element.getAttribute('data-sort'),
        limit: parseInt(element.getAttribute('data-limit')) || null,
        offset: parseInt(element.getAttribute('data-offset')) || 0,
        refresh: element.getAttribute('data-refresh'),
        loadingClass: element.getAttribute('data-loading-class') || 'is-loading',
        errorClass: element.getAttribute('data-error-class') || 'has-error',
        emptyClass: element.getAttribute('data-empty-class') || 'is-empty'
      };
    }

    /**
     * Set up scroll-based lazy loading
     */
    setupScrollLazyLoading(element) {
      const checkVisibility = () => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
        
        if (isVisible && !element.hasAttribute('data-loaded')) {
          this.loadContentForElement(element);
          window.removeEventListener('scroll', checkVisibility);
          window.removeEventListener('resize', checkVisibility);
        }
      };

      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility, { passive: true });
      
      // Check immediately
      checkVisibility();
    }

    /**
     * Process batch loading
     */
    processBatchLoading() {
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
      }

      this.batchTimer = setTimeout(async () => {
        const batch = [...this.loadQueue];
        this.loadQueue = [];

        // Group requests by endpoint
        const endpointGroups = this.groupByEndpoint(batch);

        for (const [endpoint, contentIds] of endpointGroups) {
          await this.loadBatchContent(endpoint, contentIds);
        }
      }, this.config.batchDelay);
    }

    /**
     * Group content IDs by endpoint for batch loading
     */
    groupByEndpoint(contentIds) {
      const groups = new Map();

      contentIds.forEach(contentId => {
        const contentData = this.contentElements.get(contentId);
        if (contentData) {
          const endpoint = contentData.config.endpoint;
          if (!groups.has(endpoint)) {
            groups.set(endpoint, []);
          }
          groups.get(endpoint).push(contentId);
        }
      });

      return groups;
    }

    /**
     * Load content for multiple elements with the same endpoint
     */
    async loadBatchContent(endpoint, contentIds) {
      try {
        // Mark all elements as loading
        contentIds.forEach(contentId => {
          const contentData = this.contentElements.get(contentId);
          if (contentData) {
            contentData.loading = true;
            this.setElementLoading(contentData.element, true);
          }
        });

        // Make single request for all elements
        const response = await this.makeContentRequest(endpoint);

        if (response.success) {
          // Distribute data to elements
          contentIds.forEach(contentId => {
            const contentData = this.contentElements.get(contentId);
            if (contentData) {
              this.handleContentSuccess(contentData.element, contentData.config, response.data);
            }
          });
        } else {
          // Handle error for all elements
          contentIds.forEach(contentId => {
            const contentData = this.contentElements.get(contentId);
            if (contentData) {
              this.handleContentError(contentData.element, contentData.config, response.error);
            }
          });
        }

      } catch (error) {
        this.logError('Batch content loading failed:', error);
        
        // Fall back to individual loading
        for (const contentId of contentIds) {
          const contentData = this.contentElements.get(contentId);
          if (contentData) {
            await this.loadContentForElement(contentData.element);
          }
        }
      }
    }

    /**
     * Load content for individual element
     */
    async loadContentForElement(element) {
      const contentId = element.getAttribute('data-content-id');
      const contentData = this.contentElements.get(contentId);
      
      if (!contentData || contentData.loading) return;

      const { config } = contentData;

      try {
        // Check authentication if required
        if (config.requiresAuth && (!this.xanoClient || !this.xanoClient.isUserAuthenticated())) {
          this.handleContentError(element, config, 'Authentication required');
          return;
        }

        // Check cache first
        if (this.config.enableCaching) {
          const cachedData = this.getCachedData(config.endpoint, config.cacheKey);
          if (cachedData) {
            this.handleContentSuccess(element, config, cachedData);
            return;
          }
        }

        // Mark as loading
        contentData.loading = true;
        this.setElementLoading(element, true);

        // Build request URL with parameters
        const requestUrl = this.buildRequestUrl(config.endpoint, config);

        // Make request
        const response = await this.makeContentRequest(requestUrl);

        if (response.success) {
          // Process data
          let data = response.data;
          data = this.applyDataTransforms(data, config);

          // Cache the data
          if (this.config.enableCaching) {
            this.setCachedData(config.endpoint, data, config.cacheKey, config.cacheTtl);
          }

          this.handleContentSuccess(element, config, data);
        } else {
          this.handleContentError(element, config, response.error);
        }

      } catch (error) {
        this.logError('Content loading failed:', error);
        this.handleContentError(element, config, error.message);
      } finally {
        contentData.loading = false;
        this.setElementLoading(element, false);
      }
    }

    /**
     * Build request URL with query parameters
     */
    buildRequestUrl(endpoint, config) {
      const url = new URL(endpoint, window.location.origin);
      
      if (config.limit) url.searchParams.set('limit', config.limit);
      if (config.offset) url.searchParams.set('offset', config.offset);
      if (config.sort) url.searchParams.set('sort', config.sort);
      if (config.filter) url.searchParams.set('filter', config.filter);
      
      return url.pathname + url.search;
    }

    /**
     * Apply data transformations
     */
    applyDataTransforms(data, config) {
      let transformedData = data;

      // Apply custom transform function
      if (config.transform && window[config.transform]) {
        try {
          transformedData = window[config.transform](transformedData);
        } catch (error) {
          this.logError('Data transform failed:', error);
        }
      }

      // Apply sorting
      if (config.sort && Array.isArray(transformedData)) {
        const [field, direction = 'asc'] = config.sort.split(':');
        transformedData.sort((a, b) => {
          const aVal = this.getNestedValue(a, field);
          const bVal = this.getNestedValue(b, field);
          const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === 'desc' ? -result : result;
        });
      }

      // Apply filtering
      if (config.filter && Array.isArray(transformedData)) {
        const filters = this.parseFilters(config.filter);
        transformedData = transformedData.filter(item => 
          filters.every(filter => this.applyFilter(item, filter))
        );
      }

      // Apply limit and offset
      if (Array.isArray(transformedData)) {
        const start = config.offset || 0;
        const end = config.limit ? start + config.limit : undefined;
        transformedData = transformedData.slice(start, end);
      }

      return transformedData;
    }

    /**
     * Parse filter string
     */
    parseFilters(filterString) {
      const filters = [];
      const parts = filterString.split(',');
      
      parts.forEach(part => {
        const [field, operator, value] = part.split(':');
        if (field && operator && value) {
          filters.push({ field, operator, value });
        }
      });
      
      return filters;
    }

    /**
     * Apply individual filter
     */
    applyFilter(item, filter) {
      const itemValue = this.getNestedValue(item, filter.field);
      const filterValue = filter.value;

      switch (filter.operator) {
        case 'eq': return itemValue == filterValue;
        case 'ne': return itemValue != filterValue;
        case 'gt': return itemValue > filterValue;
        case 'gte': return itemValue >= filterValue;
        case 'lt': return itemValue < filterValue;
        case 'lte': return itemValue <= filterValue;
        case 'contains': return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'starts': return String(itemValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
        case 'ends': return String(itemValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
        default: return true;
      }
    }

    /**
     * Get nested value from object
     */
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Make content request
     */
    async makeContentRequest(endpoint) {
      if (!this.xanoClient) {
        return { success: false, error: 'Xano client not available' };
      }

      // Try multiple times with exponential backoff
      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
          const response = await this.xanoClient.makeRequest(endpoint);
          return response;
        } catch (error) {
          if (attempt === this.config.maxRetries) {
            return { success: false, error: error.message };
          }
          
          // Wait before retry
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    /**
     * Handle successful content load
     */
    handleContentSuccess(element, config, data) {
      const contentId = element.getAttribute('data-content-id');
      const contentData = this.contentElements.get(contentId);
      
      if (contentData) {
        contentData.loaded = true;
        contentData.error = null;
        contentData.lastUpdate = Date.now();
      }

      // Clear loading and error states
      element.classList.remove(config.loadingClass, config.errorClass);
      element.removeAttribute('data-loading');
      element.removeAttribute('data-error');

      // Check for empty data
      const isEmpty = this.isEmptyData(data);
      if (isEmpty) {
        element.classList.add(config.emptyClass);
        element.innerHTML = config.fallback || this.config.emptyPlaceholder;
      } else {
        element.classList.remove(config.emptyClass);
        this.renderContent(element, data, config.template);
      }

      // Mark as loaded
      element.setAttribute('data-loaded', 'true');

      // Trigger custom event
      this.dispatchEvent('contentLoaded', { element, data, config });
    }

    /**
     * Handle content loading error
     */
    handleContentError(element, config, error) {
      const contentId = element.getAttribute('data-content-id');
      const contentData = this.contentElements.get(contentId);
      
      if (contentData) {
        contentData.loaded = false;
        contentData.error = error;
      }

      // Set error state
      element.classList.remove(config.loadingClass);
      element.classList.add(config.errorClass);
      element.setAttribute('data-error', error);

      // Show fallback or error content
      const fallbackContent = config.fallback || this.config.errorPlaceholder;
      element.innerHTML = fallbackContent;

      // Trigger custom event
      this.dispatchEvent('contentError', { element, error, config });
    }

    /**
     * Check if data is empty
     */
    isEmptyData(data) {
      if (!data) return true;
      if (Array.isArray(data)) return data.length === 0;
      if (typeof data === 'object') return Object.keys(data).length === 0;
      return false;
    }

    /**
     * Render content using templates
     */
    renderContent(element, data, templateName) {
      let html = '';

      if (templateName && this.templates.has(templateName)) {
        // Use registered template
        const template = this.templates.get(templateName);
        html = template(data);
      } else if (templateName && window[templateName]) {
        // Use global template function
        html = window[templateName](data);
      } else if (Array.isArray(data)) {
        // Default array rendering
        html = data.map(item => this.renderContentItem(item)).join('');
      } else {
        // Default object rendering
        html = this.renderContentItem(data);
      }

      element.innerHTML = html;

      // Process any embedded content elements in the rendered content
      const embeddedElements = element.querySelectorAll('[data-xano-content]');
      embeddedElements.forEach((embeddedElement, index) => {
        this.setupContentElement(embeddedElement, Date.now() + index);
      });
    }

    /**
     * Render individual content item
     */
    renderContentItem(item) {
      if (typeof item === 'string' || typeof item === 'number') {
        return `<div class="content-item">${item}</div>`;
      }

      if (typeof item !== 'object' || !item) {
        return '<div class="content-item">No content</div>';
      }

      let html = '<div class="content-item">';
      
      Object.entries(item).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'string' || typeof value === 'number') {
            html += `<div class="content-field content-${key}">${this.escapeHtml(String(value))}</div>`;
          } else if (typeof value === 'object') {
            html += `<div class="content-field content-${key}">${JSON.stringify(value)}</div>`;
          }
        }
      });
      
      html += '</div>';
      return html;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Set element loading state
     */
    setElementLoading(element, isLoading) {
      const config = this.extractContentConfig(element);
      
      if (isLoading) {
        element.classList.add(config.loadingClass);
        element.setAttribute('data-loading', 'true');
        
        if (!element.innerHTML.trim()) {
          element.innerHTML = this.config.loadingPlaceholder;
        }
      } else {
        element.classList.remove(config.loadingClass);
        element.removeAttribute('data-loading');
      }
    }

    /**
     * Register content template
     */
    registerTemplate(name, templateFunction) {
      if (typeof templateFunction !== 'function') {
        this.logError('Template must be a function:', name);
        return;
      }

      this.templates.set(name, templateFunction);
      this.log(`📝 Registered template: ${name}`);
    }

    /**
     * Register default templates
     */
    registerDefaultTemplates() {
      // Card template
      this.registerTemplate('card', (data) => {
        if (Array.isArray(data)) {
          return data.map(item => this.renderCard(item)).join('');
        }
        return this.renderCard(data);
      });

      // List template
      this.registerTemplate('list', (data) => {
        if (!Array.isArray(data)) data = [data];
        
        let html = '<ul class="content-list">';
        data.forEach(item => {
          html += `<li class="list-item">${item.title || item.name || JSON.stringify(item)}</li>`;
        });
        html += '</ul>';
        
        return html;
      });

      // Table template
      this.registerTemplate('table', (data) => {
        if (!Array.isArray(data) || data.length === 0) return '<p>No data to display</p>';
        
        const headers = Object.keys(data[0]);
        let html = '<table class="content-table"><thead><tr>';
        
        headers.forEach(header => {
          html += `<th>${header}</th>`;
        });
        
        html += '</tr></thead><tbody>';
        
        data.forEach(row => {
          html += '<tr>';
          headers.forEach(header => {
            html += `<td>${row[header] || ''}</td>`;
          });
          html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
      });

      // Gallery template
      this.registerTemplate('gallery', (data) => {
        if (!Array.isArray(data)) data = [data];
        
        let html = '<div class="content-gallery">';
        data.forEach(item => {
          const imageUrl = item.image || item.url || item.src;
          const title = item.title || item.name || '';
          const description = item.description || item.caption || '';
          
          if (imageUrl) {
            html += `
              <div class="gallery-item">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                ${title ? `<h3 class="gallery-title">${title}</h3>` : ''}
                ${description ? `<p class="gallery-description">${description}</p>` : ''}
              </div>
            `;
          }
        });
        html += '</div>';
        
        return html;
      });
    }

    /**
     * Render card component
     */
    renderCard(item) {
      const title = item.title || item.name || 'Untitled';
      const description = item.description || item.content || '';
      const image = item.image || item.thumbnail || '';
      const link = item.link || item.url || '';

      let html = '<div class="content-card">';
      
      if (image) {
        html += `<div class="card-image"><img src="${image}" alt="${title}" loading="lazy"></div>`;
      }
      
      html += '<div class="card-content">';
      html += `<h3 class="card-title">${title}</h3>`;
      
      if (description) {
        html += `<p class="card-description">${description}</p>`;
      }
      
      if (link) {
        html += `<a href="${link}" class="card-link">Read More</a>`;
      }
      
      html += '</div></div>';
      
      return html;
    }

    /**
     * Cache management
     */
    getCachedData(endpoint, cacheKey = null) {
      const key = cacheKey || endpoint;
      const cached = this.cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      
      if (cached) {
        this.cache.delete(key);
      }
      
      return null;
    }

    setCachedData(endpoint, data, cacheKey = null, ttl = null) {
      const key = cacheKey || endpoint;
      this.cache.set(key, {
        data: data,
        timestamp: Date.now(),
        ttl: ttl || this.config.cacheTimeout
      });
    }

    clearCache(pattern = null) {
      if (pattern) {
        for (const [key] of this.cache) {
          if (key.includes(pattern)) {
            this.cache.delete(key);
          }
        }
      } else {
        this.cache.clear();
      }
    }

    /**
     * Real-time updates
     */
    setupRealTimeUpdates() {
      setInterval(() => {
        this.refreshRealTimeContent();
      }, this.config.realTimeInterval);
    }

    async refreshRealTimeContent() {
      const realTimeElements = Array.from(this.contentElements.values())
        .filter(contentData => contentData.config.realTime && contentData.loaded);

      for (const contentData of realTimeElements) {
        try {
          // Clear cache for this element
          this.clearCache(contentData.config.endpoint);
          
          // Reload content
          await this.loadContentForElement(contentData.element);
        } catch (error) {
          this.logError('Real-time refresh failed:', error);
        }
      }

      if (realTimeElements.length > 0) {
        this.log(`🔄 Refreshed ${realTimeElements.length} real-time content elements`);
      }
    }

    /**
     * Utility methods
     */
    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    dispatchEvent(eventName, detail = {}) {
      const event = new CustomEvent(`webflow:${eventName}`, { detail });
      document.dispatchEvent(event);
    }

    log(...args) {
      if (window.WebflowXanoConfig && window.WebflowXanoConfig.isDebug()) {
        console.log('[WebflowContentLoader]', ...args);
      }
    }

    logError(...args) {
      console.error('[WebflowContentLoader Error]', ...args);
    }

    /**
     * Public API methods
     */

    // Reload content for specific element
    async reloadContent(selector) {
      const elements = typeof selector === 'string' 
        ? document.querySelectorAll(selector)
        : [selector];
      
      for (const element of elements) {
        const contentId = element.getAttribute('data-content-id');
        if (contentId) {
          const contentData = this.contentElements.get(contentId);
          if (contentData) {
            // Clear cache
            this.clearCache(contentData.config.endpoint);
            // Reload
            await this.loadContentForElement(element);
          }
        }
      }
    }

    // Reload all content
    async reloadAllContent() {
      this.clearCache();
      
      for (const [contentId, contentData] of this.contentElements) {
        if (contentData.loaded) {
          await this.loadContentForElement(contentData.element);
        }
      }
    }

    // Get content data
    getContentData(selector) {
      const element = typeof selector === 'string' 
        ? document.querySelector(selector)
        : selector;
      
      if (!element) return null;
      
      const contentId = element.getAttribute('data-content-id');
      return contentId ? this.contentElements.get(contentId) : null;
    }

    // Check if content is loaded
    isContentLoaded(selector) {
      const contentData = this.getContentData(selector);
      return contentData ? contentData.loaded : false;
    }

    // Get cache stats
    getCacheStats() {
      return {
        size: this.cache.size,
        keys: Array.from(this.cache.keys()),
        totalMemory: JSON.stringify(Array.from(this.cache.values())).length
      };
    }
  }

  // Create global instance
  window.WebflowContentLoader = WebflowContentLoader;
  window.webflowContentLoader = new WebflowContentLoader();

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebflowContentLoader;
  }

})(typeof window !== 'undefined' ? window : global);