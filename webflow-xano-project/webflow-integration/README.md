# Webflow + Xano Integration

Complete integration solution for connecting Webflow with Xano backend services.

## 🚀 Quick Start

### 1. Include Required Scripts

Add the following scripts to your Webflow site's custom code section (in order):

**In the `<head>` section:**
```html
<!-- Environment Configuration -->
<script src="https://your-domain.com/webflow-integration/config/environment-config.js"></script>

<!-- Xano API Client -->
<script src="https://your-domain.com/webflow-integration/js/xano-client.js"></script>
```

**Before the closing `</body>` tag:**
```html
<!-- Form Handler -->
<script src="https://your-domain.com/webflow-integration/forms/form-handler.js"></script>

<!-- Content Loader -->
<script src="https://your-domain.com/webflow-integration/content/dynamic-content-loader.js"></script>

<!-- Error Handler -->
<script src="https://your-domain.com/webflow-integration/utils/error-handler.js"></script>
```

### 2. Configure Environment Settings

Update the environment configuration in `config/environment-config.js`:

```javascript
// Example configuration
const configs = {
  development: {
    xanoBaseUrl: 'https://your-dev-workspace.xano.io/api:v1',
    xanoWorkspaceId: 'dev-workspace-id',
    debugMode: true
  },
  production: {
    xanoBaseUrl: 'https://your-prod-workspace.xano.io/api:v1',
    xanoWorkspaceId: 'prod-workspace-id',
    debugMode: false
  }
};
```

### 3. Start Using Data Attributes

Add data attributes to your Webflow elements to enable integration:

**Forms:**
```html
<form data-xano-form="/contact" data-xano-method="POST">
  <input name="name" required>
  <input name="email" type="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send Message</button>
</form>
```

**Dynamic Content:**
```html
<div data-xano-content="/blog/posts" data-xano-template="card"></div>
```

## 📚 Core Features

### 🔧 Environment Configuration
Automatic environment detection and configuration management.

- **Development**: `localhost`, `127.0.0.1`, or `?dev=true`
- **Staging**: `webflow.io`, `staging` in hostname, or `?env=staging`
- **Production**: All other domains

### 🔐 Authentication
Built-in user authentication with automatic token management.

```javascript
// Login user
await xanoClient.login({ email: 'user@example.com', password: 'password' });

// Check auth status
if (xanoClient.isUserAuthenticated()) {
  // User is logged in
}

// Logout
await xanoClient.logout();
```

### 📝 Form Handling
Enhanced form processing with validation, file uploads, and error handling.

#### Basic Form Setup
```html
<form data-xano-form="/contact" data-xano-method="POST" data-reset-on-success>
  <input name="name" required>
  <input name="email" type="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
  
  <!-- Optional message containers -->
  <div class="form-success" style="display: none;"></div>
  <div class="form-error" style="display: none;"></div>
</form>
```

#### Advanced Form Features
```html
<form 
  data-xano-form="/user/profile" 
  data-xano-method="PUT" 
  data-xano-auth
  data-success-message="Profile updated successfully!"
  data-success-redirect="/dashboard"
  data-enable-files>
  
  <input name="name" required>
  <input name="avatar" type="file" accept="image/*">
  
  <!-- Custom validation -->
  <input name="username" data-custom-validation="validateUsername">
  
  <!-- Password confirmation -->
  <input name="password" type="password" data-min-length="8">
  <input name="confirmPassword" type="password" data-confirm-password="password">
  
  <button type="submit">Update Profile</button>
</form>
```

#### Form Validation
Built-in validation rules:
- `required` - Field is required
- `type="email"` - Email validation
- `type="tel"` - Phone validation  
- `data-min-length="8"` - Minimum length
- `data-confirm-password="fieldName"` - Password confirmation
- `data-custom-validation="functionName"` - Custom validation function

### 📄 Dynamic Content Loading
Load and display data from Xano with caching and templates.

#### Basic Content Loading
```html
<div data-xano-content="/blog/posts"></div>
```

#### Advanced Content Loading
```html
<div 
  data-xano-content="/products" 
  data-xano-template="card"
  data-xano-fallback="No products available"
  data-limit="6"
  data-sort="created_at:desc"
  data-filter="status:eq:published"
  data-lazy-load
  data-cache-ttl="300000">
</div>
```

#### Content Attributes
- `data-xano-content="/endpoint"` - API endpoint
- `data-xano-template="templateName"` - Template name
- `data-xano-auth` - Requires authentication
- `data-lazy-load` - Load when visible
- `data-real-time` - Auto-refresh content
- `data-limit="10"` - Limit results
- `data-offset="0"` - Skip results
- `data-sort="field:asc"` - Sort results
- `data-filter="field:eq:value"` - Filter results
- `data-cache-ttl="300000"` - Cache timeout (ms)

### 🎨 Content Templates

#### Built-in Templates
- `card` - Card layout with image, title, description
- `list` - Simple list format
- `table` - Tabular data display
- `gallery` - Image gallery layout

#### Custom Templates
```javascript
// Register custom template
webflowContentLoader.registerTemplate('product', (data) => {
  return data.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join('');
});
```

### ⚠️ Error Handling
Comprehensive error handling with fallbacks and retry mechanisms.

#### Features
- Automatic retry for failed requests
- Network disconnect/reconnect handling
- Fallback content display
- Error toast notifications
- Error reporting and analytics

#### Error Fallback Content
```html
<!-- Content with fallback -->
<div 
  data-xano-content="/api/data"
  data-xano-fallback="Content temporarily unavailable">
</div>

<!-- Offline alternatives -->
<div class="online-content" data-requires-network>
  Online-only content
</div>
<div class="offline-content" data-offline-alternative style="display: none;">
  Offline fallback content
</div>
```

## 🔄 API Reference

### Global Objects

#### `xanoClient`
Main API client for Xano integration.

```javascript
// Make API requests
const response = await xanoClient.makeRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Convenience methods
await xanoClient.getData('/users');
await xanoClient.postData('/users', userData);
await xanoClient.updateData('/users/123', userData);
await xanoClient.deleteData('/users/123');
```

#### `webflowFormHandler`
Form processing and validation.

```javascript
// Setup custom form
webflowFormHandler.setupForm(formElement);

// Submit form programmatically
await webflowFormHandler.submitForm('form-id');

// Add custom validator
webflowFormHandler.addValidator('form-id', 'fieldName', {
  name: 'custom',
  validate: (value) => value.length > 5,
  message: 'Must be longer than 5 characters'
});
```

#### `webflowContentLoader`
Dynamic content loading and management.

```javascript
// Reload specific content
await webflowContentLoader.reloadContent('[data-xano-content]');

// Register template
webflowContentLoader.registerTemplate('templateName', (data) => {
  return `<div>${data.title}</div>`;
});

// Get content data
const contentData = webflowContentLoader.getContentData('#my-content');
```

#### `webflowErrorHandler`
Error handling and recovery.

```javascript
// Report custom error
webflowErrorHandler.reportError(error, { severity: 'warning' });

// Show error message
webflowErrorHandler.showError('Something went wrong', 'error');

// Get error statistics
const stats = webflowErrorHandler.getErrorStats();
```

### Configuration

#### Environment Configuration
```javascript
// Get current environment
const env = WebflowXanoConfig.getEnvironment(); // 'development', 'staging', 'production'

// Get configuration
const config = WebflowXanoConfig.getConfig();

// Get API URLs
const { xano, webflow } = WebflowXanoConfig.getApiUrls();

// Check environment
if (WebflowXanoConfig.isDevelopment()) {
  // Development-specific code
}
```

## 🎯 Use Cases & Examples

### User Registration Form
```html
<form data-xano-form="/auth/register" data-xano-method="POST" data-reset-on-success>
  <input name="name" required placeholder="Full Name">
  <input name="email" type="email" required placeholder="Email">
  <input name="password" type="password" data-min-length="8" required placeholder="Password">
  <input name="confirmPassword" type="password" data-confirm-password="password" required placeholder="Confirm Password">
  <button type="submit">Create Account</button>
</form>
```

### Product Catalog
```html
<div 
  data-xano-content="/products" 
  data-xano-template="product-grid"
  data-limit="12"
  data-sort="featured:desc,created_at:desc">
</div>

<script>
// Custom product template
webflowContentLoader.registerTemplate('product-grid', (products) => {
  return `
    <div class="product-grid">
      ${products.map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">$${product.price}</p>
          <p class="description">${product.description}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `).join('')}
    </div>
  `;
});
</script>
```

### User Dashboard with Authentication
```html
<div data-xano-content="/user/dashboard" data-xano-auth data-xano-template="dashboard">
</div>

<script>
// Check if user is authenticated
document.addEventListener('DOMContentLoaded', () => {
  if (!xanoClient.isUserAuthenticated()) {
    window.location.href = '/login';
  }
});
</script>
```

### Blog with Real-time Updates
```html
<div 
  data-xano-content="/blog/posts" 
  data-xano-template="blog-list"
  data-real-time
  data-limit="5"
  data-sort="published_at:desc"
  data-filter="status:eq:published">
</div>
```

### File Upload Form
```html
<form data-xano-form="/documents" data-enable-files data-xano-auth>
  <input name="title" required placeholder="Document Title">
  <input name="document" type="file" accept=".pdf,.doc,.docx" required>
  <textarea name="description" placeholder="Description"></textarea>
  <button type="submit">Upload Document</button>
</form>
```

## 🔍 Debugging & Development

### Debug Mode
Enable debug mode for detailed logging:
```javascript
// In development, debug mode is automatic
// For production debugging:
WebflowXanoConfig.setTestConfig({ debugMode: true });
```

### Testing Error Handling
```javascript
// Test error scenarios (development only)
webflowErrorHandler.testErrorHandling();
```

### Network Status Testing
```javascript
// Simulate offline/online states
window.dispatchEvent(new Event('offline'));
window.dispatchEvent(new Event('online'));
```

## 📊 Performance Optimization

### Caching
- Content caching with TTL
- Automatic cache invalidation
- Manual cache management

### Lazy Loading
- Intersection Observer API
- Scroll-based fallback
- Performance monitoring

### Batch Requests
- Automatic request batching
- Configurable batch delays
- Connection pooling

## 🔒 Security Features

### Input Validation
- XSS prevention
- Input sanitization
- File type validation

### Authentication
- Secure token storage
- Automatic token refresh
- Session management

### Error Handling
- Safe error messages
- No sensitive data exposure
- Secure fallback content

## 🚀 Deployment

### Development
1. Set up local development environment
2. Configure development Xano workspace
3. Enable debug mode and verbose logging

### Staging
1. Deploy to staging environment
2. Test with staging Xano workspace
3. Validate all integrations

### Production
1. Deploy to production
2. Monitor error rates and performance
3. Set up error reporting endpoint

## 📈 Monitoring & Analytics

### Error Tracking
- Automatic error reporting
- Error statistics and trends
- Performance monitoring

### Usage Analytics
- API request tracking
- Form submission analytics
- Content engagement metrics

## 🆘 Troubleshooting

### Common Issues

**Forms not submitting:**
- Check `data-xano-form` attribute
- Verify endpoint exists in Xano
- Check network connectivity
- Review browser console for errors

**Content not loading:**
- Verify API endpoint
- Check authentication requirements
- Review CORS settings
- Check cache settings

**Authentication issues:**
- Verify Xano workspace configuration
- Check token storage (localStorage)
- Review authentication endpoints
- Check network connectivity

### Debug Tools
```javascript
// Check configuration
console.log(WebflowXanoConfig.getConfig());

// Check authentication
console.log(xanoClient.isUserAuthenticated());

// Check error stats
console.log(webflowErrorHandler.getErrorStats());

// Check cache status
console.log(webflowContentLoader.getCacheStats());
```

## 📝 License

This integration code is provided as-is for educational and development purposes. Modify as needed for your specific implementation.

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Test with debug mode enabled
4. Check network requests in browser dev tools

---

*Built for seamless Webflow + Xano integration* 🚀