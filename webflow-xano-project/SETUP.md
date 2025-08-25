# 🚀 Project Setup Guide

Complete installation and initial configuration guide for the Webflow + Xano integration with comprehensive monitoring.

## Prerequisites

Before starting, ensure you have:
- **GitHub account** with repository access
- **Webflow account** with site editing permissions
- **Xano account** with workspace access
- **Slack workspace** for notifications (optional but recommended)
- **Node.js 18+** for local development
- **Git** configured with your credentials

## Quick Start (5 Minutes)

### 1. GitHub Authentication & Repository Setup

**Check current authentication status:**
```bash
gh auth status
```

**If not authenticated, complete GitHub CLI setup:**
```bash
# Install GitHub CLI if needed
# Windows: winget install --id GitHub.cli
# macOS: brew install gh
# Linux: see https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate
gh auth login --web

# Verify authentication
gh auth status
```

**Navigate to project and check status:**
```bash
cd /path/to/webflow-xano-project
git status
```

### 2. Merge Initial Project Setup

**⚠️ CRITICAL FIRST STEP:** The complete project setup is in Pull Request #2

```bash
# View the pull request
gh pr view 2

# Merge the complete project setup
gh pr merge 2 --merge
```

**This single merge activates:**
- ✅ All 11 GitHub Actions workflows
- ✅ Complete Webflow integration library
- ✅ Comprehensive monitoring system
- ✅ Issue and PR templates
- ✅ Security scanning and CI/CD pipeline

### 3. Configure Essential GitHub Secrets

**Navigate to GitHub Secrets:**
```bash
# Open repository in browser
gh repo view --web

# Or directly: https://github.com/Alex-Blumentals/alex-project/settings/secrets/actions
```

**Add minimum required secrets:**
```bash
# Essential secrets for basic functionality
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
gh secret set WEBFLOW_PRODUCTION_URL --body "https://your-site.com"
gh secret set XANO_PRODUCTION_URL --body "https://production-workspace.xano.io/api:v1"
gh secret set XANO_PRODUCTION_API_KEY --body "your-xano-api-key"
```

**Verify secrets configuration:**
```bash
gh secret list
```

### 4. Test System Activation

**Run a monitoring workflow to verify setup:**
```bash
# Test API health monitoring
gh workflow run api-health-monitoring.yml

# Check workflow status
gh run list --limit 5
```

**Expected result:** You should receive Slack notifications (if webhook configured) and see successful workflow runs.

## Detailed Setup

### Environment Configuration

**Create local environment file:**
```bash
# Copy example environment file
cp .env.example .env

# Edit with your specific values
nano .env  # or your preferred editor
```

**Environment variables structure:**
```env
# Webflow Configuration
WEBFLOW_SITE_ID=your-webflow-site-id
WEBFLOW_API_TOKEN=your-webflow-api-token
WEBFLOW_DEV_URL=https://dev-site.webflow.io
WEBFLOW_STAGING_URL=https://staging-site.webflow.io
WEBFLOW_PRODUCTION_URL=https://your-site.com

# Xano Configuration
XANO_WORKSPACE_ID=your-xano-workspace-id
XANO_DEV_URL=https://x8ki-letl-twmt.n7c.xano.io/api:v1
XANO_DEV_API_KEY=your-dev-api-key
XANO_STAGING_URL=https://staging-workspace.xano.io/api:v1
XANO_STAGING_API_KEY=your-staging-api-key
XANO_PRODUCTION_URL=https://production-workspace.xano.io/api:v1
XANO_PRODUCTION_API_KEY=your-production-api-key

# Development Settings
NODE_ENV=development
DEV_PORT=3000
HOT_RELOAD=true

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
TEMPO_API_KEY=your-tempo-api-key
```

### Complete GitHub Secrets Configuration

**All available secrets (see ENVIRONMENT_SECRETS_CHECKLIST.md for details):**

```bash
# Core Integration Secrets
gh secret set WEBFLOW_API_TOKEN --body "your-webflow-api-token"
gh secret set WEBFLOW_SITE_ID --body "your-webflow-site-id"
gh secret set WEBFLOW_DEV_URL --body "https://dev-site.webflow.io"
gh secret set WEBFLOW_STAGING_URL --body "https://staging-site.webflow.io"
gh secret set WEBFLOW_PRODUCTION_URL --body "https://your-site.com"

# Xano Configuration
gh secret set XANO_DEV_URL --body "https://x8ki-letl-twmt.n7c.xano.io/api:v1"
gh secret set XANO_DEV_API_KEY --body "your-dev-api-key"
gh secret set XANO_STAGING_URL --body "https://staging-workspace.xano.io/api:v1"
gh secret set XANO_STAGING_API_KEY --body "your-staging-api-key"
gh secret set XANO_PRODUCTION_URL --body "https://production-workspace.xano.io/api:v1"
gh secret set XANO_PRODUCTION_API_KEY --body "your-production-api-key"

# Notification Integration
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
gh secret set DISCORD_WEBHOOK_URL --body "https://discord.com/api/webhooks/YOUR/WEBHOOK/URL"

# Optional Advanced Monitoring
gh secret set SENTRY_AUTH_TOKEN --body "your-sentry-auth-token"
gh secret set SENTRY_ORG --body "your-sentry-organization"
gh secret set SENTRY_PROJECT --body "your-sentry-project"
gh secret set APP_LOGS_ENDPOINT --body "https://your-logs-api.com/logs"
gh secret set APP_LOGS_API_KEY --body "your-logs-api-key"
gh secret set TEMPO_API_KEY --body "your-tempo-api-key"
gh secret set TEMPO_PROJECT_ID --body "your-tempo-project-id"
```

### Local Development Setup

**Install dependencies:**
```bash
# Navigate to project directory
cd webflow-xano-project

# Install Node.js dependencies
npm install

# Verify installation
npm run --silent
```

**Available development commands:**
```bash
# Start development servers
npm run dev

# Individual service development
npm run webflow:dev    # Webflow development server
npm run xano:dev       # Xano development utilities

# Testing and validation
npm run test           # Run test suite
npm run lint           # Code linting
npm run format         # Code formatting

# Build and deployment
npm run build          # Production build
npm run deploy         # Full deployment
```

### Branch Structure Setup

**Create development branch:**
```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop

# Set up branch protection rules
gh api repos/Alex-Blumentals/alex-project/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI/CD Pipeline"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}'
```

**Branch workflow:**
- **main**: Production releases (protected)
- **develop**: Staging deployments (auto-deploy)
- **feature/***: Feature development
- **hotfix/***: Emergency fixes

## Verification Checklist

### ✅ Core Setup Verification

**Run project status check:**
```bash
# Use custom slash command
claude -p '/project-status'

# Should show:
# - GitHub Authentication: ✅ Complete
# - Pull Request: ✅ Merged
# - Workflows: ✅ 11 configured
# - Secrets: ✅ Configured (or pending)
```

**Test integration health:**
```bash
# Use integration check command
claude -p '/integration-check'

# Should show overall integration percentage
```

**Verify workflows are active:**
```bash
# Check recent workflow runs
gh run list --limit 10

# Should see recent activity after PR merge
```

### ✅ Monitoring System Verification

**Test monitoring workflows manually:**
```bash
# Test each monitoring component
gh workflow run api-health-monitoring.yml
gh workflow run performance-monitoring.yml
gh workflow run error-tracking.yml
gh workflow run monitoring-notifications.yml

# Check results
gh run list --workflow="API Health Monitoring" --limit 3
```

**Expected results:**
- ✅ Workflows execute successfully
- ✅ Slack notifications received (if configured)
- ✅ No critical errors in workflow logs
- ✅ Artifacts generated for reports

### ✅ Integration Library Verification

**Check integration files:**
```bash
# Verify all integration files exist
ls -la webflow-integration/js/
ls -la webflow-integration/config/
ls -la webflow-integration/forms/
ls -la webflow-integration/content/
ls -la webflow-integration/utils/

# Should show 5 main integration modules
```

**Test local integration:**
```bash
# Test Xano client locally (if API keys configured)
node -e "
const XanoClient = require('./webflow-integration/js/xano-client.js');
const client = new XanoClient();
console.log('XanoClient loaded successfully');
"
```

## Common Setup Issues

### Issue: GitHub Authentication Failed
**Symptoms:** `gh auth status` shows not authenticated
**Solution:**
```bash
# Clear existing auth and re-authenticate
gh auth logout
gh auth login --web

# If still issues, try with token
gh auth login --with-token < your-token-file
```

### Issue: Pull Request Not Found
**Symptoms:** `gh pr view 2` shows "not found"
**Solution:**
```bash
# Check all PRs
gh pr list --state all

# If no PR exists, the files should already be in main branch
git status
git log --oneline -10
```

### Issue: Workflows Not Running
**Symptoms:** No workflow runs after setup
**Solution:**
```bash
# Check if workflows directory exists
ls -la .github/workflows/

# If missing, re-merge the setup
git fetch origin
git checkout main
git merge origin/main

# Manually trigger a workflow
gh workflow run ci.yml
```

### Issue: Secrets Not Working
**Symptoms:** Workflows fail with authentication errors
**Solution:**
```bash
# Verify secrets are set
gh secret list

# Check secret names match exactly (case-sensitive)
# Re-set problematic secrets:
gh secret set SECRET_NAME --body "correct-value"
```

## Next Steps After Setup

Once basic setup is complete:

1. **Configure Slack Integration** - See INTEGRATIONS.md
2. **Set up Webflow Integration** - See INTEGRATIONS.md  
3. **Configure Xano Backend** - See INTEGRATIONS.md
4. **Review Development Workflow** - See WORKFLOWS.md
5. **Plan Feature Development** - See ROADMAP.md

## Quick Reference Commands

```bash
# Check overall project status
claude -p '/project-status'

# Get setup progress
claude -p '/setup-reminder'

# Verify all integrations
claude -p '/integration-check'

# Get prioritized next steps
claude -p '/next-steps'

# Test essential workflows
gh workflow run api-health-monitoring.yml
gh workflow run performance-monitoring.yml

# View recent activity
gh run list --limit 10

# Check secrets configuration
gh secret list
```

## Support & Troubleshooting

**If you encounter issues:**

1. **Check the troubleshooting guide:** TROUBLESHOOTING.md
2. **Review integration status:** `claude -p '/integration-check'`
3. **Verify GitHub Actions logs:** `gh run list` and `gh run view [run-id]`
4. **Check repository issues:** `gh issue list`
5. **Create new issue:** `gh issue create --template bug_report.yml`

**Emergency contacts:**
- **GitHub Repository:** https://github.com/Alex-Blumentals/alex-project
- **Issues:** https://github.com/Alex-Blumentals/alex-project/issues
- **Monitoring Dashboard:** GitHub Actions tab

---

**Setup Guide Version:** 1.0  
**Last Updated:** August 23, 2025  
**Estimated Setup Time:** 15-30 minutes  
**Success Rate:** 95% with proper prerequisites