# Environment Variables & GitHub Secrets Configuration Checklist

This comprehensive checklist covers all environment variables and GitHub secrets required for your Webflow + Xano deployment pipeline.

## 🔐 GitHub Repository Secrets Configuration

Navigate to: **Repository Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. Webflow Secrets (Required)

#### Core Webflow Configuration
```bash
WEBFLOW_API_TOKEN
# Description: Your Webflow API token (shared across all environments)
# How to get: Webflow Dashboard → Account Settings → API Access → Generate Token
# Permissions needed: Read/Write access to sites
# Example: wf_abc123def456789...
```

#### Environment-Specific Site IDs
```bash
WEBFLOW_DEV_SITE_ID
# Description: Development site ID
# How to get: From Webflow site URL or Site Settings
# Example: 507f1f77bcf86cd799439011

WEBFLOW_STAGING_SITE_ID  
# Description: Staging site ID
# How to get: From Webflow site URL or Site Settings
# Example: 507f1f77bcf86cd799439012

WEBFLOW_PRODUCTION_SITE_ID
# Description: Production site ID
# How to get: From Webflow site URL or Site Settings  
# Example: 507f1f77bcf86cd799439013
```

### 2. Xano Secrets (Required)

#### Core Xano Configuration
```bash
XANO_WORKSPACE_ID
# Description: Your Xano workspace ID (shared across all instances)
# How to get: Xano Dashboard URL → Extract workspace ID
# Example: 12345 (numeric ID from URL)
```

#### Development Environment
```bash
XANO_DEV_URL
# Description: Development Xano instance URL
# How to get: Xano Dashboard → Instance Settings → API Base URL
# Example: https://x8ki-letl-twmt.n7c.xano.io

XANO_DEV_API_KEY
# Description: Development API key
# How to get: Xano Dashboard → Authentication → API Keys → Generate
# Permissions: Full database access for development
# Example: xano_dev_abc123def456...
```

#### Staging Environment
```bash
XANO_STAGING_URL
# Description: Staging Xano instance URL
# How to get: Xano Dashboard → Instance Settings → API Base URL
# Example: https://x8ki-letl-staging.n7c.xano.io

XANO_STAGING_API_KEY
# Description: Staging API key
# How to get: Xano Dashboard → Authentication → API Keys → Generate
# Permissions: Full database access for staging
# Example: xano_staging_abc123def456...
```

#### Production Environment
```bash
XANO_PRODUCTION_URL
# Description: Production Xano instance URL
# How to get: Xano Dashboard → Instance Settings → API Base URL
# Example: https://x8ki-letl-prod.n7c.xano.io

XANO_PRODUCTION_API_KEY
# Description: Production API key
# How to get: Xano Dashboard → Authentication → API Keys → Generate
# Permissions: Full database access for production
# Example: xano_prod_abc123def456...
```

### 3. GitHub Integration (Automatic)

These are automatically provided by GitHub - **DO NOT CREATE MANUALLY**:

```bash
GITHUB_TOKEN
# Description: Automatic GitHub token for workflow actions
# Permissions: Automatically scoped to repository
# Used for: Creating PRs, releases, issues, comments
```

## 🌍 Local Development Environment Variables

Create a `.env` file in your project root:

```bash
# Copy from template
cp .env.example .env
```

### Required Local Environment Variables

```bash
# Environment identifier
NODE_ENV=development

# Webflow Configuration (for local development)
WEBFLOW_SITE_ID=your_dev_site_id_here
WEBFLOW_API_TOKEN=your_webflow_api_token_here

# Xano Configuration (for local development)
XANO_WORKSPACE_ID=your_workspace_id_here
XANO_DEV_URL=https://your-dev-instance.xano.io
XANO_DEV_API_KEY=your_dev_api_key_here

# Development Settings
HOT_RELOAD=true
DEV_PORT=3000
```

## 📋 Secret Configuration Validation

### Validation Checklist

Use this checklist to ensure all secrets are configured correctly:

#### ✅ Webflow Secrets
- [ ] `WEBFLOW_API_TOKEN` - Valid API token with site access
- [ ] `WEBFLOW_DEV_SITE_ID` - Development site ID
- [ ] `WEBFLOW_STAGING_SITE_ID` - Staging site ID
- [ ] `WEBFLOW_PRODUCTION_SITE_ID` - Production site ID

#### ✅ Xano Secrets
- [ ] `XANO_WORKSPACE_ID` - Numeric workspace ID
- [ ] `XANO_DEV_URL` - Development instance URL (starts with https://)
- [ ] `XANO_DEV_API_KEY` - Development API key
- [ ] `XANO_STAGING_URL` - Staging instance URL
- [ ] `XANO_STAGING_API_KEY` - Staging API key
- [ ] `XANO_PRODUCTION_URL` - Production instance URL
- [ ] `XANO_PRODUCTION_API_KEY` - Production API key

### Automated Validation

Run the environment validation workflow to check all secrets:

```bash
# Via GitHub UI
Go to Actions → Environment Management → Run workflow
Select: "validate-secrets"

# Via GitHub CLI
gh workflow run environment-management.yml -f action=validate-secrets
```

## 🔧 How to Obtain Each Credential

### Webflow API Token

1. **Login to Webflow**
2. **Account Settings** → **Integrations** → **API Access**
3. **Generate API Token**
4. **Copy the token** (starts with `wf_`)
5. **Set permissions**: Read/Write access to your sites

### Webflow Site IDs

**Method 1 - From URL:**
```
https://webflow.com/design/your-site-name
Site ID is in the URL after /design/
```

**Method 2 - From Site Settings:**
1. Open site in Webflow Designer
2. **Site Settings** → **General**
3. **Site ID** is displayed in the settings

**Method 3 - From API:**
```bash
curl -X GET https://api.webflow.com/sites \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Xano Workspace ID

**From Dashboard URL:**
```
https://app.xano.com/workspace/12345/...
The number after /workspace/ is your workspace ID
```

### Xano Instance URLs

1. **Login to Xano**
2. **Go to your workspace**
3. **API** → **Settings** → **Instance**
4. **Copy Base URL** (e.g., `https://x8ki-letl-twmt.n7c.xano.io`)

### Xano API Keys

1. **Login to Xano**
2. **Go to your workspace**
3. **Authentication** → **API Keys**
4. **Add API Key**
5. **Set permissions** based on environment:
   - **Development**: Full access for testing
   - **Staging**: Full access for integration testing
   - **Production**: Minimal required permissions

## 🔒 Security Best Practices

### Secret Management Guidelines

#### ✅ DO
- Use unique API keys for each environment
- Regularly rotate API keys (quarterly recommended)
- Use GitHub secrets for all sensitive data
- Test secrets in staging before production
- Document secret purposes and permissions

#### ❌ DON'T
- Never commit secrets to code
- Don't share production keys with development
- Avoid using the same key across environments
- Don't include secrets in PR descriptions or issues
- Never log or expose secrets in application output

### Secret Rotation Schedule

```bash
# Recommended rotation schedule:
Webflow API Token: Every 6 months
Xano Development Keys: Every 3 months
Xano Staging Keys: Every 3 months  
Xano Production Keys: Every 1 month (high security)
```

### Permission Guidelines

#### Webflow API Token Permissions
- **Required**: Read/Write access to sites
- **Optional**: CMS access (if using dynamic content)
- **Avoid**: Account-level permissions unless necessary

#### Xano API Key Permissions
- **Development**: Full database access + admin functions
- **Staging**: Full database access (limited admin)
- **Production**: Minimal required permissions only

## 🚨 Troubleshooting

### Common Issues and Solutions

#### "Secret not found" Error
```bash
# Check if secret exists in GitHub repository settings
# Verify secret name matches exactly (case-sensitive)
# Ensure secret has a value (not empty)
```

#### "Invalid API key" Error
```bash
# Verify API key is still valid in source platform
# Check key permissions match workflow requirements
# Test key manually with curl/Postman
```

#### "Site not found" Error
```bash
# Verify Webflow site ID is correct
# Check API token has access to the specific site
# Ensure site is published and accessible
```

#### "Connection timeout" Error
```bash
# Verify Xano instance URL is correct
# Check if instance is running and accessible
# Validate network connectivity from GitHub Actions
```

### Emergency Procedures

#### Compromised Secret
1. **Immediately revoke** the compromised secret in source platform
2. **Generate new secret** with different value
3. **Update GitHub secret** with new value
4. **Test workflows** to ensure functionality
5. **Monitor logs** for any suspicious activity

#### Production Access Issue
1. **Use staging environment** for immediate testing
2. **Verify all secrets** are correctly configured
3. **Run validation workflow** to identify issues
4. **Contact platform support** if API issues persist

## 📞 Support Resources

### Platform Documentation
- **Webflow API**: https://developers.webflow.com/
- **Xano API**: https://docs.xano.com/api-reference
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets

### Validation Commands
```bash
# Test Webflow connection
curl -H "Authorization: Bearer $WEBFLOW_API_TOKEN" \
  https://api.webflow.com/sites/$WEBFLOW_SITE_ID

# Test Xano connection  
curl -H "Authorization: Bearer $XANO_API_KEY" \
  $XANO_URL/api/health

# Validate environment setup
npm run xano:dev -- --health-check
```

---

## ✅ Final Checklist

Before deploying, ensure:

- [ ] All 10 GitHub secrets are configured
- [ ] Local .env file is set up for development
- [ ] Environment validation workflow passes
- [ ] Test connections to both Webflow and Xano succeed
- [ ] Branch protection rules are enabled
- [ ] GitHub environments (staging, production) are created
- [ ] Team members have appropriate repository access

**Status**: Ready for deployment once all items are checked! 🚀