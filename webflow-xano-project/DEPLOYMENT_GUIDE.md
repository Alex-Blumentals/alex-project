# Deployment Guide

This comprehensive guide covers deployment procedures, environment management, and operational best practices for the Webflow + Xano project.

## 🚀 Quick Start Deployment

### Prerequisites
1. **GitHub Repository Setup**
   - Repository with proper branch protection rules
   - All required secrets configured
   - GitHub Actions enabled

2. **Environment Preparation**
   - Webflow sites created (development, staging, production)
   - Xano workspaces configured (development, staging, production)
   - API keys and tokens generated

3. **Local Development Ready**
   - Node.js 18+ installed
   - Dependencies installed (`npm install`)
   - Environment variables configured

### Initial Setup
```bash
# 1. Clone and setup project
git clone [repository-url]
cd webflow-xano-project
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your actual values

# 3. Validate configuration
npm run dev
```

## 🌍 Environment Architecture

### Environment Flow
```
Development → Staging → Production
     ↓            ↓         ↓
  Feature      Develop    Main
  Branches     Branch    Branch
```

### Environment Details

#### Development Environment
- **Purpose**: Local development and feature testing
- **Branch**: Feature branches
- **Webflow**: Development site
- **Xano**: Development workspace
- **Deployment**: Manual (`npm run dev`)

#### Staging Environment  
- **Purpose**: Integration testing and preview
- **Branch**: `develop`
- **Webflow**: Staging site
- **Xano**: Staging workspace
- **Deployment**: Automatic on push to `develop`

#### Production Environment
- **Purpose**: Live application
- **Branch**: `main` 
- **Webflow**: Production site
- **Xano**: Production workspace
- **Deployment**: Manual approval required

## 🔄 Deployment Workflows

### 1. Feature Development Deployment

#### Process
1. Create feature branch from `develop`
2. Develop and test locally
3. Push changes (triggers CI workflow)
4. Create pull request to `develop`
5. Code review and approval
6. Merge to `develop` (triggers staging deployment)

#### Commands
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Develop and test
npm run dev
npm run test
npm run build

# Push and create PR
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR via GitHub UI
```

### 2. Staging Deployment

#### Automatic Trigger
- **When**: Push to `develop` branch
- **What**: Full staging deployment with testing
- **Duration**: ~5-10 minutes

#### Process
1. Pre-deployment validation
2. Xano staging backup
3. Build optimization
4. Webflow staging deployment
5. Xano schema sync
6. Post-deployment testing
7. Status notification

#### Manual Staging Deployment
```bash
# Via GitHub UI
Actions → Deploy to Staging → Run workflow

# Or via CLI (requires gh CLI)
gh workflow run deploy-staging.yml
```

### 3. Production Deployment

#### Manual Approval Process
1. **Validation Phase**
   - Comprehensive testing
   - Security audit
   - Build verification
   - Configuration validation

2. **Approval Gate**
   - Manual review required
   - Deployment reason documentation
   - Stakeholder approval

3. **Deployment Phase**
   - Production backup creation
   - Optimized build generation
   - Webflow production deployment
   - Xano production sync
   - Post-deployment verification

4. **Release Management**
   - Version tag creation
   - GitHub release generation
   - Rollback preparation

#### Production Deployment Steps
```bash
# 1. Merge to main (triggers production workflow)
git checkout main
git pull origin main
git merge develop
git push origin main

# 2. Monitor workflow and approve when prompted
# Go to GitHub Actions → Deploy to Production → Review and approve

# 3. Verify deployment
# Check production URL and functionality
```

## ⚙️ Environment Configuration

### Required Secrets Configuration

#### GitHub Repository Secrets
Navigate to `Settings` → `Secrets and variables` → `Actions`

```bash
# Webflow Configuration
WEBFLOW_API_TOKEN=wf_api_token_here
WEBFLOW_DEV_SITE_ID=dev_site_id_here
WEBFLOW_STAGING_SITE_ID=staging_site_id_here  
WEBFLOW_PRODUCTION_SITE_ID=prod_site_id_here

# Xano Configuration
XANO_WORKSPACE_ID=workspace_id_here
XANO_DEV_URL=https://dev-workspace.xano.com
XANO_DEV_API_KEY=dev_api_key_here
XANO_STAGING_URL=https://staging-workspace.xano.com
XANO_STAGING_API_KEY=staging_api_key_here
XANO_PRODUCTION_URL=https://prod-workspace.xano.com
XANO_PRODUCTION_API_KEY=prod_api_key_here
```

### Environment Validation
```bash
# Validate all environments
gh workflow run environment-management.yml -f action=validate-secrets

# Test connections
gh workflow run environment-management.yml -f action=test-connections

# Sync environment configurations
gh workflow run environment-management.yml -f action=sync-environments
```

## 🗄️ Backup and Recovery

### Backup Strategy

#### Automatic Backups
- **Staging**: Before every staging deployment
- **Production**: Before every production deployment
- **Scheduled**: Weekly comprehensive backups

#### Manual Backup Creation
```bash
# Create backup for specific environment
gh workflow run environment-management.yml -f action=create-backup -f environment=production

# Create backup for all environments
gh workflow run environment-management.yml -f action=create-backup
```

### Recovery Procedures

#### Staging Recovery
1. **Identify Issue**: Determine what needs to be restored
2. **Find Backup**: Locate appropriate backup file
3. **Restore Data**: Use Xano backup restore function
4. **Verify Recovery**: Test restored environment
5. **Update Team**: Notify team of recovery action

#### Production Recovery (CRITICAL)
1. **Assessment**: Quickly assess the scope of the issue
2. **Communication**: Notify stakeholders immediately
3. **Backup Selection**: Choose the most recent stable backup
4. **Restoration**: Execute recovery procedures
5. **Verification**: Comprehensive testing of restored environment
6. **Post-Recovery**: Document incident and improve procedures

#### Recovery Commands
```bash
# List available backups
npm run xano:sync list

# Restore from specific backup
npm run xano:sync restore backup-filename.json

# Emergency rollback (if supported)
git checkout previous-stable-commit
git push --force-with-lease origin main
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
**Symptoms**: Build process fails during CI or deployment
```bash
# Diagnose locally
npm run build
npm run test

# Check for issues
npm audit
npm outdated
```

**Solutions**:
- Update dependencies: `npm update`
- Fix linting errors: `npm run lint:fix`
- Resolve type errors: `npm run type-check`

#### 2. Environment Configuration Issues
**Symptoms**: API connection failures, missing configuration
```bash
# Validate environment setup
npm run xano:dev -- --health-check
node -e "console.log(require('./frontend/utils/env-config.js'))"
```

**Solutions**:
- Verify GitHub secrets are set correctly
- Check API key permissions and validity
- Confirm environment URLs are accessible

#### 3. Deployment Permission Issues
**Symptoms**: Deployment fails with authentication errors

**Solutions**:
- Verify API tokens have necessary permissions
- Check GitHub environment protection rules
- Confirm Webflow site access rights

#### 4. Post-Deployment Issues
**Symptoms**: Deployment succeeds but application doesn't work
```bash
# Check deployment health
curl -I https://your-site-url.com
npm run xano:dev -- --health-check --url=production-url
```

**Solutions**:
- Verify environment-specific configurations
- Check API endpoints are responding
- Review application logs and error reports

### Emergency Procedures

#### Critical Production Issue
1. **Immediate Actions**
   ```bash
   # Stop ongoing deployments
   gh run cancel [run-id]
   
   # Quick rollback if possible
   gh workflow run deploy-production.yml -f deployment_reason="Emergency rollback"
   ```

2. **Assessment and Communication**
   - Identify the scope of the issue
   - Notify stakeholders via established channels
   - Document the timeline of events

3. **Resolution**
   - Apply hotfix if possible
   - Restore from backup if necessary
   - Verify resolution thoroughly

#### Security Incident
1. **Immediate Response**
   - Rotate compromised API keys
   - Review access logs
   - Secure affected environments

2. **Investigation**
   - Run security scans
   - Check for data exposure
   - Document findings

3. **Remediation**
   - Apply security patches
   - Update security measures
   - Conduct post-incident review

## 📊 Monitoring and Maintenance

### Deployment Monitoring
- **GitHub Actions**: Monitor workflow success/failure rates
- **Environment Health**: Regular health checks via automated workflows
- **Performance Tracking**: Monitor deployment times and success rates
- **Error Tracking**: Review failed deployments and error patterns

### Regular Maintenance Tasks

#### Daily
- Review workflow execution results
- Monitor security scan outcomes
- Check for critical dependency updates

#### Weekly
- Review and merge dependency update PRs
- Verify backup integrity
- Check environment synchronization

#### Monthly
- Review and rotate API keys
- Update security documentation
- Conduct deployment process review
- Update dependencies and tools

### Performance Optimization

#### Build Optimization
```bash
# Analyze bundle size
npm run build
du -sh dist/

# Check for optimization opportunities
npm audit
npm outdated
```

#### Deployment Speed
- Use dependency caching (already configured)
- Optimize artifact sizes
- Parallelize independent tasks
- Monitor and reduce workflow execution time

## 📚 Best Practices

### Development Best Practices
1. **Feature Branch Workflow**: Always use feature branches
2. **Small, Frequent Commits**: Keep changes manageable
3. **Comprehensive Testing**: Test locally before pushing
4. **Documentation**: Update docs with significant changes

### Deployment Best Practices
1. **Staging First**: Always deploy to staging before production
2. **Off-Peak Deployments**: Schedule production deployments during low-traffic periods
3. **Rollback Readiness**: Always have a rollback plan
4. **Monitoring**: Watch deployments closely and be prepared to respond

### Security Best Practices
1. **Secret Management**: Never commit secrets to code
2. **Regular Updates**: Keep dependencies updated
3. **Access Control**: Limit deployment permissions
4. **Audit Trail**: Maintain logs of all deployment activities

### Communication Best Practices
1. **Deployment Notifications**: Keep team informed of deployments
2. **Issue Reporting**: Quickly communicate problems
3. **Documentation**: Keep deployment procedures updated
4. **Knowledge Sharing**: Share learnings from deployments and incidents

## 🔗 Additional Resources

### Project Documentation
- [README.md](./README.md) - Project overview and local setup
- [CLAUDE.md](./CLAUDE.md) - Development guidance and patterns
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Detailed environment configuration

### Workflow Documentation
- [GitHub Actions Workflows](./.github/workflows/README.md) - Comprehensive workflow documentation
- [Security Policy](./.github/SECURITY.md) - Security procedures and policies

### External Resources
- [Webflow API Documentation](https://developers.webflow.com/)
- [Xano Documentation](https://docs.xano.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Need Help?** 
- Check the troubleshooting section above
- Review workflow logs in GitHub Actions
- Run environment validation workflows
- Contact the development team