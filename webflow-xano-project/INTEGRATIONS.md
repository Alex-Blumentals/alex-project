# 🔗 Integrations Guide

Complete setup and configuration guide for all platform integrations: Webflow, Xano, Tempo.new, and monitoring services.

## Overview

This project integrates multiple platforms to create a comprehensive web development and project management ecosystem:

- **🎨 Webflow**: Frontend design and hosting
- **🛢️ Xano**: Backend API and database  
- **📊 Tempo.new**: Project management and task tracking
- **📈 Monitoring**: GitHub Actions, Slack, performance tracking
- **🔒 Security**: Automated scanning and compliance

## 🎨 Webflow Integration

### Prerequisites
- Webflow account with site editing permissions
- Webflow API token with appropriate scopes
- Custom domain configured (for production)

### 1. Webflow Account Setup

**Generate API Token:**
1. Go to Webflow Account Settings → Integrations
2. Generate new API token with these scopes:
   - `sites:read` - Read site information
   - `cms:read` - Read CMS collections and items
   - `cms:write` - Create and update CMS items
   - `webhooks:read` - Read webhook configurations
   - `webhooks:write` - Create webhook integrations

**Configure Site Settings:**
1. In Webflow Designer → Site Settings → General
2. Note your Site ID (needed for API calls)
3. Set up custom domain (for production)

### 2. Integration Library Deployment

**Add to Webflow Custom Code:**

**Head Code** (Site Settings → Custom Code → Head Code):
```html
<!-- Webflow + Xano Integration Library -->
<!-- Environment Detection and Configuration -->
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/config/environment-config.js"></script>

<!-- Core Xano API Client -->
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/js/xano-client.js"></script>

<!-- Initialize environment configuration -->
<script>
  // Environment is auto-detected based on current URL
  console.log('🌍 Environment detected:', window.WEBFLOW_ENV || 'development');
</script>
```

**Before </body> tag** (Site Settings → Custom Code → Footer Code):
```html
<!-- Feature Modules -->
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/forms/form-handler.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/content/dynamic-content-loader.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/utils/error-handler.js"></script>

<!-- Initialize Integration System -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Webflow + Xano integration...');
    
    try {
        // Initialize core components
        const xanoClient = new XanoClient();
        const formHandler = new FormHandler(xanoClient);
        const contentLoader = new DynamicContentLoader(xanoClient);
        const errorHandler = new ErrorHandler();
        
        // Global integration object for debugging
        window.WebflowIntegration = {
            xanoClient,
            formHandler,
            contentLoader,
            errorHandler,
            environment: window.WEBFLOW_ENV || 'development'
        };
        
        console.log('✅ Webflow + Xano integration initialized successfully');
        
        // Optional: Test API connection
        xanoClient.testConnection().then(result => {
            console.log('🔗 API Connection:', result.status);
        }).catch(error => {
            console.warn('⚠️ API Connection test failed:', error.message);
        });
        
    } catch (error) {
        console.error('❌ Integration initialization failed:', error);
        
        // Fallback error reporting
        if (window.Sentry) {
            Sentry.captureException(error);
        }
    }
});
</script>
```

### 3. Form Integration Setup

**Basic Contact Form Example:**
```html
<!-- In Webflow Designer, add these attributes to your form -->
<form data-xano-form="contact" data-redirect="/thank-you" data-loading-text="Sending...">
    <div class="form-field">
        <input 
            type="text" 
            name="name" 
            data-field="name" 
            placeholder="Your Name" 
            required 
            data-validation="required,minLength:2"
        >
        <div class="error-message" data-error="name"></div>
    </div>
    
    <div class="form-field">
        <input 
            type="email" 
            name="email" 
            data-field="email" 
            placeholder="Your Email" 
            required 
            data-validation="required,email"
        >
        <div class="error-message" data-error="email"></div>
    </div>
    
    <div class="form-field">
        <textarea 
            name="message" 
            data-field="message" 
            placeholder="Your Message" 
            required 
            data-validation="required,minLength:10"
        ></textarea>
        <div class="error-message" data-error="message"></div>
    </div>
    
    <div class="form-actions">
        <button type="submit" class="submit-button">
            <span class="button-text">Send Message</span>
            <span class="button-loading" style="display: none;">
                <span class="loading-spinner"></span>
                Sending...
            </span>
        </button>
    </div>
    
    <!-- Success/Error Messages -->
    <div class="form-success" style="display: none;">
        <p>✅ Thank you! Your message has been sent successfully.</p>
    </div>
    <div class="form-error" style="display: none;">
        <p>❌ <span class="error-text">There was an error sending your message. Please try again.</span></p>
    </div>
</form>
```

**Advanced Form with File Upload:**
```html
<form data-xano-form="application" data-redirect="/application-submitted" data-file-upload="true">
    <!-- Standard fields -->
    <input type="text" data-field="name" required>
    <input type="email" data-field="email" required>
    
    <!-- File upload field -->
    <div class="file-upload">
        <input 
            type="file" 
            data-field="resume" 
            accept=".pdf,.doc,.docx" 
            data-max-size="5MB"
            data-validation="required,fileType:pdf|doc|docx,maxSize:5MB"
        >
        <div class="file-preview" data-preview="resume"></div>
        <div class="error-message" data-error="resume"></div>
    </div>
    
    <button type="submit">Submit Application</button>
</form>
```

### 4. Dynamic Content Setup

**Blog Posts Loading:**
```html
<!-- Container for dynamic content -->
<div 
    data-content="blog-posts" 
    data-template="blog-card" 
    data-limit="6"
    data-filter="status=published"
    data-sort="published_at:desc"
    data-lazy-load="true"
>
    <!-- Loading state -->
    <div class="loading-placeholder">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    </div>
</div>

<!-- Load more button -->
<div class="load-more-container" data-load-more="blog-posts">
    <button class="load-more-button">Load More Posts</button>
</div>

<!-- Template definition (hidden) -->
<script type="text/template" data-template-id="blog-card">
    <article class="blog-card">
        <div class="card-image">
            <img src="{{featured_image}}" alt="{{title}}" loading="lazy">
        </div>
        <div class="card-content">
            <h3 class="card-title">{{title}}</h3>
            <p class="card-excerpt">{{excerpt}}</p>
            <div class="card-meta">
                <span class="author">By {{author.name}}</span>
                <time class="date">{{published_at_formatted}}</time>
            </div>
            <a href="/blog/{{slug}}" class="read-more">Read More</a>
        </div>
    </article>
</script>
```

### 5. Performance Optimization

**Critical CSS Optimization:**
```html
<!-- Add to Head Code for performance -->
<style>
/* Critical CSS for above-the-fold content */
.hero-section { /* your critical styles */ }
.navigation { /* your critical styles */ }
</style>

<!-- Preload important resources -->
<link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://cdn.jsdelivr.net/gh/Alex-Blumentals/alex-project@main/webflow-integration/js/xano-client.js" as="script">
```

**Image Optimization:**
```html
<!-- Add to page-specific code -->
<script>
// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
</script>
```

## 🛢️ Xano Backend Integration

### Prerequisites
- Xano account with workspace access
- API endpoints configured
- Database schema designed

### 1. Xano Workspace Setup

**Environment Configuration:**
- **Development**: Testing and development workspace
- **Staging**: Pre-production testing environment  
- **Production**: Live production environment

**Required Endpoints:**
```javascript
// Standard API endpoints to create in Xano
const requiredEndpoints = {
    // Health check
    'GET /health': 'System health status',
    
    // Authentication
    'POST /auth/register': 'User registration',
    'POST /auth/login': 'User login',
    'POST /auth/refresh': 'Token refresh',
    'POST /auth/logout': 'User logout',
    
    // User management
    'GET /user/profile': 'Get user profile',
    'PATCH /user/profile': 'Update user profile',
    
    // Contact/Forms
    'POST /contact': 'Contact form submission',
    'POST /application': 'Application form submission',
    
    // Content management (if using CMS)
    'GET /posts': 'List blog posts',
    'GET /posts/:id': 'Get single post',
    'POST /posts': 'Create new post',
    'PATCH /posts/:id': 'Update post',
    'DELETE /posts/:id': 'Delete post'
};
```

### 2. Database Schema Design

**Users Table:**
```sql
-- Users table structure
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'editor') DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
```

**Contact Submissions:**
```sql
CREATE TABLE contact_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    source VARCHAR(100) DEFAULT 'website',
    status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

**Blog Posts (if applicable):**
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_author (author_id)
);
```

### 3. API Configuration

**Environment Variables:**
```env
# Development
XANO_DEV_URL=https://x8ki-letl-twmt.n7c.xano.io/api:v1
XANO_DEV_API_KEY=your-dev-api-key

# Staging  
XANO_STAGING_URL=https://staging-workspace.xano.io/api:v1
XANO_STAGING_API_KEY=your-staging-api-key

# Production
XANO_PRODUCTION_URL=https://production-workspace.xano.io/api:v1
XANO_PRODUCTION_API_KEY=your-production-api-key
```

**CORS Configuration:**
```javascript
// In Xano API settings, configure CORS origins:
const corsOrigins = [
    // Development
    'http://localhost:3000',
    'https://preview.webflow.io',
    
    // Staging
    'https://staging.your-site.com',
    'https://staging-site.webflow.io',
    
    // Production
    'https://your-site.com',
    'https://www.your-site.com'
];
```

### 4. Authentication Setup

**JWT Configuration:**
```javascript
// Xano JWT settings
const jwtConfig = {
    algorithm: 'HS256',
    expiresIn: '7d',           // Access token lifetime
    refreshExpiresIn: '30d',   // Refresh token lifetime
    issuer: 'your-app-name',
    audience: 'your-app-users'
};
```

**User Registration Endpoint:**
```javascript
// POST /auth/register
async function registerUser(request) {
    const { email, password, name } = request.body;
    
    // Validate input
    if (!email || !password || !name) {
        return { error: 'Missing required fields', status: 400 };
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { error: 'User already exists', status: 409 };
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
        email,
        password_hash: passwordHash,
        name,
        role: 'user'
    });
    
    // Generate tokens
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        accessToken,
        expiresIn: '7d'
    };
}
```

### 5. Local Testing Scripts

**Test API Connectivity:**
```bash
# Test Xano API endpoints
npm run xano:dev

# Test specific endpoint
curl -X GET "https://your-workspace.xano.io/api:v1/health" \
  -H "Authorization: Bearer your-api-key"
```

**Health Check Script:**
```bash
# Create test script
cat > test-xano-connection.js << 'EOF'
const XanoClient = require('./webflow-integration/js/xano-client.js');

async function testConnection() {
    const client = new XanoClient();
    
    try {
        const health = await client.get('/health');
        console.log('✅ Xano connection successful:', health);
    } catch (error) {
        console.error('❌ Xano connection failed:', error.message);
    }
}

testConnection();
EOF

node test-xano-connection.js
```

## 📊 Tempo.new Integration

### Prerequisites
- Tempo.new account with API access
- Project workspace configured
- GitHub integration enabled

### 1. Tempo.new Setup

**API Configuration:**
```env
TEMPO_API_KEY=your-tempo-api-token
TEMPO_PROJECT_ID=your-tempo-project-id
TEMPO_WEBHOOK_URL=your-tempo-webhook-url
```

**Project Structure:**
```javascript
const tempoProjectConfig = {
    name: 'Webflow + Xano Integration',
    description: 'Full-stack web development project',
    workflow: {
        states: ['backlog', 'todo', 'in-progress', 'review', 'done'],
        transitions: {
            'backlog -> todo': 'Sprint Planning',
            'todo -> in-progress': 'Start Work',
            'in-progress -> review': 'Submit for Review',
            'review -> done': 'Approve & Deploy',
            'review -> in-progress': 'Request Changes'
        }
    },
    integrations: {
        github: {
            repository: 'Alex-Blumentals/alex-project',
            autoCreateIssues: true,
            autoUpdateStatus: true
        }
    }
};
```

### 2. GitHub-Tempo Sync

**Webhook Configuration:**
```yaml
# .github/workflows/tempo-sync.yml
name: Tempo Sync

on:
  issues:
    types: [opened, closed, reopened]
  pull_request:
    types: [opened, closed, merged, ready_for_review]

jobs:
  sync-tempo:
    runs-on: ubuntu-latest
    steps:
      - name: Sync with Tempo
        run: |
          curl -X POST "${{ secrets.TEMPO_WEBHOOK_URL }}" \
            -H "Authorization: Bearer ${{ secrets.TEMPO_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "event": "${{ github.event.action }}",
              "repository": "${{ github.repository }}",
              "issue": ${{ toJson(github.event.issue) }},
              "pull_request": ${{ toJson(github.event.pull_request) }}
            }'
```

### 3. Task Management Integration

**Tempo Task Creation:**
```javascript
// Create Tempo task from GitHub issue
async function createTempoTask(githubIssue) {
    const tempoTask = {
        title: githubIssue.title,
        description: githubIssue.body,
        status: 'todo',
        priority: getPriorityFromLabels(githubIssue.labels),
        assignee: githubIssue.assignee?.login,
        metadata: {
            githubIssueId: githubIssue.number,
            githubUrl: githubIssue.html_url,
            repository: githubIssue.repository.full_name
        }
    };
    
    const response = await fetch('https://api.tempo.io/v4/tasks', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.TEMPO_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tempoTask)
    });
    
    return response.json();
}
```

## 📈 Monitoring Integration

### 1. Slack Integration

**Webhook Setup:**
1. Go to https://api.slack.com/apps
2. Create new app "Monitoring Bot"
3. Enable Incoming Webhooks
4. Create webhooks for channels:
   - `#alerts` - Critical issues
   - `#monitoring` - General monitoring  
   - `#performance` - Performance alerts
   - `#deployments` - Deployment notifications

**Channel Configuration:**
```bash
# Set Slack webhook secret
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/T.../B.../X..."

# Test webhook
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "🚀 Monitoring system test - integration successful!"}'
```

### 2. Performance Monitoring

**Lighthouse Integration:**
```yaml
# Automatic performance monitoring every 6 hours
# Monitors Core Web Vitals:
# - First Contentful Paint (FCP) < 1.8s
# - Largest Contentful Paint (LCP) < 2.5s
# - Cumulative Layout Shift (CLS) < 0.1
# - Time to Interactive (TTI) < 5s
```

**Performance Thresholds:**
```javascript
const performanceThresholds = {
    lighthouse: {
        performance: 80,    // Minimum score
        accessibility: 90,  // WCAG compliance
        bestPractices: 80,  // Best practices score
        seo: 90            // SEO optimization
    },
    coreWebVitals: {
        fcp: 1800,         // First Contentful Paint (ms)
        lcp: 2500,         // Largest Contentful Paint (ms)
        cls: 0.1,          // Cumulative Layout Shift
        tti: 5000          // Time to Interactive (ms)
    }
};
```

### 3. Error Tracking

**Sentry Integration (Optional):**
```bash
# Configure Sentry secrets
gh secret set SENTRY_AUTH_TOKEN --body "your-sentry-auth-token"
gh secret set SENTRY_ORG --body "your-organization"
gh secret set SENTRY_PROJECT --body "your-project-name"
```

**Error Monitoring Sources:**
- **Client-side**: JavaScript errors from Webflow site
- **API errors**: Xano backend error responses
- **GitHub Actions**: Workflow failures and issues
- **Custom logs**: Application-specific error tracking

## 🔧 Integration Testing

### Complete Integration Test

**Run comprehensive test:**
```bash
# Test all integrations
npm run test:integration

# Or test individually
npm run test:webflow     # Test Webflow integration
npm run test:xano        # Test Xano API connectivity
npm run test:tempo       # Test Tempo sync
npm run test:monitoring  # Test monitoring workflows
```

**Manual Integration Verification:**
```bash
# 1. Check project status
claude -p '/project-status'

# 2. Verify all integrations
claude -p '/integration-check'

# 3. Test monitoring workflows
gh workflow run api-health-monitoring.yml
gh workflow run performance-monitoring.yml

# 4. Check results
gh run list --limit 5
```

### Integration Checklist

**✅ Webflow Integration:**
- [ ] Custom code added to Webflow site
- [ ] Forms configured with data attributes
- [ ] Dynamic content containers set up
- [ ] Performance optimization implemented
- [ ] Error handling configured

**✅ Xano Integration:**
- [ ] Database schema created
- [ ] API endpoints configured
- [ ] Authentication system set up
- [ ] CORS properly configured
- [ ] Health check endpoint working

**✅ Tempo Integration:**
- [ ] Project workspace configured
- [ ] GitHub sync webhooks set up
- [ ] Task creation workflow tested
- [ ] Status update automation working
- [ ] Reporting dashboard accessible

**✅ Monitoring Integration:**
- [ ] Slack webhooks configured
- [ ] GitHub Actions workflows running
- [ ] Performance monitoring active
- [ ] Error tracking collecting data
- [ ] Alert notifications working

## Troubleshooting Common Issues

**Webflow Integration Issues:**
- CORS errors → Check Xano CORS settings
- Scripts not loading → Verify CDN URLs and file paths
- Forms not submitting → Check data attributes and API endpoints
- Performance issues → Review script loading order

**Xano Integration Issues:**
- Authentication failures → Verify API keys and JWT configuration
- Database connection errors → Check workspace status and permissions
- API timeout errors → Review query performance and optimization
- CORS issues → Update allowed origins in Xano settings

**Tempo Integration Issues:**
- Sync failures → Verify webhook URLs and API keys
- Task creation errors → Check project configuration and permissions
- Status update issues → Review GitHub webhook configuration
- Reporting problems → Verify Tempo dashboard access

**Monitoring Issues:**
- Slack notifications not working → Test webhook URLs manually
- Workflows not running → Check GitHub Actions permissions and secrets
- Performance monitoring failures → Verify site accessibility and Lighthouse setup
- Error tracking not collecting → Check API endpoints and authentication

---

**Integration Guide Version:** 1.0  
**Last Updated:** August 23, 2025  
**Supported Platforms:** Webflow, Xano, Tempo.new, GitHub Actions, Slack