/**
 * Comprehensive Error Tracking and Logging System
 * 
 * This script provides centralized error collection, analysis, and reporting
 * for the Webflow + Xano stack including client-side and server-side errors.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ErrorTrackingSystem {
    constructor(config = {}) {
        this.config = {
            // Error sources configuration
            sources: {
                sentry: {
                    enabled: !!process.env.SENTRY_DSN,
                    dsn: process.env.SENTRY_DSN,
                    authToken: process.env.SENTRY_AUTH_TOKEN,
                    organization: process.env.SENTRY_ORG || 'your-org',
                    project: process.env.SENTRY_PROJECT || 'webflow-xano'
                },
                webflowLogs: {
                    enabled: !!process.env.WEBFLOW_API_TOKEN,
                    apiToken: process.env.WEBFLOW_API_TOKEN,
                    siteId: process.env.WEBFLOW_SITE_ID
                },
                xanoLogs: {
                    enabled: !!process.env.XANO_API_KEY,
                    apiKey: process.env.XANO_API_KEY,
                    workspaceId: process.env.XANO_WORKSPACE_ID,
                    baseUrl: process.env.XANO_PRODUCTION_URL || 'https://production-workspace.xano.io/api:v1'
                },
                githubActions: {
                    enabled: !!process.env.GITHUB_TOKEN,
                    token: process.env.GITHUB_TOKEN,
                    repository: process.env.GITHUB_REPOSITORY
                },
                customEndpoint: {
                    enabled: !!process.env.CUSTOM_LOG_ENDPOINT,
                    endpoint: process.env.CUSTOM_LOG_ENDPOINT,
                    apiKey: process.env.CUSTOM_LOG_API_KEY
                }
            },
            
            // Analysis configuration
            analysis: {
                timeWindow: '24h', // Last 24 hours
                errorThresholds: {
                    criticalErrorRate: 5, // % of total requests
                    highErrorCount: 50,   // Absolute number
                    newErrorThreshold: 10 // New unique errors
                },
                alertLevels: {
                    critical: ['Error Rate > 5%', 'Production Down', 'Security Incident'],
                    high: ['New Critical Error', 'Error Rate > 1%', 'Performance Degradation'],
                    medium: ['New Error Pattern', 'Increased Error Rate', 'Resource Issues'],
                    low: ['Minor Issues', 'Warnings', 'Info']
                }
            },
            
            // Output configuration
            output: {
                saveToFile: true,
                outputDir: './logs',
                generateReport: true,
                sendAlerts: true
            },
            
            ...config
        };

        this.results = {
            timestamp: new Date().toISOString(),
            timeWindow: this.config.analysis.timeWindow,
            sources: {},
            summary: {
                totalErrors: 0,
                uniqueErrors: 0,
                newErrors: 0,
                errorRate: 0,
                topErrors: [],
                errorsBySource: {},
                errorsByLevel: {},
                trends: {}
            },
            alerts: [],
            recommendations: []
        };
    }

    /**
     * Run comprehensive error tracking analysis
     */
    async runErrorAnalysis() {
        console.log('🔍 Starting error tracking analysis...');
        console.log(`Time window: ${this.config.analysis.timeWindow}`);

        const startTime = Date.now();

        // Collect errors from all enabled sources
        await this.collectFromAllSources();

        // Analyze collected errors
        this.analyzeErrors();

        // Generate alerts and recommendations
        this.generateAlertsAndRecommendations();

        const endTime = Date.now();
        console.log(`\n✅ Error analysis completed in ${endTime - startTime}ms`);
        console.log(`Total errors found: ${this.results.summary.totalErrors}`);
        console.log(`Unique errors: ${this.results.summary.uniqueErrors}`);
        console.log(`Alerts generated: ${this.results.alerts.length}`);

        return this.results;
    }

    /**
     * Collect errors from all enabled sources
     */
    async collectFromAllSources() {
        const sources = Object.keys(this.config.sources).filter(
            source => this.config.sources[source].enabled
        );

        console.log(`📊 Collecting errors from ${sources.length} sources...`);

        for (const sourceName of sources) {
            console.log(`  🔗 Collecting from ${sourceName}...`);
            
            try {
                const sourceData = await this.collectFromSource(sourceName);
                this.results.sources[sourceName] = sourceData;
                
                console.log(`    ✅ Found ${sourceData.errorCount} errors`);
                
            } catch (error) {
                console.error(`    ❌ Failed to collect from ${sourceName}:`, error.message);
                
                this.results.sources[sourceName] = {
                    status: 'error',
                    error: error.message,
                    errorCount: 0,
                    errors: []
                };
            }
        }
    }

    /**
     * Collect errors from a specific source
     */
    async collectFromSource(sourceName) {
        const config = this.config.sources[sourceName];
        
        switch (sourceName) {
            case 'sentry':
                return this.collectFromSentry(config);
            case 'webflowLogs':
                return this.collectFromWebflow(config);
            case 'xanoLogs':
                return this.collectFromXano(config);
            case 'githubActions':
                return this.collectFromGitHubActions(config);
            case 'customEndpoint':
                return this.collectFromCustomEndpoint(config);
            default:
                throw new Error(`Unknown source: ${sourceName}`);
        }
    }

    /**
     * Collect errors from Sentry
     */
    async collectFromSentry(config) {
        if (!config.authToken) {
            throw new Error('Sentry auth token not provided');
        }

        const response = await axios.get(
            `https://sentry.io/api/0/projects/${config.organization}/${config.project}/events/`,
            {
                headers: {
                    'Authorization': `Bearer ${config.authToken}`
                },
                params: {
                    statsPeriod: this.config.analysis.timeWindow,
                    per_page: 100,
                    sort: '-timestamp'
                }
            }
        );

        const errors = response.data.map(event => ({
            id: event.id,
            timestamp: new Date(event.dateCreated),
            level: event.level,
            message: event.title || event.message,
            culprit: event.culprit,
            platform: event.platform,
            environment: event.environment,
            user: event.user,
            tags: event.tags,
            fingerprint: event.fingerprint,
            count: event.count || 1,
            firstSeen: new Date(event.firstSeen),
            lastSeen: new Date(event.lastSeen),
            source: 'sentry'
        }));

        return {
            status: 'success',
            errorCount: errors.length,
            errors: errors,
            metadata: {
                organization: config.organization,
                project: config.project,
                timeWindow: this.config.analysis.timeWindow
            }
        };
    }

    /**
     * Collect errors from Webflow (if available through API)
     */
    async collectFromWebflow(config) {
        // Note: Webflow doesn't have a direct error logging API
        // This is a placeholder for custom error collection
        console.log('    ℹ️ Webflow error collection not implemented (no API available)');
        
        return {
            status: 'success',
            errorCount: 0,
            errors: [],
            metadata: {
                note: 'Webflow does not provide error logging API'
            }
        };
    }

    /**
     * Collect errors from Xano
     */
    async collectFromXano(config) {
        try {
            // Try to get logs from Xano API (if endpoint exists)
            const response = await axios.get(`${config.baseUrl}/logs/errors`, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`
                },
                params: {
                    since: this.getTimeWindowStart(),
                    limit: 100
                },
                timeout: 10000
            });

            const errors = response.data.map(log => ({
                id: log.id || `xano-${Date.now()}-${Math.random()}`,
                timestamp: new Date(log.timestamp),
                level: log.level || 'error',
                message: log.message,
                endpoint: log.endpoint,
                method: log.method,
                statusCode: log.statusCode,
                userAgent: log.userAgent,
                ip: log.ip,
                source: 'xano'
            }));

            return {
                status: 'success',
                errorCount: errors.length,
                errors: errors,
                metadata: {
                    workspace: config.workspaceId,
                    baseUrl: config.baseUrl
                }
            };

        } catch (error) {
            if (error.response?.status === 404) {
                console.log('    ℹ️ Xano error logging endpoint not available');
                return {
                    status: 'success',
                    errorCount: 0,
                    errors: [],
                    metadata: {
                        note: 'Xano error logging endpoint not found'
                    }
                };
            }
            throw error;
        }
    }

    /**
     * Collect errors from GitHub Actions
     */
    async collectFromGitHubActions(config) {
        const response = await axios.get(
            `https://api.github.com/repos/${config.repository}/actions/runs`,
            {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                params: {
                    status: 'failure',
                    per_page: 50,
                    created: `>=${this.getTimeWindowStart()}`
                }
            }
        );

        const errors = response.data.workflow_runs.map(run => ({
            id: `github-${run.id}`,
            timestamp: new Date(run.created_at),
            level: 'error',
            message: `Workflow failed: ${run.name}`,
            workflow: run.name,
            branch: run.head_branch,
            actor: run.actor.login,
            conclusion: run.conclusion,
            url: run.html_url,
            source: 'github-actions'
        }));

        return {
            status: 'success',
            errorCount: errors.length,
            errors: errors,
            metadata: {
                repository: config.repository,
                timeWindow: this.config.analysis.timeWindow
            }
        };
    }

    /**
     * Collect errors from custom endpoint
     */
    async collectFromCustomEndpoint(config) {
        const response = await axios.get(config.endpoint, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Accept': 'application/json'
            },
            params: {
                since: this.getTimeWindowStart(),
                level: 'error',
                limit: 100
            }
        });

        const errors = response.data.logs || response.data.errors || [];

        return {
            status: 'success',
            errorCount: errors.length,
            errors: errors.map(error => ({
                ...error,
                source: 'custom'
            })),
            metadata: {
                endpoint: config.endpoint
            }
        };
    }

    /**
     * Analyze collected errors
     */
    analyzeErrors() {
        console.log('\n📊 Analyzing collected errors...');

        const allErrors = [];
        const errorsBySource = {};
        const errorsByLevel = {};

        // Aggregate errors from all sources
        Object.entries(this.results.sources).forEach(([sourceName, sourceData]) => {
            if (sourceData.status === 'success') {
                allErrors.push(...sourceData.errors);
                errorsBySource[sourceName] = sourceData.errorCount;
            }
        });

        // Calculate basic metrics
        this.results.summary.totalErrors = allErrors.length;
        this.results.summary.errorsBySource = errorsBySource;

        // Group by error level
        allErrors.forEach(error => {
            const level = error.level || 'unknown';
            errorsByLevel[level] = (errorsByLevel[level] || 0) + 1;
        });
        this.results.summary.errorsByLevel = errorsByLevel;

        // Find unique errors (by message/fingerprint)
        const uniqueErrors = new Map();
        allErrors.forEach(error => {
            const key = error.fingerprint || error.message || error.id;
            if (!uniqueErrors.has(key)) {
                uniqueErrors.set(key, { ...error, count: 0 });
            }
            uniqueErrors.get(key).count++;
        });

        this.results.summary.uniqueErrors = uniqueErrors.size;

        // Get top errors by frequency
        this.results.summary.topErrors = Array.from(uniqueErrors.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Calculate error rate (if we have request data)
        this.calculateErrorRate(allErrors);

        // Identify new errors (in the last 24h but not seen before)
        this.identifyNewErrors(allErrors);

        // Analyze trends
        this.analyzeTrends(allErrors);

        console.log(`  📈 Analysis complete:`);
        console.log(`    Total: ${this.results.summary.totalErrors} errors`);
        console.log(`    Unique: ${this.results.summary.uniqueErrors} patterns`);
        console.log(`    New: ${this.results.summary.newErrors} new errors`);
        console.log(`    Error rate: ${this.results.summary.errorRate}%`);
    }

    /**
     * Calculate error rate
     */
    calculateErrorRate(errors) {
        // This would require request volume data
        // For now, we'll use a simplified calculation
        const totalRequests = this.estimateRequestVolume();
        
        if (totalRequests > 0) {
            this.results.summary.errorRate = Math.round(
                (errors.length / totalRequests) * 10000
            ) / 100; // Percentage with 2 decimal places
        } else {
            this.results.summary.errorRate = 0;
        }
    }

    /**
     * Estimate request volume (simplified)
     */
    estimateRequestVolume() {
        // This is a rough estimate - in production you'd want actual metrics
        const hoursInWindow = this.config.analysis.timeWindow === '24h' ? 24 : 1;
        const estimatedRequestsPerHour = 1000; // Adjust based on your traffic
        return hoursInWindow * estimatedRequestsPerHour;
    }

    /**
     * Identify new errors
     */
    identifyNewErrors(errors) {
        // For simplicity, consider errors from the last 6 hours as "new"
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        
        const newErrors = errors.filter(error => 
            new Date(error.timestamp) > sixHoursAgo
        );

        this.results.summary.newErrors = newErrors.length;
    }

    /**
     * Analyze error trends
     */
    analyzeTrends(errors) {
        const now = new Date();
        const hourlyBuckets = {};

        // Group errors by hour
        errors.forEach(error => {
            const hour = new Date(error.timestamp).getHours();
            hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1;
        });

        // Calculate trend
        const currentHour = now.getHours();
        const lastHour = currentHour === 0 ? 23 : currentHour - 1;
        
        const currentHourErrors = hourlyBuckets[currentHour] || 0;
        const lastHourErrors = hourlyBuckets[lastHour] || 0;

        let trend = 'stable';
        if (currentHourErrors > lastHourErrors * 1.5) {
            trend = 'increasing';
        } else if (currentHourErrors < lastHourErrors * 0.5) {
            trend = 'decreasing';
        }

        this.results.summary.trends = {
            hourly: hourlyBuckets,
            currentTrend: trend,
            currentHourErrors: currentHourErrors,
            lastHourErrors: lastHourErrors
        };
    }

    /**
     * Generate alerts and recommendations
     */
    generateAlertsAndRecommendations() {
        console.log('\n🚨 Generating alerts and recommendations...');

        const summary = this.results.summary;
        const thresholds = this.config.analysis.errorThresholds;

        // Check for critical conditions
        if (summary.errorRate > thresholds.criticalErrorRate) {
            this.createAlert('critical', 'High Error Rate', 
                `Error rate (${summary.errorRate}%) exceeds critical threshold (${thresholds.criticalErrorRate}%)`);
        }

        if (summary.totalErrors > thresholds.highErrorCount) {
            this.createAlert('high', 'High Error Count',
                `Total errors (${summary.totalErrors}) exceeds threshold (${thresholds.highErrorCount})`);
        }

        if (summary.newErrors > thresholds.newErrorThreshold) {
            this.createAlert('medium', 'Many New Errors',
                `New errors (${summary.newErrors}) exceeds threshold (${thresholds.newErrorThreshold})`);
        }

        // Check for trending issues
        if (summary.trends.currentTrend === 'increasing') {
            this.createAlert('medium', 'Increasing Error Trend',
                `Error rate is increasing: ${summary.trends.lastHourErrors} -> ${summary.trends.currentHourErrors} errors/hour`);
        }

        // Generate recommendations
        this.generateRecommendations();

        console.log(`  📋 Generated ${this.results.alerts.length} alerts`);
        console.log(`  💡 Generated ${this.results.recommendations.length} recommendations`);
    }

    /**
     * Create alert
     */
    createAlert(level, title, description) {
        const alert = {
            level: level,
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            severity: this.getAlertSeverity(level)
        };

        this.results.alerts.push(alert);
    }

    /**
     * Get alert severity score
     */
    getAlertSeverity(level) {
        const severityMap = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1
        };
        return severityMap[level] || 1;
    }

    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const summary = this.results.summary;

        // Error rate recommendations
        if (summary.errorRate > 1) {
            recommendations.push({
                type: 'error-rate',
                priority: 'high',
                title: 'Reduce Error Rate',
                description: 'Implement better error handling and validation',
                actions: [
                    'Review top error messages and fix root causes',
                    'Add input validation to prevent common errors',
                    'Implement retry logic for transient failures',
                    'Monitor API rate limits and handle gracefully'
                ]
            });
        }

        // Top errors recommendations
        if (summary.topErrors.length > 0) {
            const topError = summary.topErrors[0];
            recommendations.push({
                type: 'frequent-error',
                priority: 'high',
                title: `Address Most Frequent Error: ${topError.message}`,
                description: `This error occurred ${topError.count} times`,
                actions: [
                    'Investigate root cause of this specific error',
                    'Implement prevention measures',
                    'Add monitoring for early detection',
                    'Document solution for team knowledge'
                ]
            });
        }

        // Source-specific recommendations
        Object.entries(summary.errorsBySource).forEach(([source, count]) => {
            if (count > 20) {
                recommendations.push({
                    type: 'source-errors',
                    priority: 'medium',
                    title: `High Error Count from ${source}`,
                    description: `${source} generated ${count} errors`,
                    actions: [
                        `Review ${source} integration and error handling`,
                        'Check for service outages or configuration issues',
                        'Implement circuit breaker pattern if appropriate',
                        'Add source-specific monitoring and alerting'
                    ]
                });
            }
        });

        // New errors recommendations
        if (summary.newErrors > 5) {
            recommendations.push({
                type: 'new-errors',
                priority: 'medium',
                title: 'Multiple New Error Patterns Detected',
                description: `${summary.newErrors} new error patterns in recent hours`,
                actions: [
                    'Review recent deployments for potential causes',
                    'Check for changes in dependencies or external services',
                    'Implement rollback if errors are deployment-related',
                    'Add specific monitoring for new error patterns'
                ]
            });
        }

        // General monitoring recommendations
        if (this.results.alerts.length === 0) {
            recommendations.push({
                type: 'monitoring',
                priority: 'low',
                title: 'Maintain Current Error Levels',
                description: 'Error levels are within acceptable ranges',
                actions: [
                    'Continue monitoring for trend changes',
                    'Review and update error thresholds regularly',
                    'Conduct periodic error log analysis',
                    'Maintain error handling best practices'
                ]
            });
        }

        this.results.recommendations = recommendations;
    }

    /**
     * Generate report
     */
    generateReport() {
        const report = {
            title: 'Error Tracking and Analysis Report',
            timestamp: this.results.timestamp,
            timeWindow: this.results.timeWindow,
            summary: this.results.summary,
            alerts: this.results.alerts,
            recommendations: this.results.recommendations,
            sources: Object.keys(this.results.sources).map(source => ({
                name: source,
                status: this.results.sources[source].status,
                errorCount: this.results.sources[source].errorCount
            }))
        };

        return report;
    }

    /**
     * Save results to file
     */
    async saveResults(filePath) {
        if (!this.config.output.saveToFile) return;

        try {
            const reportData = {
                ...this.results,
                report: this.generateReport()
            };

            // Ensure output directory exists
            const outputDir = path.dirname(filePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            await fs.promises.writeFile(filePath, JSON.stringify(reportData, null, 2));
            console.log(`📄 Error tracking results saved to ${filePath}`);
        } catch (error) {
            console.error('Failed to save results:', error.message);
        }
    }

    /**
     * Get GitHub Actions output
     */
    getGitHubActionsOutput() {
        const output = {
            totalErrors: this.results.summary.totalErrors,
            uniqueErrors: this.results.summary.uniqueErrors,
            newErrors: this.results.summary.newErrors,
            errorRate: this.results.summary.errorRate,
            alertCount: this.results.alerts.length,
            criticalAlerts: this.results.alerts.filter(a => a.level === 'critical').length,
            status: this.determineOverallStatus()
        };

        // Set GitHub Actions outputs
        if (process.env.GITHUB_ACTIONS) {
            Object.entries(output).forEach(([key, value]) => {
                console.log(`::set-output name=${key}::${value}`);
            });

            // Create alert summary
            const alertSummary = this.results.alerts
                .map(alert => `${alert.level.toUpperCase()}: ${alert.title}`)
                .join('; ');
            
            console.log(`::set-output name=alert_summary::${alertSummary}`);

            // Set exit code for critical issues
            if (output.status === 'critical' || output.criticalAlerts > 0) {
                process.exit(1);
            }
        }

        return output;
    }

    /**
     * Determine overall status
     */
    determineOverallStatus() {
        if (this.results.alerts.some(a => a.level === 'critical')) {
            return 'critical';
        }
        if (this.results.alerts.some(a => a.level === 'high')) {
            return 'high';
        }
        if (this.results.alerts.length > 0) {
            return 'medium';
        }
        return 'good';
    }

    /**
     * Get time window start
     */
    getTimeWindowStart() {
        const now = new Date();
        const timeWindow = this.config.analysis.timeWindow;
        
        if (timeWindow.endsWith('h')) {
            const hours = parseInt(timeWindow);
            return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
        } else if (timeWindow.endsWith('d')) {
            const days = parseInt(timeWindow);
            return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
        }
        
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // Default 24h
    }
}

// CLI usage
if (require.main === module) {
    async function main() {
        const tracker = new ErrorTrackingSystem();
        
        try {
            const results = await tracker.runErrorAnalysis();
            
            // Save results
            const outputPath = process.argv[2] || 'error-tracking-results.json';
            await tracker.saveResults(outputPath);

            // Generate GitHub Actions output
            const githubOutput = tracker.getGitHubActionsOutput();
            
            console.log('\n📊 Final Error Tracking Summary:');
            console.log(`Status: ${githubOutput.status.toUpperCase()}`);
            console.log(`Total Errors: ${githubOutput.totalErrors}`);
            console.log(`Unique Errors: ${githubOutput.uniqueErrors}`);
            console.log(`New Errors: ${githubOutput.newErrors}`);
            console.log(`Error Rate: ${githubOutput.errorRate}%`);
            console.log(`Alerts: ${githubOutput.alertCount} (${githubOutput.criticalAlerts} critical)`);

        } catch (error) {
            console.error('❌ Error tracking failed:', error.message);
            process.exit(1);
        }
    }

    main();
}

module.exports = ErrorTrackingSystem;