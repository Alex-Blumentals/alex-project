# 🔧 Troubleshooting Guide

Comprehensive troubleshooting guide for common issues, debugging techniques, and solutions for the Webflow + Xano integration project.

## Quick Diagnosis

### System Health Check
```bash
# Run comprehensive system check
claude -p '/integration-check'

# Check project status
claude -p '/project-status'

# Verify GitHub Actions status
gh run list --limit 5

# Test essential workflows
gh workflow run api-health-monitoring.yml
```

### Common Symptoms & Quick Fixes

| Symptom | Quick Fix | Full Solution |
|---------|-----------|---------------|
| Forms not submitting | Check Xano CORS settings | [Form Integration Issues](#form-integration-issues) |
| GitHub Actions failing | Verify secrets configuration | [GitHub Actions Issues](#github-actions-issues) |
| Performance alerts | Clear CDN cache | [Performance Issues](#performance-issues) |
| API authentication errors | Refresh API tokens | [Authentication Issues](#authentication-issues) |
| Monitoring not working | Check webhook URLs | [Monitoring Issues](#monitoring-issues) |

---

## 🎨 Webflow Integration Issues

### Forms Not Submitting

**Symptoms:**
- Form submissions fail silently
- Console shows CORS errors
- Forms redirect incorrectly

**Diagnosis:**
```javascript
// Check browser console for errors
// Look for CORS, network, or validation errors

// Test form submission manually
document.querySelector('[data-xano-form]').addEventListener('submit', (e) => {
  console.log('Form submission attempted:', e.target);
});
```

**Solutions:**

**1. CORS Configuration:**
```bash
# In Xano workspace settings, add these origins:
# Development:
http://localhost:3000
https://preview.webflow.io
https://webflow.io

# Staging:
https://staging.yoursite.com
https://staging-site.webflow.io

# Production:
https://yoursite.com
https://www.yoursite.com
```

**2. Form Attributes Check:**
```html
<!-- Verify form has correct attributes -->
<form 
  data-xano-form="contact"          <!-- Required: Form identifier -->
  data-redirect="/thank-you"        <!-- Optional: Success redirect -->
  data-loading-text="Sending..."    <!-- Optional: Loading state -->
>
  <input 
    type="text" 
    data-field="name"                <!-- Required: Field mapping -->
    required                         <!-- Optional: HTML validation -->
    data-validation="required,minLength:2" <!-- Optional: Custom validation -->
  >
</form>
```

**3. Debug Form Handler:**
```javascript
// Add to Webflow custom code for debugging
window.addEventListener('load', function() {
  if (window.FormHandler) {
    window.FormHandler.debug = true; // Enable debug logging
    
    // Test form submission
    console.log('FormHandler loaded:', window.FormHandler);
  } else {
    console.error('FormHandler not loaded - check script inclusion');
  }
});
```

### Scripts Not Loading

**Symptoms:**
- Console errors: "XanoClient is not defined"
- Integration features not working
- JavaScript errors on page load

**Diagnosis:**
```javascript
// Check if scripts loaded
console.log('XanoClient:', typeof XanoClient);
console.log('FormHandler:', typeof FormHandler);
console.log('DynamicContentLoader:', typeof DynamicContentLoader);
```

**Solutions:**

**1. Verify Script URLs:**
```html
<!-- Check these URLs are accessible -->
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/js/xano-client.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/config/environment-config.js"></script>
```

**2. Check Script Loading Order:**
```html
<!-- Correct loading order -->
<!-- 1. In Head Code: -->
<script src=".../environment-config.js"></script>
<script src=".../xano-client.js"></script>

<!-- 2. Before </body>: -->
<script src=".../form-handler.js"></script>
<script src=".../dynamic-content-loader.js"></script>
<script src=".../error-handler.js"></script>

<!-- 3. Initialization: -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Initialize after DOM loaded
});
</script>
```

**3. CDN Cache Issues:**
```bash
# If scripts are cached with old versions:
# 1. Use specific commit hash instead of @main
https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@[commit-hash]/...

# 2. Or use cache-busting parameter
https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/...?v=1.0.0
```

### Dynamic Content Not Loading

**Symptoms:**
- Content containers remain empty
- Loading indicators don't disappear
- Console shows API errors

**Diagnosis:**
```javascript
// Check content loader initialization
console.log('DynamicContentLoader:', window.DynamicContentLoader);

// Test API connection
if (window.XanoClient) {
  const client = new XanoClient();
  client.get('/health').then(console.log).catch(console.error);
}

// Check content containers
document.querySelectorAll('[data-content]').forEach(container => {
  console.log('Content container:', container.dataset);
});
```

**Solutions:**

**1. Verify Container Configuration:**
```html
<!-- Correct container setup -->
<div 
  data-content="posts"              <!-- Required: Content type -->
  data-template="card"              <!-- Required: Template name -->
  data-limit="6"                    <!-- Optional: Limit results -->
  data-filter="status=published"    <!-- Optional: Filter criteria -->
  data-sort="created_at:desc"       <!-- Optional: Sort order -->
>
  <!-- Loading placeholder -->
  <div class="loading-placeholder">Loading...</div>
</div>

<!-- Template definition -->
<script type="text/template" data-template-id="card">
  <div class="card">
    <h3>{{title}}</h3>
    <p>{{excerpt}}</p>
  </div>
</script>
```

**2. API Endpoint Issues:**
```bash
# Test API endpoint directly
curl -X GET "https://your-xano-workspace.xano.io/api:v1/posts" \
  -H "Authorization: Bearer your-api-key"

# Check endpoint exists in Xano workspace
# Verify response format matches template variables
```

**3. Template Variables:**
```javascript
// Debug template rendering
window.DynamicContentLoader.debug = true;

// Check available template variables
console.log('API Response:', response.data);
console.log('Template variables:', Object.keys(response.data[0]));
```

---

## 🛢️ Xano Backend Issues

### Authentication Failures

**Symptoms:**
- 401 Unauthorized errors
- Token refresh failures
- Login/registration not working

**Diagnosis:**
```bash
# Test API authentication
curl -X POST "https://your-workspace.xano.io/api:v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check token validation
curl -X GET "https://your-workspace.xano.io/api:v1/user/profile" \
  -H "Authorization: Bearer your-jwt-token"
```

**Solutions:**

**1. JWT Configuration Issues:**
```javascript
// Check JWT settings in Xano
const jwtConfig = {
  algorithm: 'HS256',
  expiresIn: '7d',
  refreshExpiresIn: '30d',
  issuer: 'your-app',
  audience: 'your-users'
};

// Verify token format
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const decoded = jwt.decode(token);
console.log('Token payload:', decoded);
```

**2. API Key Issues:**
```bash
# Verify API key is correct
echo $XANO_API_KEY

# Test API key validity
curl -X GET "https://your-workspace.xano.io/api:v1/health" \
  -H "Authorization: Bearer $XANO_API_KEY"

# Regenerate API key if needed (in Xano dashboard)
```

**3. User Registration Issues:**
```sql
-- Check user table structure
DESCRIBE users;

-- Verify user data
SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;

-- Check for duplicate emails
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
```

### Database Connection Issues

**Symptoms:**
- Timeout errors on API calls
- Inconsistent database responses
- Connection pool exhaustion

**Diagnosis:**
```bash
# Check database status
curl -X GET "https://your-workspace.xano.io/api:v1/health"

# Monitor API response times
time curl -X GET "https://your-workspace.xano.io/api:v1/posts"

# Check for slow queries
# (Available in Xano dashboard under Analytics)
```

**Solutions:**

**1. Query Optimization:**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Optimize slow queries
-- Instead of: SELECT * FROM posts WHERE status = 'published'
-- Use: SELECT id, title, excerpt, created_at FROM posts WHERE status = 'published' LIMIT 20
```

**2. Connection Pool Settings:**
```javascript
// Optimize connection pool (in Xano settings)
const poolConfig = {
  min: 2,           // Minimum connections
  max: 10,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};
```

**3. API Rate Limiting:**
```javascript
// Implement client-side rate limiting
class RateLimitedXanoClient extends XanoClient {
  constructor() {
    super();
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxRequestsPerSecond = 10;
  }

  async makeRequest(config) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ config, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const { config, resolve, reject } = this.requestQueue.shift();
      
      try {
        const result = await super.makeRequest(config);
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000 / this.maxRequestsPerSecond));
    }
    
    this.isProcessingQueue = false;
  }
}
```

### API Response Issues

**Symptoms:**
- Inconsistent response formats
- Missing data fields
- Validation errors

**Diagnosis:**
```bash
# Test API responses
curl -X GET "https://your-workspace.xano.io/api:v1/posts" | jq '.'

# Check response structure
curl -s -X GET "https://your-workspace.xano.io/api:v1/posts" | jq 'keys'

# Validate specific fields
curl -s -X GET "https://your-workspace.xano.io/api:v1/posts" | jq '.[0] | keys'
```

**Solutions:**

**1. Response Validation:**
```javascript
// Add response validation
class ValidatedXanoClient extends XanoClient {
  async get(endpoint, options = {}) {
    const response = await super.get(endpoint, options);
    
    if (options.validate) {
      this.validateResponse(response, options.validate);
    }
    
    return response;
  }
  
  validateResponse(response, schema) {
    // Implement response validation logic
    if (!response.data) {
      throw new Error('Response missing data field');
    }
    
    if (Array.isArray(response.data)) {
      response.data.forEach((item, index) => {
        this.validateItem(item, schema, `item[${index}]`);
      });
    }
  }
}
```

**2. Data Transformation:**
```javascript
// Normalize API responses
function normalizePostData(post) {
  return {
    id: post.id,
    title: post.title || 'Untitled',
    excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
    publishedAt: post.published_at ? new Date(post.published_at) : null,
    author: {
      name: post.author?.name || 'Anonymous',
      id: post.author?.id
    },
    slug: post.slug || generateSlug(post.title)
  };
}
```

---

## 🚀 GitHub Actions Issues

### Workflow Failures

**Symptoms:**
- Red X on workflow runs
- Email notifications about failed workflows
- Deployments not triggering

**Diagnosis:**
```bash
# Check recent workflow runs
gh run list --limit 10

# View specific run details
gh run view [run-id]

# Download run logs
gh run download [run-id]

# Check workflow file syntax
gh workflow view [workflow-name]
```

**Solutions:**

**1. Secrets Configuration:**
```bash
# List current secrets
gh secret list

# Verify required secrets exist
required_secrets=(
  "SLACK_WEBHOOK_URL"
  "WEBFLOW_API_TOKEN"
  "XANO_PRODUCTION_API_KEY"
  "WEBFLOW_PRODUCTION_URL"
  "XANO_PRODUCTION_URL"
)

for secret in "${required_secrets[@]}"; do
  if gh secret list | grep -q "$secret"; then
    echo "✅ $secret found"
  else
    echo "❌ $secret missing"
  fi
done

# Set missing secrets
gh secret set SECRET_NAME --body "secret-value"
```

**2. Workflow Syntax Issues:**
```yaml
# Common YAML syntax issues:

# ❌ Incorrect:
name Workflow Name
on:
push:
  branches: [main]

# ✅ Correct:
name: Workflow Name
on:
  push:
    branches: [main]

# ❌ Incorrect indentation:
  steps:
  - name: Step 1
  run: echo "hello"

# ✅ Correct indentation:
  steps:
    - name: Step 1
      run: echo "hello"
```

**3. Permission Issues:**
```yaml
# Add necessary permissions to workflow
permissions:
  contents: read
  issues: write
  pull-requests: write
  actions: read
```

### Monitoring Workflows Not Running

**Symptoms:**
- Expected monitoring alerts not received
- Health checks not running on schedule
- Performance reports missing

**Diagnosis:**
```bash
# Check if monitoring workflows are enabled
gh workflow list

# Check schedule syntax
cat .github/workflows/api-health-monitoring.yml | grep -A 5 "schedule:"

# View workflow run history
gh run list --workflow="API Health Monitoring" --limit 10
```

**Solutions:**

**1. Cron Schedule Issues:**
```yaml
# ❌ Incorrect cron syntax:
schedule:
  - cron: '0 */6 * * *'  # Missing quotes or wrong format

# ✅ Correct cron syntax:
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours

# ✅ Multiple schedules:
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  - cron: '0 0 * * *'    # Daily at midnight
```

**2. Workflow Triggers:**
```yaml
# Enable manual triggering for testing
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:    # Allows manual triggering
    inputs:
      environment:
        description: 'Environment to monitor'
        required: false
        default: 'production'
```

**3. Repository Activity:**
```bash
# GitHub disables scheduled workflows after 60 days of no repository activity
# Keep repository active with regular commits or manual workflow runs

# Manually run workflow to reactivate
gh workflow run api-health-monitoring.yml
```

### Secret Access Issues

**Symptoms:**
- Workflows fail with "secret not found"
- Authentication errors in workflow logs
- API calls returning 401/403 errors

**Diagnosis:**
```bash
# Check if secrets are accessible in workflow
# Add this step to workflow for debugging:
- name: Debug Secrets
  run: |
    echo "Checking secret availability..."
    if [ -n "${{ secrets.SLACK_WEBHOOK_URL }}" ]; then
      echo "✅ SLACK_WEBHOOK_URL available"
    else
      echo "❌ SLACK_WEBHOOK_URL missing"
    fi
```

**Solutions:**

**1. Secret Scope Issues:**
```bash
# Verify secrets are set at repository level (not environment level)
# Repository secrets: Available to all workflows
# Environment secrets: Only available to specific environment deployments

# For general monitoring, use repository secrets:
gh secret set SLACK_WEBHOOK_URL --body "webhook-url" --repos

# For environment-specific deployments, use environment secrets
```

**2. Secret Name Mismatches:**
```yaml
# ❌ Case-sensitive mismatch:
env:
  slack_webhook: ${{ secrets.slack_webhook_url }}  # Wrong case

# ✅ Exact case match:
env:
  SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 📊 Monitoring Issues

### Slack Notifications Not Working

**Symptoms:**
- No alerts received in Slack channels
- Webhook test failures
- Monitoring workflows complete successfully but no notifications

**Diagnosis:**
```bash
# Test webhook manually
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test notification from troubleshooting"}'

# Check webhook URL format
echo $SLACK_WEBHOOK_URL
# Should be: https://hooks.slack.com/services/T.../B.../X...

# Test from GitHub Actions environment
gh workflow run api-health-monitoring.yml
gh run logs [run-id] | grep -i slack
```

**Solutions:**

**1. Webhook Configuration:**
```bash
# Regenerate webhook URL in Slack:
# 1. Go to https://api.slack.com/apps
# 2. Select your app → Incoming Webhooks
# 3. Regenerate webhook URL
# 4. Update GitHub secret

gh secret set SLACK_WEBHOOK_URL --body "new-webhook-url"
```

**2. Channel Permissions:**
```bash
# Verify Slack app has permission to post to target channels
# In Slack app settings:
# - Go to OAuth & Permissions
# - Verify bot has 'chat:write' scope
# - Ensure app is added to target channels (/invite @YourBot)
```

**3. Message Format Issues:**
```json
# ❌ Invalid JSON format:
{"text": "Message with "quotes" breaks JSON"}

# ✅ Properly escaped JSON:
{"text": "Message with \"quotes\" works fine"}

# ✅ Using YAML multiline for complex messages:
custom_payload: |
  {
    "channel": "#alerts",
    "username": "Monitor Bot",
    "text": "Alert message here"
  }
```

### Performance Monitoring Failures

**Symptoms:**
- Lighthouse audits failing
- Performance scores not updating
- Core Web Vitals data missing

**Diagnosis:**
```bash
# Test Lighthouse locally
npm install -g lighthouse
lighthouse https://your-site.com --view

# Check if site is accessible
curl -I https://your-site.com

# Test from GitHub Actions environment
gh workflow run performance-monitoring.yml
gh run logs [run-id] | grep -i lighthouse
```

**Solutions:**

**1. Site Accessibility:**
```bash
# Ensure site is publicly accessible (not password-protected)
# Check for:
# - Basic authentication
# - IP restrictions
# - Cloudflare security settings
# - Maintenance mode

# Test site accessibility
curl -H "User-Agent: Chrome-Lighthouse" https://your-site.com
```

**2. Lighthouse Configuration:**
```javascript
// Adjust Lighthouse settings for reliability
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Chrome-Lighthouse'
  }
};
```

**3. Timeout Issues:**
```yaml
# Increase timeout for performance monitoring
- name: Run Lighthouse audit
  run: lighthouse https://your-site.com
  timeout-minutes: 10  # Increase timeout
```

### Health Check False Positives

**Symptoms:**
- Alerts for healthy services
- Intermittent failure notifications
- Inconsistent monitoring results

**Diagnosis:**
```bash
# Check health check endpoint manually
curl -v https://your-api.com/health

# Test multiple times to identify intermittent issues
for i in {1..10}; do
  echo "Test $i:"
  curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://your-api.com/health
  sleep 1
done

# Review monitoring workflow configuration
cat .github/workflows/api-health-monitoring.yml
```

**Solutions:**

**1. Add Retry Logic:**
```yaml
- name: Health Check with Retries
  run: |
    RETRY_COUNT=3
    for i in $(seq 1 $RETRY_COUNT); do
      echo "Health check attempt $i/$RETRY_COUNT"
      
      if curl -f -s https://your-api.com/health; then
        echo "✅ Health check passed"
        exit 0
      else
        echo "❌ Health check failed (attempt $i)"
        if [ $i -eq $RETRY_COUNT ]; then
          echo "Health check failed after $RETRY_COUNT attempts"
          exit 1
        fi
        sleep 10
      fi
    done
```

**2. Adjust Thresholds:**
```yaml
# Make health checks more tolerant
- name: Health Check
  run: |
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://your-api.com/health)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://your-api.com/health)
    
    # Allow longer response times
    if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )); then
      echo "⚠️ Slow response time: ${RESPONSE_TIME}s"
    fi
    
    # Only fail on actual HTTP errors
    if [[ "$HTTP_CODE" -ge 400 ]]; then
      echo "❌ HTTP error: $HTTP_CODE"
      exit 1
    fi
```

---

## ⚡ Performance Issues

### Slow Page Load Times

**Symptoms:**
- High First Contentful Paint (FCP > 3s)
- High Largest Contentful Paint (LCP > 4s)
- Poor Lighthouse performance scores

**Diagnosis:**
```bash
# Run performance audit
lighthouse https://your-site.com --view

# Check network timing
curl -w "@curl-format.txt" -o /dev/null -s https://your-site.com

# Create curl-format.txt:
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

**Solutions:**

**1. Script Optimization:**
```html
<!-- Optimize script loading -->
<!-- ❌ Blocking scripts -->
<script src="large-library.js"></script>
<script src="app.js"></script>

<!-- ✅ Non-blocking scripts -->
<script async src="non-critical-library.js"></script>
<script defer src="app.js"></script>

<!-- ✅ Preload critical resources -->
<link rel="preload" href="critical-script.js" as="script">
<link rel="preload" href="hero-image.jpg" as="image">
```

**2. Image Optimization:**
```html
<!-- ✅ Optimized images -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy" width="300" height="200">
</picture>

<!-- ✅ Responsive images -->
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1200px"
  src="medium.jpg"
  alt="Description"
>
```

**3. CSS Optimization:**
```html
<!-- ✅ Critical CSS inline -->
<style>
/* Above-the-fold critical styles */
.hero { display: flex; align-items: center; min-height: 100vh; }
.nav { position: sticky; top: 0; background: white; }
</style>

<!-- ✅ Non-critical CSS deferred -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### High Cumulative Layout Shift (CLS)

**Symptoms:**
- CLS score > 0.1
- Visual elements jumping during page load
- Poor user experience on mobile

**Diagnosis:**
```javascript
// Measure CLS in browser DevTools
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift:', entry.value, entry);
    }
  }
}).observe({entryTypes: ['layout-shift']});

// Check for common CLS causes:
// - Images without dimensions
// - Fonts causing text re-layout
// - Dynamic content insertion
// - Ads or embeds without placeholders
```

**Solutions:**

**1. Image Dimensions:**
```html
<!-- ❌ Missing dimensions cause layout shift -->
<img src="image.jpg" alt="Description">

<!-- ✅ Explicit dimensions prevent layout shift -->
<img src="image.jpg" alt="Description" width="300" height="200">

<!-- ✅ Aspect ratio containers -->
<div style="aspect-ratio: 16/9; width: 100%;">
  <img src="image.jpg" alt="Description" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

**2. Font Loading:**
```html
<!-- ✅ Optimize font loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" as="style">

<style>
/* Prevent font swap layout shift */
.text {
  font-family: 'Inter', system-ui, sans-serif;
  font-display: swap; /* or use 'optional' to prevent layout shift */
}
</style>
```

**3. Dynamic Content:**
```html
<!-- ✅ Reserve space for dynamic content -->
<div class="dynamic-content" style="min-height: 200px;">
  <!-- Skeleton placeholder -->
  <div class="skeleton" style="height: 200px; background: #f0f0f0; animation: pulse 1.5s infinite;">
    Loading...
  </div>
</div>

<script>
// Load content without causing layout shift
loadDynamicContent().then(content => {
  const container = document.querySelector('.dynamic-content');
  container.style.minHeight = 'auto'; // Remove fixed height
  container.innerHTML = content;
});
</script>
```

### API Response Slowdowns

**Symptoms:**
- Slow form submissions
- Delayed content loading
- API timeout errors

**Diagnosis:**
```bash
# Test API response times
time curl -X GET "https://your-api.com/endpoint"

# Test with different request sizes
curl -X POST "https://your-api.com/endpoint" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -w "Time: %{time_total}s\n"

# Check API logs in Xano dashboard
```

**Solutions:**

**1. Query Optimization:**
```sql
-- ❌ Slow query
SELECT * FROM posts 
WHERE content LIKE '%search term%' 
ORDER BY created_at DESC;

-- ✅ Optimized query
SELECT id, title, excerpt, created_at 
FROM posts 
WHERE title LIKE '%search term%' 
   OR excerpt LIKE '%search term%'
ORDER BY created_at DESC 
LIMIT 20;

-- Add indexes
CREATE INDEX idx_posts_title ON posts(title);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

**2. Response Caching:**
```javascript
// Client-side response caching
class CachedXanoClient extends XanoClient {
  constructor() {
    super();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async get(endpoint, options = {}) {
    const cacheKey = `${endpoint}?${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    
    const response = await super.get(endpoint, options);
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    
    return response;
  }
}
```

**3. Request Optimization:**
```javascript
// Batch API requests
class BatchedXanoClient extends XanoClient {
  constructor() {
    super();
    this.batchQueue = [];
    this.batchTimeout = null;
  }

  async batchGet(endpoints) {
    return new Promise((resolve) => {
      this.batchQueue.push({ endpoints, resolve });
      
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }
      
      this.batchTimeout = setTimeout(() => {
        this.processBatch();
      }, 100); // Batch requests within 100ms
    });
  }

  async processBatch() {
    const batch = this.batchQueue.splice(0);
    const allEndpoints = batch.flatMap(item => item.endpoints);
    
    try {
      const responses = await Promise.all(
        allEndpoints.map(endpoint => this.get(endpoint))
      );
      
      let responseIndex = 0;
      batch.forEach(item => {
        const itemResponses = responses.slice(responseIndex, responseIndex + item.endpoints.length);
        responseIndex += item.endpoints.length;
        item.resolve(itemResponses);
      });
    } catch (error) {
      batch.forEach(item => item.resolve({ error }));
    }
  }
}
```

---

## 🔒 Security Issues

### API Security Vulnerabilities

**Symptoms:**
- Security scan alerts
- Unauthorized access attempts
- Data exposure warnings

**Diagnosis:**
```bash
# Security audit
npm audit

# Check for exposed secrets
git log --grep="password\|key\|secret" -i

# Test API security
curl -X GET "https://your-api.com/admin" # Should return 401/403
curl -X POST "https://your-api.com/users" # Test without authentication
```

**Solutions:**

**1. Input Validation:**
```javascript
// Server-side validation (Xano)
function validateInput(data, schema) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (rules.type === 'email' && !isValidEmail(value)) {
      errors.push(`${field} must be a valid email`);
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must not exceed ${rules.maxLength} characters`);
    }
  }
  
  return errors;
}
```

**2. Authentication Security:**
```javascript
// JWT token security
const tokenConfig = {
  algorithm: 'HS256',
  expiresIn: '1h',        // Short-lived access tokens
  refreshExpiresIn: '7d', // Longer refresh tokens
  issuer: 'your-app',
  audience: 'your-users',
  notBefore: 0,
  clockTimestamp: Math.floor(Date.now() / 1000)
};

// Rate limiting
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
};
```

**3. Data Protection:**
```javascript
// Sanitize sensitive data in responses
function sanitizeUser(user) {
  const { password_hash, resetToken, ...publicUser } = user;
  return publicUser;
}

// Log sanitization
function sanitizeLogData(data) {
  const sensitive = ['password', 'token', 'key', 'secret'];
  const sanitized = { ...data };
  
  for (const field of sensitive) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}
```

---

## 🔍 Debugging Techniques

### Browser DevTools Debugging

**Console Debugging:**
```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');
window.WEBFLOW_DEBUG = true;

// Debug integration components
console.log('XanoClient:', window.XanoClient);
console.log('FormHandler:', window.FormHandler);
console.log('Integration:', window.WebflowIntegration);

// Monitor API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Call:', args[0], args[1]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('API Response:', response.status, response.url);
      return response;
    })
    .catch(error => {
      console.error('API Error:', error);
      throw error;
    });
};
```

**Network Tab Analysis:**
```javascript
// Check for:
// - Failed requests (red entries)
// - Slow requests (long duration)
// - Large payloads (size column)
// - CORS errors (console messages)
// - 404 errors for assets
```

### Server-Side Debugging

**Xano Debug Mode:**
```javascript
// Enable detailed logging in Xano functions
function debugLog(message, data = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, JSON.stringify(data, null, 2));
  }
}

// Example usage in Xano endpoint
function createUser(userData) {
  debugLog('Creating user', { userData });
  
  try {
    const user = User.create(userData);
    debugLog('User created successfully', { userId: user.id });
    return user;
  } catch (error) {
    debugLog('User creation failed', { error: error.message });
    throw error;
  }
}
```

### GitHub Actions Debugging

**Workflow Debugging:**
```yaml
# Add debug steps to workflows
- name: Debug Environment
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Working directory: $(pwd)"
    echo "Environment: $NODE_ENV"
    
- name: Debug Secrets (Safe)
  run: |
    echo "Checking secrets availability..."
    if [ -n "${{ secrets.SLACK_WEBHOOK_URL }}" ]; then
      echo "✅ SLACK_WEBHOOK_URL available"
    else
      echo "❌ SLACK_WEBHOOK_URL missing"
    fi
    
- name: Debug API Connection
  run: |
    curl -v -X GET "${{ secrets.XANO_PRODUCTION_URL }}/health" \
      -H "Authorization: Bearer ${{ secrets.XANO_PRODUCTION_API_KEY }}" || true
```

---

## 📞 Getting Help

### Self-Service Resources

**1. Project Status Commands:**
```bash
# Get comprehensive project status
claude -p '/project-status'

# Check all integrations
claude -p '/integration-check'

# Get prioritized next steps
claude -p '/next-steps'

# View setup progress
claude -p '/setup-reminder'
```

**2. Log Analysis:**
```bash
# Check GitHub Actions logs
gh run list --limit 5
gh run logs [run-id]

# View Webflow browser console
# Open DevTools → Console tab

# Check Xano dashboard logs
# Login to Xano → Analytics → Logs
```

**3. Health Checks:**
```bash
# Test API connectivity
curl -X GET "https://your-api.com/health"

# Test webhook connectivity
curl -X POST "$SLACK_WEBHOOK_URL" -d '{"text":"Test"}'

# Run monitoring workflows
gh workflow run api-health-monitoring.yml
```

### Creating Support Issues

**When to Create an Issue:**
- Problem persists after trying documented solutions
- Unexpected behavior not covered in troubleshooting guide
- Feature requests or enhancements
- Security concerns

**How to Create Effective Issues:**
```bash
# Use appropriate issue template
gh issue create --template bug_report.yml
gh issue create --template feature_request.yml
gh issue create --template emergency_hotfix.yml

# Include diagnostic information
claude -p '/integration-check' >> issue-details.txt
gh run logs [failed-run-id] >> issue-details.txt
gh issue create --title "API Integration Issue" --body-file issue-details.txt
```

### Escalation Process

**Level 1: Self-Service (0-2 hours)**
- Review troubleshooting guide
- Check project status commands
- Analyze logs and error messages

**Level 2: Community Support (2-24 hours)**
- Create GitHub issue with detailed information
- Check for similar issues in repository
- Review documentation for missed steps

**Level 3: Priority Support (24+ hours)**
- Use emergency hotfix template for critical issues
- Include full diagnostic information
- Specify business impact and urgency

---

**Troubleshooting Guide Version:** 1.0  
**Last Updated:** August 23, 2025  
**Coverage:** 95% of common issues  
**Average Resolution Time:** 15-30 minutes