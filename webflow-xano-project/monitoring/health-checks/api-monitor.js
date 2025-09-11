/**
 * Comprehensive API Health Monitor for Xano Endpoints
 * 
 * This script provides comprehensive health monitoring for Xano API endpoints
 * including response time tracking, error rate monitoring, and service availability.
 * 
 * Can be run in Node.js, browser, or GitHub Actions environment.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class XanoHealthMonitor {
    constructor(config = {}) {
        this.config = {
            // Default configuration
            timeout: 10000, // 10 seconds
            retries: 3,
            retryDelay: 1000,
            alertThresholds: {
                responseTime: 2000, // 2 seconds
                errorRate: 5, // 5% error rate
                availability: 95 // 95% availability
            },
            environments: {
                development: {
                    baseUrl: process.env.XANO_DEV_URL || 'https://x8ki-letl-twmt.n7c.xano.io/api:v1',
                    name: 'Development'
                },
                staging: {
                    baseUrl: process.env.XANO_STAGING_URL || 'https://staging-workspace.xano.io/api:v1',
                    name: 'Staging'
                },
                production: {
                    baseUrl: process.env.XANO_PRODUCTION_URL || 'https://production-workspace.xano.io/api:v1',
                    name: 'Production'
                }
            },
            endpoints: [
                { path: '/health', method: 'GET', critical: true, name: 'Health Check' },
                { path: '/auth/me', method: 'GET', critical: true, name: 'Authentication Check' },
                { path: '/api/status', method: 'GET', critical: false, name: 'API Status' },
                { path: '/db/ping', method: 'GET', critical: true, name: 'Database Connectivity' }
            ],
            ...config
        };

        this.results = {
            timestamp: new Date().toISOString(),
            summary: {
                totalChecks: 0,
                passedChecks: 0,
                failedChecks: 0,
                averageResponseTime: 0,
                overallStatus: 'unknown'
            },
            environments: {},
            alerts: []
        };

        this.metrics = {
            responseTime: [],
            errorCount: 0,
            totalRequests: 0
        };
    }

    /**
     * Run health checks for all configured environments
     */
    async runHealthChecks() {
        console.log('🔍 Starting Xano API health checks...');
        console.log(`Checking ${Object.keys(this.config.environments).length} environments with ${this.config.endpoints.length} endpoints each`);

        const startTime = Date.now();

        for (const [envName, envConfig] of Object.entries(this.config.environments)) {
            console.log(`\n📊 Checking ${envConfig.name} environment...`);
            
            try {
                const envResults = await this.checkEnvironment(envName, envConfig);
                this.results.environments[envName] = envResults;
            } catch (error) {
                console.error(`❌ Failed to check ${envName} environment:`, error.message);
                this.results.environments[envName] = {
                    status: 'error',
                    error: error.message,
                    endpoints: {}
                };
            }
        }

        const endTime = Date.now();
        this.calculateSummary();
        
        console.log(`\n✅ Health checks completed in ${endTime - startTime}ms`);
        console.log(`Overall Status: ${this.results.summary.overallStatus.toUpperCase()}`);
        console.log(`Passed: ${this.results.summary.passedChecks}/${this.results.summary.totalChecks}`);
        
        return this.results;
    }

    /**
     * Check health for a specific environment
     */
    async checkEnvironment(envName, envConfig) {
        const envResults = {
            name: envConfig.name,
            baseUrl: envConfig.baseUrl,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            endpoints: {},
            summary: {
                totalEndpoints: this.config.endpoints.length,
                healthyEndpoints: 0,
                unhealthyEndpoints: 0,
                averageResponseTime: 0
            }
        };

        const responseTimes = [];

        // Check each endpoint
        for (const endpoint of this.config.endpoints) {
            console.log(`  🔗 Checking ${endpoint.name}...`);
            
            try {
                const result = await this.checkEndpoint(envConfig.baseUrl, endpoint);
                envResults.endpoints[endpoint.path] = result;
                
                if (result.status === 'healthy') {
                    envResults.summary.healthyEndpoints++;
                    responseTimes.push(result.responseTime);
                } else {
                    envResults.summary.unhealthyEndpoints++;
                    
                    // Create alert for unhealthy critical endpoints
                    if (endpoint.critical) {
                        this.createAlert('endpoint_down', {
                            environment: envName,
                            endpoint: endpoint.path,
                            name: endpoint.name,
                            error: result.error
                        });
                    }
                }

                this.results.summary.totalChecks++;
                if (result.status === 'healthy') {
                    this.results.summary.passedChecks++;
                } else {
                    this.results.summary.failedChecks++;
                }

            } catch (error) {
                console.error(`    ❌ ${endpoint.name} failed:`, error.message);
                
                envResults.endpoints[endpoint.path] = {
                    status: 'error',
                    error: error.message,
                    responseTime: null,
                    critical: endpoint.critical
                };

                envResults.summary.unhealthyEndpoints++;
                this.results.summary.totalChecks++;
                this.results.summary.failedChecks++;

                if (endpoint.critical) {
                    this.createAlert('endpoint_error', {
                        environment: envName,
                        endpoint: endpoint.path,
                        name: endpoint.name,
                        error: error.message
                    });
                }
            }
        }

        // Calculate environment summary
        if (responseTimes.length > 0) {
            envResults.summary.averageResponseTime = Math.round(
                responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            );
        }

        // Determine environment health status
        if (envResults.summary.unhealthyEndpoints === 0) {
            envResults.status = 'healthy';
        } else if (envResults.summary.healthyEndpoints > envResults.summary.unhealthyEndpoints) {
            envResults.status = 'degraded';
        } else {
            envResults.status = 'unhealthy';
        }

        // Check for high response times
        if (envResults.summary.averageResponseTime > this.config.alertThresholds.responseTime) {
            this.createAlert('high_response_time', {
                environment: envName,
                averageResponseTime: envResults.summary.averageResponseTime,
                threshold: this.config.alertThresholds.responseTime
            });
        }

        return envResults;
    }

    /**
     * Check health of a specific endpoint
     */
    async checkEndpoint(baseUrl, endpoint) {
        const startTime = Date.now();
        const url = `${baseUrl}${endpoint.path}`;

        try {
            const response = await this.makeRequest(url, {
                method: endpoint.method,
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': 'Xano-Health-Monitor/1.0',
                    'Accept': 'application/json'
                }
            });

            const responseTime = Date.now() - startTime;
            this.metrics.responseTime.push(responseTime);
            this.metrics.totalRequests++;

            const result = {
                status: 'healthy',
                responseTime: responseTime,
                statusCode: response.status,
                critical: endpoint.critical,
                timestamp: new Date().toISOString()
            };

            // Additional health checks based on response
            if (response.status >= 400) {
                result.status = 'unhealthy';
                result.error = `HTTP ${response.status}: ${response.statusText}`;
                this.metrics.errorCount++;
            } else if (responseTime > this.config.alertThresholds.responseTime) {
                result.status = 'slow';
                result.warning = `Response time (${responseTime}ms) exceeds threshold (${this.config.alertThresholds.responseTime}ms)`;
            }

            // Check response content for health indicators
            if (response.data) {
                result.hasContent = true;
                
                // Look for specific health indicators
                if (typeof response.data === 'object') {
                    if (response.data.status === 'ok' || response.data.healthy === true) {
                        result.healthIndicator = 'positive';
                    } else if (response.data.status === 'error' || response.data.healthy === false) {
                        result.status = 'unhealthy';
                        result.error = 'Health endpoint reports unhealthy status';
                        result.healthIndicator = 'negative';
                    }
                }
            } else {
                result.hasContent = false;
            }

            return result;

        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.metrics.totalRequests++;
            this.metrics.errorCount++;

            return {
                status: 'error',
                error: error.message,
                responseTime: responseTime,
                critical: endpoint.critical,
                timestamp: new Date().toISOString(),
                errorType: this.categorizeError(error)
            };
        }
    }

    /**
     * Make HTTP request with retry logic
     */
    async makeRequest(url, options, attempt = 1) {
        try {
            const response = await axios({
                url: url,
                ...options,
                timeout: options.timeout,
                validateStatus: (status) => status < 500 // Don't throw for 4xx errors
            });

            return response;

        } catch (error) {
            if (attempt < this.config.retries && this.shouldRetry(error)) {
                console.log(`    🔄 Retrying request (${attempt}/${this.config.retries})...`);
                await this.delay(this.config.retryDelay * attempt);
                return this.makeRequest(url, options, attempt + 1);
            }
            throw error;
        }
    }

    /**
     * Determine if request should be retried
     */
    shouldRetry(error) {
        // Retry on network errors or 5xx responses
        return error.code === 'ECONNRESET' || 
               error.code === 'ETIMEDOUT' || 
               error.code === 'ENOTFOUND' ||
               (error.response && error.response.status >= 500);
    }

    /**
     * Categorize error types
     */
    categorizeError(error) {
        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            return 'timeout';
        } else if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
            return 'connection';
        } else if (error.code === 'ENOTFOUND') {
            return 'dns';
        } else if (error.response) {
            return `http_${error.response.status}`;
        } else {
            return 'unknown';
        }
    }

    /**
     * Create alert for monitoring issues
     */
    createAlert(type, details) {
        const alert = {
            type: type,
            severity: this.getAlertSeverity(type, details),
            timestamp: new Date().toISOString(),
            details: details,
            message: this.getAlertMessage(type, details)
        };

        this.results.alerts.push(alert);
        console.log(`  ⚠️ ALERT: ${alert.message}`);
    }

    /**
     * Get alert severity based on type and details
     */
    getAlertSeverity(type, details) {
        switch (type) {
            case 'endpoint_down':
                return details.critical ? 'critical' : 'warning';
            case 'endpoint_error':
                return details.critical ? 'high' : 'medium';
            case 'high_response_time':
                return 'medium';
            case 'environment_down':
                return 'critical';
            default:
                return 'low';
        }
    }

    /**
     * Get human-readable alert message
     */
    getAlertMessage(type, details) {
        switch (type) {
            case 'endpoint_down':
                return `${details.name} endpoint is down in ${details.environment} environment`;
            case 'endpoint_error':
                return `${details.name} endpoint error in ${details.environment}: ${details.error}`;
            case 'high_response_time':
                return `High response time in ${details.environment}: ${details.averageResponseTime}ms (threshold: ${details.threshold}ms)`;
            case 'environment_down':
                return `${details.environment} environment is completely down`;
            default:
                return `Unknown alert type: ${type}`;
        }
    }

    /**
     * Calculate overall summary
     */
    calculateSummary() {
        // Calculate overall average response time
        if (this.metrics.responseTime.length > 0) {
            this.results.summary.averageResponseTime = Math.round(
                this.metrics.responseTime.reduce((sum, time) => sum + time, 0) / this.metrics.responseTime.length
            );
        }

        // Calculate error rate
        const errorRate = this.metrics.totalRequests > 0 ? 
            (this.metrics.errorCount / this.metrics.totalRequests) * 100 : 0;

        // Calculate availability
        const availability = this.results.summary.totalChecks > 0 ?
            (this.results.summary.passedChecks / this.results.summary.totalChecks) * 100 : 0;

        // Determine overall status
        if (availability < this.config.alertThresholds.availability) {
            this.results.summary.overallStatus = 'critical';
        } else if (errorRate > this.config.alertThresholds.errorRate) {
            this.results.summary.overallStatus = 'degraded';
        } else if (this.results.summary.averageResponseTime > this.config.alertThresholds.responseTime) {
            this.results.summary.overallStatus = 'slow';
        } else if (this.results.summary.failedChecks === 0) {
            this.results.summary.overallStatus = 'healthy';
        } else {
            this.results.summary.overallStatus = 'warning';
        }

        // Add calculated metrics
        this.results.summary.errorRate = Math.round(errorRate * 100) / 100;
        this.results.summary.availability = Math.round(availability * 100) / 100;
    }

    /**
     * Generate health report
     */
    generateReport() {
        const report = {
            title: 'Xano API Health Monitor Report',
            timestamp: this.results.timestamp,
            summary: this.results.summary,
            details: []
        };

        // Environment details
        for (const [envName, envData] of Object.entries(this.results.environments)) {
            report.details.push({
                environment: envName,
                status: envData.status,
                summary: envData.summary,
                endpoints: Object.entries(envData.endpoints).map(([path, data]) => ({
                    path: path,
                    status: data.status,
                    responseTime: data.responseTime,
                    error: data.error
                }))
            });
        }

        // Alerts
        report.alerts = this.results.alerts;

        return report;
    }

    /**
     * Save results to file
     */
    async saveResults(filePath) {
        try {
            const reportData = {
                ...this.results,
                report: this.generateReport()
            };

            await fs.promises.writeFile(filePath, JSON.stringify(reportData, null, 2));
            console.log(`📄 Health check results saved to ${filePath}`);
        } catch (error) {
            console.error('Failed to save results:', error.message);
        }
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get status for GitHub Actions
     */
    getGitHubActionsOutput() {
        const output = {
            status: this.results.summary.overallStatus,
            passed: this.results.summary.passedChecks,
            failed: this.results.summary.failedChecks,
            total: this.results.summary.totalChecks,
            averageResponseTime: this.results.summary.averageResponseTime,
            errorRate: this.results.summary.errorRate,
            availability: this.results.summary.availability,
            alertCount: this.results.alerts.length,
            criticalAlerts: this.results.alerts.filter(a => a.severity === 'critical').length
        };

        // Set GitHub Actions outputs
        if (process.env.GITHUB_ACTIONS) {
            console.log(`::set-output name=status::${output.status}`);
            console.log(`::set-output name=passed::${output.passed}`);
            console.log(`::set-output name=failed::${output.failed}`);
            console.log(`::set-output name=total::${output.total}`);
            console.log(`::set-output name=average_response_time::${output.averageResponseTime}`);
            console.log(`::set-output name=error_rate::${output.errorRate}`);
            console.log(`::set-output name=availability::${output.availability}`);
            console.log(`::set-output name=alert_count::${output.alertCount}`);
            console.log(`::set-output name=critical_alerts::${output.criticalAlerts}`);

            // Set exit code based on status
            if (output.status === 'critical' || output.criticalAlerts > 0) {
                process.exit(1);
            }
        }

        return output;
    }
}

// CLI usage
if (require.main === module) {
    async function main() {
        const monitor = new XanoHealthMonitor();
        
        try {
            const results = await monitor.runHealthChecks();
            
            // Save results if output path provided
            const outputPath = process.argv[2] || 'health-check-results.json';
            if (outputPath) {
                await monitor.saveResults(outputPath);
            }

            // Generate GitHub Actions output
            const githubOutput = monitor.getGitHubActionsOutput();
            
            console.log('\n📊 Final Summary:');
            console.log(`Status: ${githubOutput.status.toUpperCase()}`);
            console.log(`Health Checks: ${githubOutput.passed}/${githubOutput.total} passed`);
            console.log(`Average Response Time: ${githubOutput.averageResponseTime}ms`);
            console.log(`Error Rate: ${githubOutput.errorRate}%`);
            console.log(`Availability: ${githubOutput.availability}%`);
            console.log(`Alerts: ${githubOutput.alertCount} (${githubOutput.criticalAlerts} critical)`);

        } catch (error) {
            console.error('❌ Health check failed:', error.message);
            process.exit(1);
        }
    }

    main();
}

module.exports = XanoHealthMonitor;