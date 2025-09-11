# 🔗 Integration Details & Setup Guide

**Project:** TerraNext Webflow + Xano Integration  
**Last Updated:** August 25, 2025  
**Purpose:** Complete setup procedures and integration credentials management

---

## 🌐 Webflow Integration Setup

### Site Configuration Details

#### Primary Site Settings
- **Site Name:** TerraNext Landing Page
- **Domain:** [To be configured]  
- **Hosting:** Webflow Hosting with CDN
- **CMS Collections:** [To be determined based on dynamic content needs]

#### Custom Code Integration Points
```
Webflow Designer → Settings → Custom Code:

Site Head Code:
├── Google Fonts preload links
├── CSS Custom Properties (:root variables)
├── Global reset and base styles  
├── Critical above-the-fold CSS

Page Head Code:
├── Section-specific CSS (Hero, Problem, etc.)
├── Component-specific styles
├── Responsive design overrides

Site Footer Code:
├── Core JavaScript utilities
├── Performance monitoring scripts
├── Global event handlers (resize, scroll)

Page Footer Code:  
├── Section-specific JavaScript
├── Animation initialization
├── Interaction triggers
```

### Asset Management System

#### Image Optimization Pipeline
```
Source Images → Compression → WebP Conversion → Webflow Upload

Optimization Standards:
├── Format: WebP primary, JPEG fallback
├── Compression: Under 400KB per background image  
├── Dimensions: 1920x1080px minimum for backgrounds
└── Alt Text: Descriptive for accessibility
```

#### Font Integration Strategy
```html
<!-- Preload for Core Web Vitals -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Production font loading -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

---

## 🛢️ Xano Backend Integration

### API Configuration
**Note:** Xano integration is prepared but not yet implemented for this landing page project.

#### Planned Integration Points
```
Future Xano Endpoints:
├── /auth/login          # User authentication
├── /auth/register       # User registration  
├── /contacts            # Contact form submissions
├── /newsletter          # Newsletter signups
└── /analytics           # Custom event tracking
```

#### Environment Configuration Template
```javascript
// frontend/utils/env-config.js
const xanoConfig = {
  development: {
    baseURL: 'https://[workspace-id].us-east-1.xano.io/api:v1',
    websiteURL: 'https://dev.terranext.com'
  },
  staging: {
    baseURL: 'https://[workspace-id].us-east-1.xano.io/api:v1',
    websiteURL: 'https://staging.terranext.com'  
  },
  production: {
    baseURL: 'https://[workspace-id].us-east-1.xano.io/api:v1',
    websiteURL: 'https://terranext.com'
  }
};
```

#### Authentication Flow Template
```javascript
// backend/utils/xano-client.js
class XanoClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('xano_token');
  }
  
  async authenticate(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { authToken } = await response.json();
      this.token = authToken;
      localStorage.setItem('xano_token', authToken);
    }
    
    return response;
  }
}
```

---

## 🔧 GitHub Workflow Integration

### Repository Structure
```
webflow-xano-project/
├── .github/
│   ├── workflows/
│   │   ├── webflow-export.yml      # Automated Webflow exports
│   │   ├── performance-monitoring.yml  # Lighthouse CI
│   │   └── deployment-validation.yml   # Pre-deployment checks
├── webflow-implementations/        # Section-by-section code
│   ├── hero-section/
│   ├── problem-section/
│   └── [future-sections]/
├── webflow-assets/                 # Organized asset files
├── backend/                        # Xano integration (future)
├── docs/                          # Project documentation
└── scripts/                       # Automation and utilities
```

### GitHub Actions Configuration

#### Automated Webflow Export Workflow
```yaml
# .github/workflows/webflow-export.yml
name: Webflow Code Export
on:
  schedule:
    - cron: '0 9,14,18 * * 1,3,5'  # Mon/Wed/Fri at 9am, 2pm, 6pm
  workflow_dispatch:

jobs:
  export-webflow-code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Export Webflow Custom Code
        env:
          WEBFLOW_SITE_ID: ${{ secrets.WEBFLOW_SITE_ID }}
          WEBFLOW_API_TOKEN: ${{ secrets.WEBFLOW_API_TOKEN }}
        run: |
          # Export site head/footer code
          # Compare with existing exports  
          # Create commit if changes detected
          
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add webflow-exports/
          git commit -m "🔄 Automated Webflow export $(date)"
          git push
```

#### Performance Monitoring Workflow
```yaml
# .github/workflows/performance-monitoring.yml
name: Performance Monitoring
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: '.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Required GitHub Secrets

#### Webflow Integration Secrets
```bash
# Repository Settings → Secrets → Actions
WEBFLOW_SITE_ID="your-site-id-here"
WEBFLOW_API_TOKEN="your-api-token-here"  
WEBFLOW_COLLECTION_IDS='{"blog": "collection-id", "team": "collection-id"}'
```

#### Future Xano Integration Secrets
```bash
# For future backend integration
XANO_WORKSPACE_ID="workspace-id"
XANO_API_KEY="api-key"
XANO_DEV_URL="https://workspace.us-east-1.xano.io/api:v1"
XANO_PROD_URL="https://workspace.us-east-1.xano.io/api:v1"
```

---

## 📊 Performance Monitoring Setup

### Lighthouse CI Configuration
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["https://terranext.webflow.io/"],
      "startServerCommand": "npm run dev",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Core Web Vitals Monitoring
```javascript
// Performance monitoring script
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics provider
  console.log('Web Vital:', metric);
}

// Measure all Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);  
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🚀 Deployment Configuration

### Webflow Hosting Setup
```
Production Deployment Steps:
1. Complete section implementations in Designer
2. Apply all custom CSS/JS from repository  
3. Upload and optimize all assets
4. Configure custom domain (if applicable)
5. Enable SSL and security headers
6. Set up 301 redirects (if migrating)
7. Configure analytics and tracking
8. Performance validation with Lighthouse
```

### Custom Domain Configuration
```
DNS Configuration (when ready):
├── A Record: @ → Webflow IP
├── CNAME: www → proxy-ssl.webflow.com
├── MX Records: → Email provider
└── TXT Records: → Domain verification
```

### SSL and Security Headers
```
Webflow Security Settings:
├── SSL Certificate: Auto-provisioned
├── HSTS: Enabled  
├── X-Frame-Options: DENY
├── X-Content-Type-Options: nosniff
└── Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🔧 Development Environment Setup

### Local Development Configuration
```bash
# Clone repository
git clone https://github.com/[username]/webflow-xano-project.git
cd webflow-xano-project

# Install dependencies (future Node.js tools)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development environment
npm run dev
```

### Browser Developer Tools Setup
```
Chrome DevTools Configuration:
├── Performance Tab: Enable runtime performance monitoring
├── Network Tab: Throttle to "Fast 3G" for mobile testing  
├── Console: Filter for warnings and errors
├── Lighthouse: Run audits after each section implementation
└── Device Toolbar: Test responsive breakpoints
```

### Code Editor Configuration
```json
// .vscode/settings.json (VS Code)
{
  "editor.formatOnSave": true,
  "css.validate": true,
  "javascript.validate.enable": true,
  "files.associations": {
    "*.css": "css",
    "*.js": "javascript"
  }
}
```

---

## 🔄 Backup and Recovery Procedures

### Code Backup Strategy
```
Git-Based Backup System:
├── Main Branch: Production-ready implementations
├── Feature Branches: Individual section development
├── Tags: Version releases and milestones  
└── Remote: GitHub as primary backup location
```

### Asset Backup Procedures
```bash
# Automated asset backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/webflow-assets-${DATE}"

mkdir -p $BACKUP_DIR
cp -r webflow-assets/* $BACKUP_DIR/
tar -czf "${BACKUP_DIR}.tar.gz" $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "Asset backup created: ${BACKUP_DIR}.tar.gz"
```

### Recovery Procedures
```
Recovery Steps (if needed):
1. Identify last known good commit hash
2. git checkout [commit-hash] 
3. Re-apply custom code to Webflow
4. Re-upload assets if corrupted
5. Test all functionality
6. Update tracking documentation
```

---

## 🧪 Testing and Validation Procedures

### Cross-Browser Testing Matrix
```
Required Testing Browsers:
├── Chrome (Latest) - Primary development browser
├── Firefox (Latest) - Backdrop-filter fallback validation
├── Safari (Latest) - WebKit prefix requirements
├── Edge (Latest) - Modern compatibility verification
└── Mobile Safari/Chrome - Touch interaction testing
```

### Performance Testing Checklist
```
Performance Validation Steps:
├── Lighthouse audit (90+ score target)
├── Core Web Vitals measurement
├── Mobile network throttling test
├── Animation frame rate monitoring (60fps)
├── Memory usage profiling
└── Asset loading optimization verification
```

### Accessibility Testing Protocol
```
A11y Testing Requirements:
├── Screen reader navigation (NVDA/VoiceOver)
├── Keyboard-only navigation testing
├── Color contrast validation (WCAG AA)
├── Focus indicator visibility
├── Reduced motion preference respect
└── Alt text and ARIA label verification
```

---

## 📋 Maintenance and Updates

### Regular Maintenance Tasks
```
Weekly Maintenance Schedule:
├── Monday: Automated Webflow exports review
├── Wednesday: Performance metrics analysis  
├── Friday: Cross-browser compatibility checks
└── Monthly: Full accessibility audit
```

### Update Procedures
```
Section Update Workflow:
1. Create feature branch for changes
2. Implement and test modifications  
3. Update implementation documentation
4. Run full test suite
5. Create pull request with detailed description
6. Merge after review and validation
7. Update progress tracking
8. Deploy to Webflow
```

### Monitoring and Alerts
```javascript
// Error monitoring setup
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  // Send to monitoring service (future)
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
  // Send to monitoring service (future)  
});
```

---

**Setup Status:** ✅ Documentation Complete  
**Implementation Status:** Ready for full integration  
**Required Actions:** Configure Webflow site and apply custom code  
**Estimated Setup Time:** 2-3 hours for complete integration