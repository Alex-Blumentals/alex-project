# ⚡ Development Workflows

Complete guide to development processes, commands, and best practices for the Webflow + Xano integration project.

## Overview

This project uses a structured workflow that integrates multiple platforms and tools to ensure smooth development, testing, and deployment processes.

**Workflow Stack:**
- **🔄 Git Flow**: Feature branches → develop → main
- **🚀 CI/CD**: Automated testing, building, and deployment
- **📊 Monitoring**: Real-time health checks and performance tracking
- **🎯 Project Management**: Tempo.new task tracking with GitHub sync
- **🔒 Security**: Automated scanning and compliance checks

## 🌊 Git Workflow

### Branch Strategy

**Branch Structure:**
```
main (production)
├── develop (staging)
│   ├── feature/user-authentication
│   ├── feature/contact-form
│   └── feature/blog-integration
├── hotfix/critical-security-fix
└── release/v1.2.0
```

**Branch Purposes:**
- **`main`**: Production-ready code, protected with required reviews
- **`develop`**: Integration branch for staging deployment
- **`feature/*`**: New feature development
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation and testing

### Development Process

**1. Start New Feature:**
```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/user-profile-page

# Push branch and set upstream
git push -u origin feature/user-profile-page
```

**2. Development Work:**
```bash
# Make changes and commit regularly
git add .
git commit -m "feat: add user profile form validation"

# Push changes frequently
git push

# Keep branch updated with develop
git fetch origin
git rebase origin/develop
```

**3. Code Review Process:**
```bash
# Create pull request when feature is complete
gh pr create \
  --base develop \
  --title "feat: User Profile Management" \
  --body "
## 🎯 What This PR Does
- Adds user profile editing form
- Implements form validation
- Integrates with Xano user API

## 🧪 Testing
- [ ] Form validation works correctly
- [ ] API integration tested
- [ ] Responsive design verified

## 📱 Screenshots
[Add screenshots if applicable]

## 🔗 Related Issues
Closes #123
"

# Or use PR template
gh pr create --template simple_template.md
```

### Commit Message Standards

**Commit Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): implement JWT token refresh"
git commit -m "fix(forms): resolve validation error display"
git commit -m "docs(api): update Xano endpoint documentation"
git commit -m "style(components): format React components with Prettier"
```

## 🔧 Development Commands

### Essential Commands

**Project Setup:**
```bash
# Initial setup
npm install

# Environment configuration
cp .env.example .env
nano .env  # Configure your environment variables
```

**Development Servers:**
```bash
# Start all development servers
npm run dev

# Individual services
npm run webflow:dev    # Webflow development server with hot reload
npm run xano:dev       # Xano development utilities and health monitoring
npm run tempo:dev      # Tempo frontend development (if applicable)
```

**Testing & Quality:**
```bash
# Run all tests
npm test

# Specific test types
npm run test:unit           # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests

# Code quality
npm run lint               # ESLint code linting
npm run lint:fix          # Auto-fix linting issues
npm run format            # Prettier code formatting
npm run type-check        # TypeScript type checking (if applicable)
```

**Build & Deployment:**
```bash
# Build for production
npm run build

# Platform-specific builds
npm run build:webflow     # Optimize for Webflow deployment
npm run build:xano        # Prepare backend deployment
npm run build:assets      # Optimize static assets

# Deployment
npm run deploy            # Full deployment (all platforms)
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production (with approval)
```

### Custom Slash Commands

**Project Context Commands:**
```bash
# Check overall project status
claude -p '/project-status'

# View setup progress
claude -p '/setup-reminder'

# Verify all integrations
claude -p '/integration-check'

# Get prioritized next steps
claude -p '/next-steps'
```

### GitHub Actions Commands

**Workflow Management:**
```bash
# List all workflows
gh workflow list

# Run specific workflow
gh workflow run api-health-monitoring.yml
gh workflow run performance-monitoring.yml
gh workflow run deploy-staging.yml

# Monitor workflow runs
gh run list --limit 10
gh run view [run-id]
gh run logs [run-id]

# Cancel running workflow
gh run cancel [run-id]
```

**Repository Management:**
```bash
# View repository information
gh repo view

# Manage secrets
gh secret list
gh secret set SECRET_NAME --body "secret-value"
gh secret delete SECRET_NAME

# Issue and PR management
gh issue list
gh pr list --state open
gh pr review [pr-number] --approve
```

## 🧪 Testing Workflow

### Test Types & Coverage

**Unit Tests:**
```bash
# Test individual components/functions
npm run test:unit

# Examples of unit test coverage:
# - XanoClient API methods
# - Form validation functions
# - Environment configuration
# - Utility functions
```

**Integration Tests:**
```bash
# Test component interactions
npm run test:integration

# Examples of integration tests:
# - Form submission to Xano API
# - Content loading from CMS
# - Authentication flow
# - Error handling scenarios
```

**End-to-End Tests:**
```bash
# Test complete user workflows
npm run test:e2e

# Examples of E2E tests:
# - User registration and login
# - Contact form submission
# - Content management workflow
# - Payment processing (if applicable)
```

### Testing Best Practices

**Test Structure:**
```javascript
// Example test structure
describe('Contact Form Integration', () => {
  beforeEach(() => {
    // Setup test environment
    setupTestDatabase();
    mockXanoAPI();
  });

  afterEach(() => {
    // Cleanup
    cleanupTestData();
  });

  it('should submit form data to Xano API', async () => {
    // Arrange
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    };

    // Act
    const result = await submitContactForm(formData);

    // Assert
    expect(result.status).toBe('success');
    expect(result.data.id).toBeDefined();
  });

  it('should handle validation errors', async () => {
    // Test validation scenarios
  });

  it('should handle API errors gracefully', async () => {
    // Test error handling
  });
});
```

**Testing Environment Setup:**
```bash
# Test environment configuration
export NODE_ENV=test
export XANO_TEST_URL=https://test-workspace.xano.io/api:v1
export XANO_TEST_API_KEY=test-api-key

# Run tests with coverage
npm run test -- --coverage

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment Workflow

### Environment Strategy

**Environment Progression:**
```
Development → Staging → Production
     ↓            ↓         ↓
Local testing → User acceptance → Live site
```

**Environment Configurations:**
```javascript
const environments = {
  development: {
    webflow: 'https://dev-site.webflow.io',
    xano: 'https://dev-workspace.xano.io/api:v1',
    features: { debug: true, mockData: true }
  },
  staging: {
    webflow: 'https://staging.yoursite.com',
    xano: 'https://staging-workspace.xano.io/api:v1',
    features: { debug: false, mockData: false }
  },
  production: {
    webflow: 'https://yoursite.com',
    xano: 'https://production-workspace.xano.io/api:v1',
    features: { debug: false, mockData: false }
  }
};
```

### Automated Deployment Pipeline

**Staging Deployment (Automatic):**
```yaml
# Triggered by push to develop branch
name: Deploy to Staging

on:
  push:
    branches: [ develop ]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Run Tests
        run: npm test
      
      - name: Build Assets
        run: npm run build:staging
      
      - name: Deploy to Webflow
        run: npm run deploy:webflow:staging
      
      - name: Deploy to Xano
        run: npm run deploy:xano:staging
      
      - name: Health Check
        run: npm run health-check:staging
      
      - name: Notify Success
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -d '{"text": "✅ Staging deployment successful"}'
```

**Production Deployment (Manual Approval):**
```bash
# Create production deployment PR
gh pr create \
  --base main \
  --head develop \
  --title "🚀 Production Release v1.2.0" \
  --body "
## 🚀 Production Release v1.2.0

### 🎯 Features
- User profile management
- Enhanced contact forms
- Performance optimizations

### 🔧 Bug Fixes
- Fixed form validation issues
- Resolved API timeout problems

### 🧪 Testing
- [x] All automated tests passing
- [x] Manual QA completed
- [x] Staging environment validated
- [x] Performance benchmarks met

### 📊 Deployment Checklist
- [x] Database migrations prepared
- [x] Environment variables updated
- [x] Monitoring alerts configured
- [x] Rollback plan documented

### 🔗 Related Issues
Closes #123, #124, #125
"

# After PR approval and merge, production deployment runs automatically
```

### Manual Deployment Commands

**Deploy to Staging:**
```bash
# Full staging deployment
npm run deploy:staging

# Or step by step
npm run build
npm run test
npm run deploy:webflow:staging
npm run deploy:xano:staging
npm run health-check:staging
```

**Deploy to Production:**
```bash
# Production deployment (requires confirmation)
npm run deploy:production

# Emergency hotfix deployment
npm run deploy:hotfix

# Rollback if needed
npm run rollback:production
```

## 📊 Monitoring Workflow

### Continuous Monitoring

**Automated Health Checks:**
```bash
# Health checks run automatically:
# - API Health: Every 5 minutes
# - Performance: Every 6 hours
# - Error Tracking: Every hour
# - Security Scans: Daily

# Manual health check
gh workflow run api-health-monitoring.yml

# View monitoring results
gh run list --workflow="API Health Monitoring"
```

**Performance Monitoring:**
```bash
# Run performance audit
gh workflow run performance-monitoring.yml

# Check Core Web Vitals
npm run audit:performance

# Lighthouse audit
npm run lighthouse
```

### Alert Management

**Alert Severity Levels:**
- 🚨 **Critical**: Production down, security breach
- ⚠️ **High**: Performance degradation, API errors
- ℹ️ **Medium**: Warning thresholds exceeded
- 📊 **Info**: Successful deployments, reports

**Alert Channels:**
```bash
# Slack channels for different alert types
#alerts      → Critical and high priority alerts
#monitoring  → General monitoring and medium alerts
#performance → Performance-related notifications
#deployments → Deployment status updates
```

### Incident Response

**Incident Workflow:**
```bash
# 1. Alert received in Slack
# 2. Assess severity and impact
# 3. Create incident issue (automatic for critical alerts)
# 4. Investigate and implement fix
# 5. Deploy fix or rollback
# 6. Monitor recovery
# 7. Post-incident review

# Create incident issue manually
gh issue create --template emergency_hotfix.yml
```

**Emergency Procedures:**
```bash
# Emergency rollback
gh workflow run rollback.yml --field rollback_reason="critical_error"

# Emergency hotfix deployment
git checkout -b hotfix/critical-fix main
# ... make fix ...
git commit -m "hotfix: resolve critical security issue"
git push -u origin hotfix/critical-fix
gh pr create --base main --template hotfix_template.md
```

## 🎯 Project Management Workflow

### Tempo.new Integration

**Task Management Flow:**
```
Tempo Task → GitHub Issue → PR → Review → Deploy → Tempo Update
```

**Task Creation:**
```bash
# Tasks are created in Tempo.new with:
# - Clear title and description
# - Priority level (Critical, High, Medium, Low)
# - Assignee and due date
# - Acceptance criteria
# - Related GitHub issue (auto-created)
```

**Status Updates:**
```bash
# Task statuses sync automatically:
# Tempo: Backlog → GitHub: Open Issue
# Tempo: In Progress → GitHub: In Progress
# Tempo: Review → GitHub: PR Created
# Tempo: Done → GitHub: PR Merged & Deployed
```

### Sprint Planning

**Sprint Structure:**
```bash
# 2-week sprints with defined goals
# Sprint planning includes:
# - Backlog grooming
# - Task estimation
# - Capacity planning
# - Risk assessment
```

**Sprint Commands:**
```bash
# View current sprint status
claude -p '/project-status'

# Check task completion
gh issue list --milestone current-sprint

# Review PR status
gh pr list --assignee @me
```

## 🔄 Code Review Workflow

### Review Process

**PR Review Checklist:**
```markdown
## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Tests pass

### Code Quality  
- [ ] Code follows style guide
- [ ] Functions are focused and testable
- [ ] Comments explain complex logic
- [ ] No code duplication

### Security
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization correct
- [ ] Dependencies are secure

### Performance
- [ ] No performance regressions
- [ ] Database queries optimized
- [ ] Assets optimized
- [ ] Caching implemented where appropriate
```

**Review Commands:**
```bash
# Create PR for review
gh pr create --template default_template.md

# Request review from team member
gh pr edit [pr-number] --add-reviewer teammate-username

# Review PR
gh pr checkout [pr-number]  # Check out PR locally
gh pr review [pr-number] --approve
gh pr review [pr-number] --request-changes --body "Please address comments"

# Merge after approval
gh pr merge [pr-number] --squash
```

### Automated Checks

**Pre-merge Validation:**
```yaml
# Automated checks run on every PR:
- Code linting (ESLint)
- Type checking (TypeScript)
- Unit tests
- Integration tests
- Security scanning
- Performance impact analysis
- Bundle size analysis
```

## 📈 Performance Optimization Workflow

### Performance Monitoring

**Core Web Vitals Tracking:**
```bash
# Automated performance monitoring tracks:
# - First Contentful Paint (FCP): Target < 1.8s
# - Largest Contentful Paint (LCP): Target < 2.5s
# - Cumulative Layout Shift (CLS): Target < 0.1
# - Time to Interactive (TTI): Target < 5s

# Manual performance check
npm run audit:performance
```

**Optimization Process:**
```bash
# 1. Identify performance issues
npm run lighthouse

# 2. Analyze bundle size
npm run analyze

# 3. Implement optimizations
npm run optimize:images
npm run optimize:css
npm run optimize:js

# 4. Test improvements
npm run test:performance

# 5. Deploy and monitor
npm run deploy:staging
```

### Optimization Techniques

**Code Optimization:**
```javascript
// Lazy loading implementation
const LazyComponent = React.lazy(() => import('./Component'));

// Image optimization
<img 
  src="image.webp" 
  alt="Description" 
  loading="lazy" 
  width="300" 
  height="200"
/>

// Code splitting
const feature = await import('./feature-module.js');
```

**Build Optimization:**
```bash
# Production build optimizations
npm run build:optimize

# Generates:
# - Minified JavaScript and CSS
# - Optimized images (WebP, AVIF)
# - Tree-shaken bundles
# - Compressed assets (gzip, brotli)
```

## 🔒 Security Workflow

### Security Scanning

**Automated Security Checks:**
```bash
# Daily security scans include:
# - Dependency vulnerability scanning
# - Code security analysis
# - Secret detection
# - License compliance
# - Infrastructure security

# Manual security audit
npm audit
npm run security:scan
```

**Security Response:**
```bash
# When vulnerability detected:
# 1. Assess severity and impact
# 2. Update vulnerable dependencies
# 3. Test fixes thoroughly
# 4. Deploy security patches
# 5. Document security incident

# Update dependencies
npm audit fix
npm update

# Check for security issues
npm run security:check
```

### Compliance Monitoring

**Security Standards:**
- OWASP Top 10 compliance
- Secure coding practices
- Data protection (GDPR compliance)
- API security best practices
- Infrastructure security

## 📚 Documentation Workflow

### Documentation Updates

**Documentation Types:**
- **Code Documentation**: Inline comments and JSDoc
- **API Documentation**: Endpoint specifications
- **User Guides**: Feature usage instructions
- **Technical Guides**: Setup and configuration
- **Architecture Documentation**: System design

**Documentation Commands:**
```bash
# Generate API documentation
npm run docs:api

# Update README files
npm run docs:update

# Generate changelog
npm run changelog

# Documentation review
npm run docs:lint
```

### Knowledge Management

**Documentation Structure:**
```
docs/
├── setup/           # Installation guides
├── integrations/    # Platform integration docs
├── workflows/       # Process documentation
├── troubleshooting/ # Issue resolution
├── api/            # API specifications
└── architecture/   # System design docs
```

## Quick Reference

### Daily Commands
```bash
# Start development
git checkout develop && git pull && npm run dev

# Check project status
claude -p '/project-status'

# Run tests before committing
npm test && npm run lint

# Create feature branch
git checkout -b feature/new-feature

# Create PR
gh pr create --template simple_template.md
```

### Emergency Commands
```bash
# Emergency rollback
gh workflow run rollback.yml

# Check system health
gh workflow run api-health-monitoring.yml

# View recent errors
gh run list --workflow="Error Tracking"

# Create emergency issue
gh issue create --template emergency_hotfix.yml
```

### Monitoring Commands
```bash
# View workflow status
gh run list --limit 10

# Check secrets
gh secret list

# Test webhook
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Test"}'

# Performance check
npm run lighthouse
```

---

**Workflow Guide Version:** 1.0  
**Last Updated:** August 23, 2025  
**Team Size:** 1-5 developers  
**Sprint Duration:** 2 weeks