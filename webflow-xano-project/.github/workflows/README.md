# GitHub Actions Workflows Documentation

This directory contains comprehensive GitHub Actions workflows for the Webflow + Xano project, providing CI/CD, security scanning, dependency management, and environment synchronization.

## 🚀 Available Workflows

### 1. CI/CD Pipeline (`ci.yml`)
**Triggers**: Pull requests and pushes to `main`/`develop` branches

**Purpose**: Continuous integration and quality assurance
- **Lint & Format Check**: ESLint and Prettier validation
- **Testing**: Multi-version Node.js testing (16, 18, 20)
- **Configuration Validation**: Webflow and Xano config validation
- **Build Verification**: Production build testing
- **Security Audit**: npm audit for vulnerabilities

**Key Features**:
- Parallel job execution for performance
- Artifact collection for test results and builds
- Comprehensive status reporting
- Automatic failure handling

### 2. Staging Deployment (`deploy-staging.yml`)
**Triggers**: Pushes to `develop` branch, manual dispatch

**Purpose**: Automated staging deployment with safety checks
- **Pre-deployment Validation**: Tests and build verification
- **Xano Backup**: Automatic staging data backup
- **Webflow Deployment**: Staging site deployment
- **Xano Sync**: Database schema synchronization
- **Post-deployment Testing**: Health checks and verification

**Key Features**:
- Force deployment option for emergencies
- Automatic PR comments with deployment status
- Rollback preparation and documentation
- Environment-specific configuration management

### 3. Production Deployment (`deploy-production.yml`)
**Triggers**: Pushes to `main` branch, manual dispatch

**Purpose**: Secure production deployment with approvals
- **Production Readiness Validation**: Comprehensive testing
- **Manual Approval Gate**: Required approval for production changes
- **Production Backup**: Complete data backup before deployment
- **Deployment Execution**: Webflow and Xano production updates
- **Release Management**: Automatic GitHub releases and tagging

**Key Features**:
- Multi-stage approval process
- Comprehensive backup and rollback procedures
- Release documentation generation
- Post-deployment verification and monitoring

### 4. Environment Management (`environment-management.yml`)
**Triggers**: Manual dispatch, daily schedule (2 AM UTC)

**Purpose**: Environment configuration and synchronization
- **Secret Validation**: Verify all required secrets are configured
- **Connection Testing**: Test Webflow and Xano API connectivity
- **Environment Sync**: Synchronize configurations across environments
- **Backup Management**: Create and manage environment backups
- **Template Generation**: Auto-generate .env.example and documentation

**Key Features**:
- Multi-environment support (dev/staging/production)
- Dry-run mode for safe testing
- Automatic documentation updates
- Health monitoring and reporting

### 5. Security Scanning (`security-scanning.yml`)
**Triggers**: Pushes, pull requests, daily schedule (3 AM UTC), manual dispatch

**Purpose**: Comprehensive security analysis
- **Dependency Scanning**: npm audit for vulnerabilities
- **Secret Detection**: Scan for hardcoded secrets and API keys
- **Code Quality Analysis**: ESLint security rules and bundle analysis
- **License Compliance**: Check for problematic licenses

**Key Features**:
- Multiple scan types (full, dependencies, secrets, code-quality)
- Automatic issue creation for security findings
- Comprehensive reporting and artifact collection
- Integration with GitHub security alerts

### 6. Dependency Updates (`dependency-updates.yml`)
**Triggers**: Weekly schedule (Mondays 5 AM UTC), manual dispatch

**Purpose**: Automated dependency management
- **Security Updates**: Automatic vulnerability fixes
- **Minor Updates**: Compatible version updates
- **Major Updates**: Analysis and issue creation for breaking changes
- **Automated PRs**: Create pull requests for updates

**Key Features**:
- Selective update types (security, minor, major, all)
- Auto-merge option for security fixes
- Breaking change detection
- Comprehensive testing before updates

## 🔧 Setup Instructions

### Required GitHub Secrets

Add these secrets to your repository (`Settings` → `Secrets and variables` → `Actions`):

#### Webflow Secrets
```
WEBFLOW_API_TOKEN          # Your Webflow API token
WEBFLOW_DEV_SITE_ID        # Development site ID
WEBFLOW_STAGING_SITE_ID    # Staging site ID  
WEBFLOW_PRODUCTION_SITE_ID # Production site ID
```

#### Xano Secrets
```
XANO_WORKSPACE_ID          # Your Xano workspace ID
XANO_DEV_URL              # Development environment URL
XANO_DEV_API_KEY          # Development API key
XANO_STAGING_URL          # Staging environment URL
XANO_STAGING_API_KEY      # Staging API key
XANO_PRODUCTION_URL       # Production environment URL
XANO_PRODUCTION_API_KEY   # Production API key
```

### Environment Setup

1. **Branch Protection Rules**
   ```bash
   # Main branch protection (set via GitHub UI)
   - Require pull request reviews (1 reviewer)
   - Require status checks to pass
   - Require branches to be up to date
   - Restrict pushes to matching branches
   ```

2. **GitHub Environments**
   Create these environments in repository settings:
   - `staging`: Auto-deployment from develop branch
   - `production`: Requires manual approval
   - `production-approval`: Approval gate for production deployments

3. **Local Development**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Fill in your actual values
   vim .env
   
   # Install dependencies
   npm install
   
   # Start development servers
   npm run dev
   ```

### Workflow Permissions

Ensure the repository has these permissions configured:
- Actions: Read and write
- Contents: Write (for tagging and releases)
- Issues: Write (for security issue creation)
- Pull requests: Write (for automated PRs)
- Security events: Write (for security scanning)

## 🔄 Workflow Triggers and Interactions

### Development Flow
1. **Feature Development**: Work on feature branches
2. **Pull Request**: Triggers CI workflow
3. **Merge to Develop**: Triggers staging deployment
4. **Merge to Main**: Triggers production deployment (with approval)

### Automated Maintenance
- **Daily**: Environment validation and security scanning
- **Weekly**: Dependency updates and vulnerability checks
- **On-demand**: Manual environment management and backups

### Security Response
- **Immediate**: Critical vulnerability detection creates issues
- **Daily**: Comprehensive security scans
- **Automatic**: Security fix PRs with optional auto-merge

## 📊 Monitoring and Reporting

### Workflow Status
- **GitHub Actions Tab**: View all workflow runs and statuses
- **Pull Request Checks**: Required status checks for PRs
- **Release Notes**: Automatic release documentation
- **Security Alerts**: GitHub security tab integration

### Notifications
- **Email**: GitHub will send notifications for workflow failures
- **Issues**: Automatic issue creation for security findings
- **PR Comments**: Deployment status updates on pull requests
- **Releases**: Automatic release creation for production deployments

### Artifacts and Reports
- **Test Results**: Stored for 5 days
- **Build Artifacts**: Stored for 7 days  
- **Security Reports**: Stored for 30 days
- **Dependency Analysis**: Stored for 30 days

## 🚨 Troubleshooting

### Common Issues

1. **Secret Not Found Errors**
   - Verify all required secrets are configured
   - Run Environment Management workflow to validate

2. **Deployment Failures**
   - Check API key permissions and validity
   - Verify environment URLs are accessible
   - Review Webflow site permissions

3. **Test Failures**
   - Ensure all dependencies are compatible
   - Check for breaking changes in updates
   - Verify environment configuration

4. **Security Scan Issues**
   - Review and address flagged vulnerabilities
   - Check for accidentally committed secrets
   - Update dependencies to resolve CVEs

### Getting Help

1. **Workflow Logs**: Check the detailed logs in GitHub Actions
2. **Environment Validation**: Run the environment management workflow
3. **Manual Testing**: Use local development commands to debug
4. **Documentation**: Review project CLAUDE.md and README files

## 🔒 Security Best Practices

### Secret Management
- Never commit secrets to the repository
- Use GitHub secrets for all sensitive data
- Regularly rotate API keys and tokens
- Monitor secret usage in workflow logs

### Access Control
- Limit repository access to necessary personnel
- Use branch protection rules
- Require code reviews for sensitive changes
- Monitor workflow execution and modifications

### Vulnerability Management
- Enable Dependabot security updates
- Review security scan results promptly
- Keep dependencies updated
- Monitor security advisories for used packages

### Deployment Security
- Use manual approval for production deployments
- Create backups before major changes
- Implement rollback procedures
- Monitor production deployments closely

## 📈 Workflow Optimization

### Performance Tips
- Use caching for dependencies (already configured)
- Run jobs in parallel where possible
- Use appropriate runners for workloads
- Optimize artifact storage and retention

### Cost Management
- Set appropriate artifact retention periods
- Use matrix strategies efficiently
- Monitor workflow execution time
- Optimize trigger conditions to avoid unnecessary runs

### Maintenance
- Regularly review and update workflow versions
- Monitor workflow reliability and success rates
- Update Node.js versions as needed
- Review and optimize security scanning frequency