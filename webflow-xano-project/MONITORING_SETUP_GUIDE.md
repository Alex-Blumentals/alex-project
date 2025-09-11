# 📊 Comprehensive Monitoring Setup Guide

Complete monitoring system for your Webflow + Xano stack with GitHub Actions integration.

## 🎯 Overview

This monitoring system provides:
- **Real-time notifications** for deployments and incidents
- **Automated health checks** for all API endpoints  
- **Performance monitoring** with Lighthouse audits
- **Error tracking** from multiple sources
- **Comprehensive alerting** via Slack, Discord, and GitHub

## 🚀 Quick Setup

### 1. Configure GitHub Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Required Secrets
```bash
# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Discord Integration (optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL

# Webflow Configuration
WEBFLOW_API_TOKEN=your-webflow-api-token
WEBFLOW_DEV_URL=https://dev-site.webflow.io
WEBFLOW_STAGING_URL=https://staging-site.webflow.io  
WEBFLOW_PRODUCTION_URL=https://your-site.com

# Xano Configuration
XANO_DEV_URL=https://x8ki-letl-twmt.n7c.xano.io/api:v1
XANO_STAGING_URL=https://staging-workspace.xano.io/api:v1
XANO_PRODUCTION_URL=https://production-workspace.xano.io/api:v1
XANO_PRODUCTION_API_KEY=your-xano-production-api-key

# Error Tracking (optional)
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-sentry-organization
SENTRY_PROJECT=your-sentry-project-name

# Custom Logging (optional)
APP_LOGS_ENDPOINT=https://your-custom-logs-api.com/logs
APP_LOGS_API_KEY=your-logs-api-key
```

### 2. Set Up Slack Integration

1. **Create Slack App:**
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name it "Monitoring Bot" and select your workspace

2. **Add Incoming Webhooks:**
   - Go to "Incoming Webhooks" → Toggle "Activate Incoming Webhooks"
   - Click "Add New Webhook to Workspace"
   - Select channels: `#alerts`, `#deployments`, `#monitoring`, `#performance`

3. **Configure Channels:**
   ```bash
   #alerts      - Critical issues, production failures
   #deployments - Deployment success/failure notifications  
   #monitoring  - Health checks, general monitoring
   #performance - Performance alerts and reports
   #security    - Security scan results
   ```

### 3. Enable Workflows

The following workflows are automatically configured:

- **📱 Monitoring & Notifications** (`monitoring-notifications.yml`)
  - Runs: Every 5 minutes, triggered by workflow completion
  - Purpose: Central notification hub for all monitoring events

- **🚀 Deployment Alerts** (`deployment-alerts.yml`) 
  - Runs: On deployment events
  - Purpose: Real-time deployment status tracking and alerting

- **🔍 API Health Monitoring** (`api-health-monitoring.yml`)
  - Runs: Every 5 minutes
  - Purpose: Continuous health checks for all API endpoints

- **⚡ Performance Monitoring** (`performance-monitoring.yml`)
  - Runs: Every 6 hours  
  - Purpose: Lighthouse audits and Core Web Vitals tracking

- **🔥 Error Tracking** (`error-tracking.yml`)
  - Runs: Hourly during business hours
  - Purpose: Collect and analyze errors from all sources

## 📊 Monitoring Features

### GitHub Actions Notifications
- **Workflow Status:** Success/failure notifications for all workflows
- **Severity-Based Routing:** Critical alerts go to #alerts, others to appropriate channels
- **Incident Creation:** Automatic GitHub issues for critical failures
- **Team Mentions:** Configurable team notifications for urgent issues

### Deployment Monitoring
- **Real-time Status:** Live deployment progress tracking
- **Health Checks:** Post-deployment verification
- **Rollback Triggers:** Automatic rollback for production failures  
- **Incident Management:** Structured incident response for failures

### API Health Checks
- **Multi-Environment:** Development, staging, production monitoring
- **Endpoint Coverage:** Health, auth, database, and custom endpoints
- **Response Time Tracking:** Performance metrics and thresholds
- **Availability Reporting:** Uptime statistics and SLA monitoring

### Performance Monitoring  
- **Lighthouse Audits:** Performance, accessibility, SEO, best practices
- **Core Web Vitals:** FCP, LCP, CLS, TTI metrics
- **Mobile/Desktop:** Separate monitoring for different form factors
- **Trend Analysis:** Historical performance tracking

### Error Tracking
- **Multi-Source:** Sentry, GitHub Actions, Xano, custom endpoints
- **Pattern Analysis:** Identify recurring error patterns
- **Alerting Thresholds:** Configurable error rate alerts
- **Trend Analysis:** Historical error analysis and reporting

## 🎛️ Configuration

### Alert Thresholds

You can customize alert thresholds by modifying the workflow files:

```yaml
# In api-health-monitoring.yml
alertThresholds:
  responseTime: 2000      # 2 seconds
  errorRate: 5           # 5%
  availability: 95       # 95%

# In performance-monitoring.yml
thresholds:
  performance: 80        # Lighthouse score
  accessibility: 90      # Accessibility score
  largestContentfulPaint: 2500  # LCP in milliseconds
  cumulativeLayoutShift: 0.1    # CLS score

# In error-tracking.yml
errorThresholds:
  criticalErrorRate: 5   # 5% error rate triggers critical alert
  highErrorCount: 50     # 50+ errors triggers high alert
  newErrorThreshold: 10  # 10+ new errors triggers medium alert
```

### Monitoring Schedules

Default monitoring frequencies:

```yaml
Health Checks:     Every 5 minutes
Performance:       Every 6 hours  
Error Tracking:    Every hour (business hours)
Daily Reports:     9 AM UTC
Weekly Summary:    Monday 9 AM UTC
```

Adjust schedules in the respective workflow files using cron expressions.

### Notification Channels

Configure notification routing in `monitoring-notifications.yml`:

```yaml
channels:
  critical:   "#alerts"
  high:       "#alerts, #deployments"  
  medium:     "#monitoring"
  low:        "#monitoring"
  security:   "#security"
  performance: "#performance"
```

## 📋 Alert Types

### Critical Alerts (🚨)
- Production deployment failures
- API health check failures (critical endpoints)
- Error rate > 5%
- Security vulnerabilities (high/critical)

### High Priority Alerts (⚠️)  
- Staging deployment failures
- Performance degradation (score < 60)
- Error rate > 1%
- High response times (> 5s)

### Medium Priority Alerts (ℹ️)
- Development environment issues
- Performance warnings (score < 80)
- New error patterns
- Dependency updates available

### Informational (📊)
- Successful deployments
- Daily/weekly reports
- Performance improvements
- Security scan completions

## 🔧 Troubleshooting

### Common Issues

**1. Slack notifications not working:**
```bash
# Check webhook URL format
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../X...

# Verify webhook permissions in Slack app settings
# Test webhook manually:
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Test message"}'
```

**2. Health checks failing:**
```bash
# Verify API endpoints are accessible
curl -I https://your-site.com/health

# Check API keys and authentication
# Review GitHub Actions logs for detailed error messages
```

**3. Performance monitoring issues:**
```bash
# Lighthouse may fail on password-protected sites
# Ensure sites are publicly accessible for monitoring
# Check Chrome/Puppeteer installation in workflows
```

**4. Error tracking not collecting data:**
```bash
# Verify Sentry integration:
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  https://sentry.io/api/0/projects/your-org/your-project/

# Check Xano API permissions for log access
# Verify custom log endpoints are accessible
```

### Debug Mode

Enable debug logging by adding this secret:
```bash
ACTIONS_RUNNER_DEBUG=true
```

### Manual Testing

Test individual monitoring components:

```bash
# Test health checks
gh workflow run api-health-monitoring.yml

# Test performance monitoring  
gh workflow run performance-monitoring.yml

# Test error tracking
gh workflow run error-tracking.yml

# Test deployment alerts
gh workflow run deployment-alerts.yml -f deployment_type=test
```

## 📈 Monitoring Dashboard

### Key Metrics to Track

1. **Availability Metrics:**
   - API uptime percentage
   - Mean time to recovery (MTTR)
   - Mean time between failures (MTBF)

2. **Performance Metrics:**
   - Average response times
   - Lighthouse scores
   - Core Web Vitals
   - Page load times

3. **Error Metrics:**
   - Error rate percentage
   - Error volume trends
   - Top error patterns
   - New error patterns

4. **Deployment Metrics:**
   - Deployment frequency
   - Deployment success rate
   - Time to deploy
   - Rollback frequency

### Reports Generated

- **Hourly:** Health check status, error alerts
- **Daily:** Performance report, error summary
- **Weekly:** Comprehensive monitoring report
- **On-demand:** Available via workflow dispatch

## 🔐 Security Considerations

### Secret Management
- Use GitHub encrypted secrets for all sensitive data
- Rotate API tokens regularly
- Limit API token permissions to minimum required
- Never commit secrets to repository

### Access Control
- Restrict workflow permissions
- Use least privilege principle for API access
- Monitor access logs for suspicious activity
- Regular security audits of monitoring setup

### Data Privacy
- Avoid logging sensitive user data in error tracking
- Implement data retention policies
- Use secure transmission (HTTPS) for all endpoints
- Anonymize user data in monitoring reports

## 🚀 Advanced Features

### Custom Metrics

Add custom metrics to monitoring:

```javascript
// In monitoring scripts
const customMetrics = {
  userRegistrations: await getUserCount(),
  activeUsers: await getActiveUserCount(),
  revenue: await getRevenueMetrics()
};

// Send to monitoring endpoint
await sendMetrics(customMetrics);
```

### Integration with External Tools

- **DataDog:** Send metrics via API
- **New Relic:** Custom event tracking
- **PagerDuty:** Incident management integration
- **StatusPage:** Public status page updates

### Automated Remediation

Implement automated fixes for common issues:

```yaml
# Example: Auto-restart service on health check failure
- name: Auto-restart on failure
  if: steps.health-check.outputs.status == 'critical'
  run: |
    # Restart service logic here
    curl -X POST $RESTART_ENDPOINT
```

## 📞 Support

### Getting Help

1. **Check workflow logs** in GitHub Actions tab
2. **Review error messages** in notification channels
3. **Test individual components** using manual workflow dispatch
4. **Verify configuration** of secrets and environment variables

### Maintenance

- **Monthly:** Review and update alert thresholds
- **Quarterly:** Audit monitoring coverage and effectiveness  
- **Annually:** Security audit of monitoring infrastructure
- **As needed:** Update monitoring based on application changes

---

## 🎉 You're All Set!

Your comprehensive monitoring system is now configured and ready to keep your Webflow + Xano stack running smoothly. The system will:

✅ **Monitor your APIs** 24/7 with health checks  
✅ **Track performance** with detailed Lighthouse audits  
✅ **Alert you instantly** when issues are detected  
✅ **Collect and analyze errors** from all sources  
✅ **Generate reports** to help you improve your system  

Your monitoring system will help you:
- **Prevent downtime** with proactive alerting
- **Improve performance** with detailed metrics  
- **Resolve issues faster** with comprehensive error tracking
- **Make data-driven decisions** with historical reports

**Happy monitoring!** 🚀