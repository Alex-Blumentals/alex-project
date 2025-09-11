/**
 * Enhanced Form Handler for Webflow + Xano Integration
 * 
 * This module provides comprehensive form handling capabilities including
 * validation, submission, file uploads, and integration with Webflow forms.
 * 
 * Usage in Webflow:
 * 1. Add data attributes to your forms
 * 2. Include this script after environment-config.js and xano-client.js
 * 3. Forms will be automatically enhanced on page load
 */

(function(window) {
  'use strict';

  /**
   * Enhanced Form Handler for Webflow + Xano Integration
   */
  class WebflowFormHandler {
    constructor(config = {}) {
      this.config = {
        // Default configuration
        autoInit: true,
        validateOnInput: true,
        showRealTimeValidation: true,
        enableFileUploads: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
        submitButtonText: {
          default: 'Submit',
          loading: 'Submitting...',
          success: 'Success!',
          error: 'Try Again'
        },
        messages: {
          networkError: 'Network error. Please check your connection and try again.',
          serverError: 'Server error. Please try again later.',
          validationError: 'Please check your input and try again.',
          fileTooBig: 'File is too large. Maximum size is {maxSize}MB.',
          invalidFileType: 'File type not allowed. Allowed types: {allowedTypes}.',
          requiredField: 'This field is required.',
          invalidEmail: 'Please enter a valid email address.',
          invalidPhone: 'Please enter a valid phone number.',
          passwordTooShort: 'Password must be at least {minLength} characters.',
          passwordsNoMatch: 'Passwords do not match.'
        },
        ...config
      };

      // Get configuration from environment config
      if (window.WebflowXanoConfig) {
        const formConfig = window.WebflowXanoConfig.getFeatureConfig('forms');
        this.config = { ...this.config, ...formConfig };
      }

      this.forms = new Map();
      this.validators = new Map();
      this.xanoClient = window.xanoClient;

      if (this.config.autoInit) {
        this.init();
      }
    }

    /**
     * Initialize form handler
     */
    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupForms());
      } else {
        this.setupForms();
      }

      this.log('🔧 WebflowFormHandler initialized');
    }

    /**
     * Set up all forms with Xano attributes
     */
    setupForms() {
      // Enhanced Xano forms
      const xanoForms = document.querySelectorAll('[data-xano-form]');
      xanoForms.forEach(form => this.enhanceForm(form));

      // Standard Webflow forms
      const webflowForms = document.querySelectorAll('form[data-name]');
      webflowForms.forEach(form => {
        if (!form.hasAttribute('data-xano-form')) {
          this.enhanceWebflowForm(form);
        }
      });

      this.log(`📝 Enhanced ${xanoForms.length + webflowForms.length} forms`);
    }

    /**
     * Enhance a form with Xano integration
     */
    enhanceForm(form) {
      const formId = this.generateFormId(form);
      const config = this.extractFormConfig(form);

      // Store form configuration
      this.forms.set(formId, {
        element: form,
        config: config,
        isSubmitting: false,
        validators: new Map()
      });

      // Set up event listeners
      this.setupFormListeners(form, formId);

      // Set up field validation
      this.setupFieldValidation(form, formId);

      // Set up file upload handling
      if (config.enableFileUploads) {
        this.setupFileUploads(form, formId);
      }

      // Mark as enhanced
      form.setAttribute('data-form-enhanced', 'true');
      form.setAttribute('data-form-id', formId);

      this.log(`✅ Enhanced form: ${formId}`);
    }

    /**
     * Enhance standard Webflow form
     */
    enhanceWebflowForm(form) {
      const formId = this.generateFormId(form);
      const formName = form.getAttribute('data-name');

      // Add Xano integration if not present
      if (!form.hasAttribute('data-xano-form')) {
        // Try to map Webflow form to Xano endpoint
        const endpoint = this.mapWebflowFormToEndpoint(formName);
        if (endpoint) {
          form.setAttribute('data-xano-form', endpoint);
          form.setAttribute('data-xano-method', 'POST');
        }
      }

      this.enhanceForm(form);
    }

    /**
     * Extract form configuration from data attributes
     */
    extractFormConfig(form) {
      return {
        endpoint: form.getAttribute('data-xano-form'),
        method: form.getAttribute('data-xano-method') || 'POST',
        requiresAuth: form.hasAttribute('data-xano-auth'),
        successMessage: form.getAttribute('data-success-message') || 'Form submitted successfully!',
        errorMessage: form.getAttribute('data-error-message'),
        successRedirect: form.getAttribute('data-success-redirect'),
        resetOnSuccess: form.hasAttribute('data-reset-on-success'),
        showProgress: form.hasAttribute('data-show-progress'),
        enableFileUploads: form.hasAttribute('data-enable-files') || this.config.enableFileUploads,
        validateOnSubmit: !form.hasAttribute('data-no-validation'),
        customValidation: form.getAttribute('data-custom-validation'),
        beforeSubmit: form.getAttribute('data-before-submit'),
        afterSubmit: form.getAttribute('data-after-submit')
      };
    }

    /**
     * Set up form event listeners
     */
    setupFormListeners(form, formId) {
      // Prevent default Webflow form submission
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleFormSubmit(formId, event);
      });

      // Real-time validation if enabled
      if (this.config.validateOnInput) {
        form.addEventListener('input', (event) => {
          this.handleFieldInput(formId, event);
        });

        form.addEventListener('blur', (event) => {
          this.handleFieldBlur(formId, event);
        });
      }

      // Handle file input changes
      form.addEventListener('change', (event) => {
        if (event.target.type === 'file') {
          this.handleFileChange(formId, event);
        }
      });
    }

    /**
     * Set up field validation
     */
    setupFieldValidation(form, formId) {
      const formData = this.forms.get(formId);
      const fields = form.querySelectorAll('input, textarea, select');

      fields.forEach(field => {
        const validators = this.createFieldValidators(field);
        formData.validators.set(field.name || field.id, validators);

        // Add validation attributes for better UX
        this.addValidationAttributes(field);
      });
    }

    /**
     * Create validators for a field
     */
    createFieldValidators(field) {
      const validators = [];
      const fieldType = field.type;
      const fieldName = field.name || field.id;

      // Required validation
      if (field.required || field.hasAttribute('data-required')) {
        validators.push({
          name: 'required',
          validate: (value) => value && value.trim() !== '',
          message: this.config.messages.requiredField
        });
      }

      // Email validation
      if (fieldType === 'email' || field.hasAttribute('data-validate-email')) {
        validators.push({
          name: 'email',
          validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: this.config.messages.invalidEmail
        });
      }

      // Phone validation
      if (fieldType === 'tel' || field.hasAttribute('data-validate-phone')) {
        validators.push({
          name: 'phone',
          validate: (value) => !value || /^[\+]?[\d\s\-\(\)]{10,}$/.test(value),
          message: this.config.messages.invalidPhone
        });
      }

      // Password validation
      if (fieldType === 'password') {
        const minLength = parseInt(field.getAttribute('data-min-length')) || 8;
        validators.push({
          name: 'password',
          validate: (value) => !value || value.length >= minLength,
          message: this.config.messages.passwordTooShort.replace('{minLength}', minLength)
        });
      }

      // Password confirmation
      if (field.hasAttribute('data-confirm-password')) {
        const passwordFieldName = field.getAttribute('data-confirm-password');
        validators.push({
          name: 'passwordConfirm',
          validate: (value) => {
            const passwordField = document.querySelector(`[name="${passwordFieldName}"]`);
            return !value || !passwordField || value === passwordField.value;
          },
          message: this.config.messages.passwordsNoMatch
        });
      }

      // Custom validation
      const customValidation = field.getAttribute('data-custom-validation');
      if (customValidation && window[customValidation]) {
        validators.push({
          name: 'custom',
          validate: window[customValidation],
          message: field.getAttribute('data-custom-message') || 'Invalid input'
        });
      }

      return validators;
    }

    /**
     * Add validation attributes for better UX
     */
    addValidationAttributes(field) {
      // Add ARIA attributes for accessibility
      if (field.required) {
        field.setAttribute('aria-required', 'true');
      }

      // Add invalid state initially as false
      field.setAttribute('aria-invalid', 'false');
    }

    /**
     * Set up file upload handling
     */
    setupFileUploads(form, formId) {
      const fileInputs = form.querySelectorAll('input[type="file"]');
      
      fileInputs.forEach(input => {
        // Set file constraints
        if (!input.hasAttribute('accept')) {
          input.setAttribute('accept', this.config.allowedFileTypes.join(','));
        }

        // Create file preview container
        this.createFilePreviewContainer(input);
      });
    }

    /**
     * Create file preview container
     */
    createFilePreviewContainer(fileInput) {
      const previewId = `file-preview-${fileInput.name || Date.now()}`;
      const previewContainer = document.createElement('div');
      previewContainer.id = previewId;
      previewContainer.className = 'file-preview-container';
      previewContainer.style.marginTop = '10px';

      fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);
      fileInput.setAttribute('data-preview-container', previewId);
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(formId, event) {
      const formData = this.forms.get(formId);
      if (!formData || formData.isSubmitting) return;

      const { element: form, config } = formData;

      try {
        // Mark as submitting
        formData.isSubmitting = true;
        this.setFormLoading(form, true);

        // Clear previous messages
        this.clearFormMessages(form);

        // Run before submit hook
        if (config.beforeSubmit && window[config.beforeSubmit]) {
          const continueSubmit = await window[config.beforeSubmit](form, this.getFormData(form));
          if (continueSubmit === false) {
            formData.isSubmitting = false;
            this.setFormLoading(form, false);
            return;
          }
        }

        // Validate form
        if (config.validateOnSubmit) {
          const validation = this.validateForm(formId);
          if (!validation.isValid) {
            this.showFormError(form, 'Please correct the errors below.');
            formData.isSubmitting = false;
            this.setFormLoading(form, false);
            return;
          }
        }

        // Check authentication if required
        if (config.requiresAuth && (!this.xanoClient || !this.xanoClient.isUserAuthenticated())) {
          this.showFormError(form, 'Please log in to submit this form.');
          formData.isSubmitting = false;
          this.setFormLoading(form, false);
          return;
        }

        // Collect form data
        const data = await this.collectFormData(form);

        // Submit to Xano
        const response = await this.submitToXano(config.endpoint, data, config.method);

        if (response.success) {
          this.handleFormSuccess(form, config, response.data);
        } else {
          this.handleFormError(form, config, response.error);
        }

        // Run after submit hook
        if (config.afterSubmit && window[config.afterSubmit]) {
          window[config.afterSubmit](form, response);
        }

      } catch (error) {
        this.logError('Form submission error:', error);
        this.handleFormError(form, config, this.config.messages.networkError);
      } finally {
        formData.isSubmitting = false;
        this.setFormLoading(form, false);
      }
    }

    /**
     * Collect form data including files
     */
    async collectFormData(form) {
      const formData = new FormData(form);
      const data = {};
      const files = {};

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Handle file uploads
          if (value.size > 0) {
            const uploadResult = await this.uploadFile(value);
            if (uploadResult.success) {
              files[key] = uploadResult.data;
            } else {
              throw new Error(`File upload failed: ${uploadResult.error}`);
            }
          }
        } else {
          data[key] = value;
        }
      }

      // Merge files into data
      if (Object.keys(files).length > 0) {
        data._files = files;
      }

      return data;
    }

    /**
     * Upload file to Xano
     */
    async uploadFile(file) {
      if (!this.xanoClient) {
        return { success: false, error: 'Xano client not available' };
      }

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      try {
        // Create FormData for file upload
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const response = await this.xanoClient.makeRequest('/upload', {
          method: 'POST',
          body: fileFormData,
          headers: {} // Remove Content-Type to let browser set it for FormData
        });

        return response;
      } catch (error) {
        return { success: false, error: error.message };
      }
    }

    /**
     * Validate file
     */
    validateFile(file) {
      // Check file size
      if (file.size > this.config.maxFileSize) {
        return {
          isValid: false,
          error: this.config.messages.fileTooBig.replace('{maxSize}', Math.round(this.config.maxFileSize / (1024 * 1024)))
        };
      }

      // Check file type
      const isValidType = this.config.allowedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type);
      });

      if (!isValidType) {
        return {
          isValid: false,
          error: this.config.messages.invalidFileType.replace('{allowedTypes}', this.config.allowedFileTypes.join(', '))
        };
      }

      return { isValid: true };
    }

    /**
     * Submit data to Xano
     */
    async submitToXano(endpoint, data, method = 'POST') {
      if (!this.xanoClient) {
        return { success: false, error: 'Xano client not available' };
      }

      return await this.xanoClient.makeRequest(endpoint, {
        method: method,
        body: JSON.stringify(data)
      });
    }

    /**
     * Handle form success
     */
    handleFormSuccess(form, config, data) {
      this.clearFormMessages(form);
      this.showFormSuccess(form, config.successMessage);

      // Reset form if configured
      if (config.resetOnSuccess) {
        form.reset();
      }

      // Redirect if configured
      if (config.successRedirect) {
        setTimeout(() => {
          window.location.href = config.successRedirect;
        }, 2000);
      }

      // Trigger custom event
      this.dispatchEvent('formSubmitSuccess', { form, data });
    }

    /**
     * Handle form error
     */
    handleFormError(form, config, error) {
      const message = config.errorMessage || error || this.config.messages.serverError;
      this.showFormError(form, message);

      // Trigger custom event
      this.dispatchEvent('formSubmitError', { form, error });
    }

    /**
     * Validate entire form
     */
    validateForm(formId) {
      const formData = this.forms.get(formId);
      if (!formData) return { isValid: false, errors: ['Form not found'] };

      const errors = [];
      const form = formData.element;
      const fields = form.querySelectorAll('input, textarea, select');

      fields.forEach(field => {
        const fieldValidation = this.validateField(formId, field);
        if (!fieldValidation.isValid) {
          errors.push(...fieldValidation.errors);
        }
      });

      return {
        isValid: errors.length === 0,
        errors: errors
      };
    }

    /**
     * Validate individual field
     */
    validateField(formId, field) {
      const formData = this.forms.get(formId);
      if (!formData) return { isValid: true, errors: [] };

      const fieldName = field.name || field.id;
      const validators = formData.validators.get(fieldName) || [];
      const value = field.value;
      const errors = [];

      for (const validator of validators) {
        if (!validator.validate(value)) {
          errors.push(validator.message);
        }
      }

      // Update field validation state
      this.updateFieldValidationState(field, errors.length === 0);

      return {
        isValid: errors.length === 0,
        errors: errors
      };
    }

    /**
     * Update field validation state
     */
    updateFieldValidationState(field, isValid) {
      field.setAttribute('aria-invalid', !isValid);

      if (isValid) {
        field.classList.remove('error', 'invalid');
        field.classList.add('valid');
      } else {
        field.classList.remove('valid');
        field.classList.add('error', 'invalid');
      }

      // Show/hide field error message
      this.updateFieldErrorMessage(field, isValid);
    }

    /**
     * Update field error message
     */
    updateFieldErrorMessage(field, isValid) {
      const fieldContainer = field.closest('.field-wrapper') || field.parentNode;
      let errorElement = fieldContainer.querySelector('.field-error');

      if (!isValid) {
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'field-error';
          errorElement.style.color = '#e74c3c';
          errorElement.style.fontSize = '12px';
          errorElement.style.marginTop = '5px';
          fieldContainer.appendChild(errorElement);
        }

        const formId = field.closest('[data-form-id]').getAttribute('data-form-id');
        const validation = this.validateField(formId, field);
        errorElement.textContent = validation.errors[0] || '';
        errorElement.style.display = 'block';
      } else if (errorElement) {
        errorElement.style.display = 'none';
      }
    }

    /**
     * Handle field input events
     */
    handleFieldInput(formId, event) {
      if (this.config.showRealTimeValidation) {
        clearTimeout(event.target._validationTimeout);
        event.target._validationTimeout = setTimeout(() => {
          this.validateField(formId, event.target);
        }, 300);
      }
    }

    /**
     * Handle field blur events
     */
    handleFieldBlur(formId, event) {
      this.validateField(formId, event.target);
    }

    /**
     * Handle file input changes
     */
    handleFileChange(formId, event) {
      const fileInput = event.target;
      const files = Array.from(fileInput.files);

      // Validate files
      const validationResults = files.map(file => this.validateFile(file));
      const invalidFiles = validationResults.filter(result => !result.isValid);

      if (invalidFiles.length > 0) {
        this.showFileErrors(fileInput, invalidFiles.map(result => result.error));
        return;
      }

      // Show file previews
      this.showFilePreviews(fileInput, files);
    }

    /**
     * Show file errors
     */
    showFileErrors(fileInput, errors) {
      const previewContainer = document.getElementById(fileInput.getAttribute('data-preview-container'));
      if (previewContainer) {
        previewContainer.innerHTML = errors.map(error => 
          `<div class="file-error" style="color: #e74c3c; margin: 5px 0;">${error}</div>`
        ).join('');
      }
    }

    /**
     * Show file previews
     */
    showFilePreviews(fileInput, files) {
      const previewContainer = document.getElementById(fileInput.getAttribute('data-preview-container'));
      if (!previewContainer) return;

      previewContainer.innerHTML = '';

      files.forEach((file, index) => {
        const filePreview = document.createElement('div');
        filePreview.className = 'file-preview-item';
        filePreview.style.cssText = 'display: flex; align-items: center; margin: 5px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;';

        let preview = '';
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = filePreview.querySelector('.file-thumbnail');
            if (img) img.src = e.target.result;
          };
          reader.readAsDataURL(file);
          
          preview = '<img class="file-thumbnail" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;" />';
        } else {
          preview = '<div class="file-icon" style="width: 40px; height: 40px; background: #f0f0f0; margin-right: 10px; display: flex; align-items: center; justify-content: center;">📄</div>';
        }

        filePreview.innerHTML = `
          ${preview}
          <div class="file-info" style="flex: 1;">
            <div class="file-name" style="font-weight: bold;">${file.name}</div>
            <div class="file-size" style="font-size: 12px; color: #666;">
              ${this.formatFileSize(file.size)}
            </div>
          </div>
          <button type="button" class="remove-file" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Remove</button>
        `;

        // Add remove functionality
        filePreview.querySelector('.remove-file').addEventListener('click', () => {
          this.removeFileFromInput(fileInput, index);
        });

        previewContainer.appendChild(filePreview);
      });
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Remove file from input
     */
    removeFileFromInput(fileInput, index) {
      const dt = new DataTransfer();
      const files = Array.from(fileInput.files);
      
      files.forEach((file, i) => {
        if (i !== index) {
          dt.items.add(file);
        }
      });
      
      fileInput.files = dt.files;
      this.showFilePreviews(fileInput, Array.from(fileInput.files));
    }

    /**
     * Set form loading state
     */
    setFormLoading(form, isLoading) {
      const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');

      if (isLoading) {
        form.classList.add('is-loading');
        if (submitButton) {
          submitButton._originalText = submitButton.textContent;
          submitButton.textContent = this.config.submitButtonText.loading;
          submitButton.disabled = true;
        }
      } else {
        form.classList.remove('is-loading');
        if (submitButton) {
          submitButton.textContent = submitButton._originalText || this.config.submitButtonText.default;
          submitButton.disabled = false;
        }
      }
    }

    /**
     * Show form success message
     */
    showFormSuccess(form, message) {
      const successElement = form.querySelector('.form-success, [data-form-success]');
      
      if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
      } else {
        this.createMessage(form, message, 'success');
      }
    }

    /**
     * Show form error message
     */
    showFormError(form, message) {
      const errorElement = form.querySelector('.form-error, [data-form-error]');
      
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      } else {
        this.createMessage(form, message, 'error');
      }
    }

    /**
     * Create message element
     */
    createMessage(form, message, type) {
      const messageElement = document.createElement('div');
      messageElement.className = `form-${type}`;
      messageElement.style.cssText = `
        color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        background: ${type === 'success' ? '#d5f4e6' : '#fdf2f2'};
        border: 1px solid ${type === 'success' ? '#27ae60' : '#e74c3c'};
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
      `;
      messageElement.textContent = message;
      
      // Insert at the top of the form
      form.insertBefore(messageElement, form.firstChild);
    }

    /**
     * Clear form messages
     */
    clearFormMessages(form) {
      const messages = form.querySelectorAll('.form-error, .form-success, [data-form-error], [data-form-success]');
      messages.forEach(msg => msg.style.display = 'none');
    }

    /**
     * Get form data as object
     */
    getFormData(form) {
      const formData = new FormData(form);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    }

    /**
     * Map Webflow form names to Xano endpoints
     */
    mapWebflowFormToEndpoint(formName) {
      const mapping = {
        'contact': '/contact',
        'newsletter': '/newsletter/subscribe',
        'registration': '/auth/register',
        'login': '/auth/login',
        'feedback': '/feedback',
        'support': '/support/ticket'
      };

      return mapping[formName.toLowerCase()] || null;
    }

    /**
     * Generate unique form ID
     */
    generateFormId(form) {
      return form.id || form.getAttribute('data-name') || `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail = {}) {
      const event = new CustomEvent(`webflow:${eventName}`, { detail });
      document.dispatchEvent(event);
    }

    /**
     * Logging utilities
     */
    log(...args) {
      if (window.WebflowXanoConfig && window.WebflowXanoConfig.isDebug()) {
        console.log('[WebflowFormHandler]', ...args);
      }
    }

    logError(...args) {
      console.error('[WebflowFormHandler Error]', ...args);
    }

    /**
     * Public API methods
     */

    // Manual form setup
    setupForm(formElement) {
      this.enhanceForm(formElement);
    }

    // Submit form programmatically
    async submitForm(formId) {
      return this.handleFormSubmit(formId);
    }

    // Reset form
    resetForm(formId) {
      const formData = this.forms.get(formId);
      if (formData) {
        formData.element.reset();
        this.clearFormMessages(formData.element);
      }
    }

    // Get form validation state
    getFormValidation(formId) {
      return this.validateForm(formId);
    }

    // Add custom validator
    addValidator(formId, fieldName, validator) {
      const formData = this.forms.get(formId);
      if (formData) {
        const fieldValidators = formData.validators.get(fieldName) || [];
        fieldValidators.push(validator);
        formData.validators.set(fieldName, fieldValidators);
      }
    }
  }

  // Create global instance
  window.WebflowFormHandler = WebflowFormHandler;
  window.webflowFormHandler = new WebflowFormHandler();

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebflowFormHandler;
  }

})(typeof window !== 'undefined' ? window : global);