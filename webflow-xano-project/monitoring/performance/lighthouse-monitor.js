/**
 * Lighthouse Performance Monitor for Webflow Sites
 * 
 * This script runs comprehensive performance audits using Lighthouse
 * and generates detailed performance reports with alerting.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class WebflowPerformanceMonitor {
    constructor(config = {}) {
        this.config = {
            // URLs to monitor
            urls: [
                {
                    url: process.env.WEBFLOW_PRODUCTION_URL || 'https://your-site.com',
                    name: 'Homepage',
                    environment: 'production'
                },
                {
                    url: process.env.WEBFLOW_STAGING_URL || 'https://staging.your-site.com', 
                    name: 'Homepage Staging',
                    environment: 'staging'
                }
            ],
            
            // Performance thresholds
            thresholds: {
                performance: 80,
                accessibility: 90,
                bestPractices: 80,
                seo: 80,
                firstContentfulPaint: 2000,
                largestContentfulPaint: 2500,
                cumulativeLayoutShift: 0.1,
                timeToInteractive: 3000,
                speedIndex: 3000,
                totalBlockingTime: 300
            },
            
            // Lighthouse configuration
            lighthouse: {
                logLevel: 'info',
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
                formFactor: 'desktop',
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0
                }
            },
            
            // Chrome launch options
            chrome: {
                chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
            },
            
            // Run configuration
            runs: 3, // Number of lighthouse runs per URL
            outputDir: './reports',
            
            ...config
        };

        this.results = {
            timestamp: new Date().toISOString(),
            summary: {
                totalAudits: 0,
                passedAudits: 0,
                failedAudits: 0,
                averagePerformance: 0,
                overallStatus: 'unknown'
            },
            audits: [],
            alerts: []
        };
    }

    /**
     * Run performance monitoring for all configured URLs
     */
    async runPerformanceMonitoring() {
        console.log('🚀 Starting Webflow performance monitoring...');
        console.log(`Monitoring ${this.config.urls.length} URLs with ${this.config.runs} runs each`);

        // Ensure output directory exists
        if (!fs.existsSync(this.config.outputDir)) {
            fs.mkdirSync(this.config.outputDir, { recursive: true });
        }

        const startTime = Date.now();

        for (const urlConfig of this.config.urls) {
            console.log(`\n📊 Auditing ${urlConfig.name} (${urlConfig.url})...`);
            
            try {
                const auditResult = await this.auditUrl(urlConfig);
                this.results.audits.push(auditResult);
                this.results.summary.totalAudits++;

                if (auditResult.status === 'pass') {
                    this.results.summary.passedAudits++;
                } else {
                    this.results.summary.failedAudits++;
                }

            } catch (error) {
                console.error(`❌ Failed to audit ${urlConfig.name}:`, error.message);
                
                this.results.audits.push({
                    url: urlConfig.url,
                    name: urlConfig.name,
                    environment: urlConfig.environment,
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                
                this.results.summary.totalAudits++;
                this.results.summary.failedAudits++;
            }
        }

        const endTime = Date.now();
        this.calculateSummary();
        
        console.log(`\n✅ Performance monitoring completed in ${endTime - startTime}ms`);
        console.log(`Overall Status: ${this.results.summary.overallStatus.toUpperCase()}`);
        console.log(`Audits: ${this.results.summary.passedAudits}/${this.results.summary.totalAudits} passed`);
        
        return this.results;
    }

    /**
     * Audit a single URL with multiple runs
     */
    async auditUrl(urlConfig) {
        const runs = [];
        let chrome = null;

        try {
            // Launch Chrome
            chrome = await chromeLauncher.launch(this.config.chrome);
            
            // Run lighthouse multiple times
            for (let i = 0; i < this.config.runs; i++) {
                console.log(`  🔍 Run ${i + 1}/${this.config.runs}...`);
                
                const runResult = await this.runLighthouse(urlConfig.url, chrome.port);
                runs.push(runResult);
                
                // Wait between runs to avoid rate limiting
                if (i < this.config.runs - 1) {
                    await this.delay(2000);
                }
            }

        } finally {
            if (chrome) {
                await chrome.kill();
            }
        }

        // Calculate median values from multiple runs
        const medianResults = this.calculateMedianResults(runs);
        
        // Analyze results and create audit summary
        const auditResult = {
            url: urlConfig.url,
            name: urlConfig.name,
            environment: urlConfig.environment,
            timestamp: new Date().toISOString(),
            runs: runs.length,
            scores: medianResults.scores,
            metrics: medianResults.metrics,
            opportunities: medianResults.opportunities,
            diagnostics: medianResults.diagnostics,
            status: 'unknown',
            issues: [],
            recommendations: []
        };

        // Check against thresholds
        this.analyzeResults(auditResult);
        
        // Save detailed results
        await this.saveAuditResults(auditResult, runs);

        return auditResult;
    }

    /**
     * Run Lighthouse audit
     */
    async runLighthouse(url, port) {
        const options = {
            logLevel: this.config.lighthouse.logLevel,
            output: 'json',
            onlyCategories: this.config.lighthouse.onlyCategories,
            port: port
        };

        const config = {
            extends: 'lighthouse:default',
            settings: {
                formFactor: this.config.lighthouse.formFactor,
                throttling: this.config.lighthouse.throttling,
                screenEmulation: {
                    mobile: this.config.lighthouse.formFactor === 'mobile',
                    width: this.config.lighthouse.formFactor === 'mobile' ? 375 : 1350,
                    height: this.config.lighthouse.formFactor === 'mobile' ? 667 : 940,
                    deviceScaleFactor: this.config.lighthouse.formFactor === 'mobile' ? 2 : 1,
                    disabled: false
                }
            }
        };

        const runnerResult = await lighthouse(url, options, config);
        
        if (!runnerResult || !runnerResult.lhr) {
            throw new Error('Lighthouse failed to generate report');
        }

        const lhr = runnerResult.lhr;
        
        return {
            url: lhr.finalUrl,
            fetchTime: lhr.fetchTime,
            scores: {
                performance: Math.round(lhr.categories.performance.score * 100),
                accessibility: Math.round(lhr.categories.accessibility.score * 100),
                bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
                seo: Math.round(lhr.categories.seo.score * 100)
            },
            metrics: {
                firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue,
                largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue,
                cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.numericValue,
                timeToInteractive: lhr.audits['interactive']?.numericValue,
                speedIndex: lhr.audits['speed-index']?.numericValue,
                totalBlockingTime: lhr.audits['total-blocking-time']?.numericValue
            },
            opportunities: this.extractOpportunities(lhr),
            diagnostics: this.extractDiagnostics(lhr),
            rawReport: lhr
        };
    }

    /**
     * Calculate median results from multiple runs
     */
    calculateMedianResults(runs) {
        if (runs.length === 0) {
            throw new Error('No runs to calculate median from');
        }

        const median = (arr) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };

        return {
            scores: {
                performance: Math.round(median(runs.map(r => r.scores.performance))),
                accessibility: Math.round(median(runs.map(r => r.scores.accessibility))),
                bestPractices: Math.round(median(runs.map(r => r.scores.bestPractices))),
                seo: Math.round(median(runs.map(r => r.scores.seo)))
            },
            metrics: {
                firstContentfulPaint: Math.round(median(runs.map(r => r.metrics.firstContentfulPaint || 0))),
                largestContentfulPaint: Math.round(median(runs.map(r => r.metrics.largestContentfulPaint || 0))),
                cumulativeLayoutShift: Math.round(median(runs.map(r => r.metrics.cumulativeLayoutShift || 0)) * 1000) / 1000,
                timeToInteractive: Math.round(median(runs.map(r => r.metrics.timeToInteractive || 0))),
                speedIndex: Math.round(median(runs.map(r => r.metrics.speedIndex || 0))),
                totalBlockingTime: Math.round(median(runs.map(r => r.metrics.totalBlockingTime || 0)))
            },
            opportunities: this.mergeOpportunities(runs.map(r => r.opportunities)),
            diagnostics: this.mergeDiagnostics(runs.map(r => r.diagnostics))
        };
    }

    /**
     * Analyze results against thresholds
     */
    analyzeResults(auditResult) {
        const issues = [];
        const recommendations = [];

        // Check category scores
        Object.entries(auditResult.scores).forEach(([category, score]) => {
            const threshold = this.config.thresholds[category];
            if (score < threshold) {
                issues.push(`${category} score (${score}) below threshold (${threshold})`);
                recommendations.push(`Improve ${category} to meet minimum score of ${threshold}`);
            }
        });

        // Check Core Web Vitals
        const metrics = auditResult.metrics;
        
        if (metrics.firstContentfulPaint > this.config.thresholds.firstContentfulPaint) {
            issues.push(`FCP (${metrics.firstContentfulPaint}ms) exceeds threshold (${this.config.thresholds.firstContentfulPaint}ms)`);
            recommendations.push('Optimize resource loading to improve First Contentful Paint');
        }

        if (metrics.largestContentfulPaint > this.config.thresholds.largestContentfulPaint) {
            issues.push(`LCP (${metrics.largestContentfulPaint}ms) exceeds threshold (${this.config.thresholds.largestContentfulPaint}ms)`);
            recommendations.push('Optimize largest content element loading');
        }

        if (metrics.cumulativeLayoutShift > this.config.thresholds.cumulativeLayoutShift) {
            issues.push(`CLS (${metrics.cumulativeLayoutShift}) exceeds threshold (${this.config.thresholds.cumulativeLayoutShift})`);
            recommendations.push('Reduce layout shifts by specifying dimensions for images and ads');
        }

        if (metrics.totalBlockingTime > this.config.thresholds.totalBlockingTime) {
            issues.push(`TBT (${metrics.totalBlockingTime}ms) exceeds threshold (${this.config.thresholds.totalBlockingTime}ms)`);
            recommendations.push('Reduce JavaScript execution time');
        }

        // Determine overall status
        if (issues.length === 0) {
            auditResult.status = 'pass';
        } else if (issues.length <= 2) {
            auditResult.status = 'warning';
        } else {
            auditResult.status = 'fail';
        }

        auditResult.issues = issues;
        auditResult.recommendations = recommendations;

        // Create alerts for failures
        if (auditResult.status === 'fail' && auditResult.environment === 'production') {
            this.createAlert('performance_degradation', {
                url: auditResult.url,
                name: auditResult.name,
                issues: issues,
                scores: auditResult.scores
            });
        }
    }

    /**
     * Extract optimization opportunities from Lighthouse report
     */
    extractOpportunities(lhr) {
        const opportunities = [];
        
        Object.entries(lhr.audits).forEach(([auditId, audit]) => {
            if (audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0) {
                opportunities.push({
                    id: auditId,
                    title: audit.title,
                    description: audit.description,
                    potential: Math.round(audit.numericValue),
                    displayValue: audit.displayValue
                });
            }
        });

        return opportunities.sort((a, b) => b.potential - a.potential);
    }

    /**
     * Extract diagnostics from Lighthouse report
     */
    extractDiagnostics(lhr) {
        const diagnostics = [];
        
        const diagnosticAudits = [
            'uses-long-cache-ttl',
            'total-byte-weight',
            'unused-css-rules',
            'unused-javascript',
            'modern-image-formats',
            'offscreen-images',
            'render-blocking-resources'
        ];

        diagnosticAudits.forEach(auditId => {
            const audit = lhr.audits[auditId];
            if (audit && audit.score < 1) {
                diagnostics.push({
                    id: auditId,
                    title: audit.title,
                    description: audit.description,
                    score: audit.score,
                    displayValue: audit.displayValue
                });
            }
        });

        return diagnostics;
    }

    /**
     * Merge opportunities from multiple runs
     */
    mergeOpportunities(opportunitiesList) {
        const merged = {};
        
        opportunitiesList.forEach(opportunities => {
            opportunities.forEach(opp => {
                if (!merged[opp.id]) {
                    merged[opp.id] = { ...opp, potential: [] };
                }
                merged[opp.id].potential.push(opp.potential);
            });
        });

        return Object.values(merged).map(opp => ({
            ...opp,
            potential: Math.round(opp.potential.reduce((sum, val) => sum + val, 0) / opp.potential.length)
        })).sort((a, b) => b.potential - a.potential);
    }

    /**
     * Merge diagnostics from multiple runs
     */
    mergeDiagnostics(diagnosticsList) {
        const merged = {};
        
        diagnosticsList.forEach(diagnostics => {
            diagnostics.forEach(diag => {
                if (!merged[diag.id]) {
                    merged[diag.id] = { ...diag, score: [] };
                }
                merged[diag.id].score.push(diag.score);
            });
        });

        return Object.values(merged).map(diag => ({
            ...diag,
            score: Math.round((diag.score.reduce((sum, val) => sum + val, 0) / diag.score.length) * 100) / 100
        }));
    }

    /**
     * Calculate overall summary
     */
    calculateSummary() {
        if (this.results.audits.length === 0) {
            this.results.summary.overallStatus = 'unknown';
            return;
        }

        // Calculate average performance score
        const performanceScores = this.results.audits
            .filter(audit => audit.scores && audit.scores.performance)
            .map(audit => audit.scores.performance);
        
        if (performanceScores.length > 0) {
            this.results.summary.averagePerformance = Math.round(
                performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length
            );
        }

        // Determine overall status
        const failedAudits = this.results.audits.filter(audit => audit.status === 'fail').length;
        const warningAudits = this.results.audits.filter(audit => audit.status === 'warning').length;
        
        if (failedAudits > 0) {
            this.results.summary.overallStatus = 'fail';
        } else if (warningAudits > 0) {
            this.results.summary.overallStatus = 'warning';
        } else {
            this.results.summary.overallStatus = 'pass';
        }
    }

    /**
     * Create alert for monitoring issues
     */
    createAlert(type, details) {
        const alert = {
            type: type,
            severity: this.getAlertSeverity(type),
            timestamp: new Date().toISOString(),
            details: details,
            message: this.getAlertMessage(type, details)
        };

        this.results.alerts.push(alert);
        console.log(`  ⚠️ ALERT: ${alert.message}`);
    }

    /**
     * Get alert severity
     */
    getAlertSeverity(type) {
        switch (type) {
            case 'performance_degradation': return 'high';
            case 'accessibility_failure': return 'medium';
            case 'seo_issues': return 'low';
            default: return 'medium';
        }
    }

    /**
     * Get alert message
     */
    getAlertMessage(type, details) {
        switch (type) {
            case 'performance_degradation':
                return `Performance degradation detected for ${details.name}: ${details.issues.length} issues found`;
            default:
                return `Performance alert: ${type}`;
        }
    }

    /**
     * Save audit results to files
     */
    async saveAuditResults(auditResult, runs) {
        try {
            const filename = `${auditResult.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
            
            // Save summary
            const summaryPath = path.join(this.config.outputDir, `${filename}-summary.json`);
            await fs.promises.writeFile(summaryPath, JSON.stringify(auditResult, null, 2));
            
            // Save detailed runs
            const detailedPath = path.join(this.config.outputDir, `${filename}-detailed.json`);
            await fs.promises.writeFile(detailedPath, JSON.stringify(runs, null, 2));
            
            console.log(`  💾 Results saved to ${summaryPath}`);
            
        } catch (error) {
            console.error('Failed to save audit results:', error.message);
        }
    }

    /**
     * Generate performance report
     */
    generateReport() {
        return {
            title: 'Webflow Performance Monitoring Report',
            timestamp: this.results.timestamp,
            summary: this.results.summary,
            audits: this.results.audits.map(audit => ({
                name: audit.name,
                url: audit.url,
                environment: audit.environment,
                status: audit.status,
                scores: audit.scores,
                metrics: audit.metrics,
                issues: audit.issues,
                recommendations: audit.recommendations
            })),
            alerts: this.results.alerts
        };
    }

    /**
     * Save complete results
     */
    async saveResults(filePath) {
        try {
            const reportData = {
                ...this.results,
                report: this.generateReport()
            };

            await fs.promises.writeFile(filePath, JSON.stringify(reportData, null, 2));
            console.log(`📄 Performance monitoring results saved to ${filePath}`);
        } catch (error) {
            console.error('Failed to save results:', error.message);
        }
    }

    /**
     * Get GitHub Actions output
     */
    getGitHubActionsOutput() {
        const output = {
            status: this.results.summary.overallStatus,
            totalAudits: this.results.summary.totalAudits,
            passedAudits: this.results.summary.passedAudits,
            failedAudits: this.results.summary.failedAudits,
            averagePerformance: this.results.summary.averagePerformance,
            alertCount: this.results.alerts.length
        };

        // Set GitHub Actions outputs
        if (process.env.GITHUB_ACTIONS) {
            console.log(`::set-output name=status::${output.status}`);
            console.log(`::set-output name=total_audits::${output.totalAudits}`);
            console.log(`::set-output name=passed_audits::${output.passedAudits}`);
            console.log(`::set-output name=failed_audits::${output.failedAudits}`);
            console.log(`::set-output name=average_performance::${output.averagePerformance}`);
            console.log(`::set-output name=alert_count::${output.alertCount}`);

            // Create issues summary for failed audits
            const failedAudits = this.results.audits
                .filter(audit => audit.status === 'fail')
                .map(audit => `${audit.name}: ${audit.issues.join(', ')}`);
            
            console.log(`::set-output name=failed_issues::${failedAudits.join('; ')}`);

            // Set exit code for failures
            if (output.status === 'fail') {
                process.exit(1);
            }
        }

        return output;
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI usage
if (require.main === module) {
    async function main() {
        const monitor = new WebflowPerformanceMonitor();
        
        try {
            const results = await monitor.runPerformanceMonitoring();
            
            // Save results
            const outputPath = process.argv[2] || 'performance-results.json';
            await monitor.saveResults(outputPath);

            // Generate GitHub Actions output
            const githubOutput = monitor.getGitHubActionsOutput();
            
            console.log('\n📊 Final Performance Summary:');
            console.log(`Status: ${githubOutput.status.toUpperCase()}`);
            console.log(`Audits: ${githubOutput.passedAudits}/${githubOutput.totalAudits} passed`);
            console.log(`Average Performance Score: ${githubOutput.averagePerformance}/100`);
            console.log(`Alerts: ${githubOutput.alertCount}`);

        } catch (error) {
            console.error('❌ Performance monitoring failed:', error.message);
            process.exit(1);
        }
    }

    main();
}

module.exports = WebflowPerformanceMonitor;