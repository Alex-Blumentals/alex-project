# GitHub Issue Templates Guide

This guide explains how to use the GitHub issue templates and automated workflows for the Webflow + Xano project.

## 📋 Available Issue Templates

### 1. 🐛 Bug Report (`bug_report.yml`)
**Use for**: Reporting bugs, unexpected behavior, or errors in the application.

**Key Features**:
- Environment detection (Production, Staging, Development)
- Component identification (Webflow, Xano, Authentication, etc.)
- Severity levels (Critical, High, Medium, Low)
- Structured reproduction steps
- Browser/device information capture
- Automatic priority assignment

**Auto-labels**: `bug`, `needs-triage`, plus environment and component-specific labels
**Auto-assigned**: Alex-Blumentals

### 2. ✨ Feature Request (`feature_request.yml`)
**Use for**: Suggesting new features, enhancements, or improvements.

**Key Features**:
- Business problem identification
- User story format
- Acceptance criteria checklist
- Effort estimation
- Business impact assessment
- Technical considerations

**Auto-labels**: `enhancement`, `needs-triage`
**Auto-assigned**: Alex-Blumentals

### 3. 🚀 Deployment Request (`deployment_request.yml`)
**Use for**: Requesting deployments to staging or production environments.

**Key Features**:
- Deployment type classification
- Environment targeting
- Risk assessment requirements
- Rollback planning
- Post-deployment verification
- Approval workflow integration

**Auto-labels**: `deployment`, `ops`, `needs-approval`
**Auto-assigned**: Alex-Blumentals

### 4. 🚨 Emergency Hotfix (`emergency_hotfix.yml`)
**Use for**: Critical production issues requiring immediate attention.

**Key Features**:
- Emergency criteria validation
- Severity level classification (SEV1-SEV4)
- User and business impact assessment
- Immediate action planning
- Escalation path definition
- Resolution success criteria

**Auto-labels**: `emergency`, `critical`, `production`, `needs-immediate-attention`
**Auto-assigned**: Alex-Blumentals
**Special**: Triggers emergency notification workflow

### 5. ❓ Question or Support (`question.yml`)
**Use for**: Asking questions, getting help with setup, or requesting support.

**Key Features**:
- Question categorization
- Context and background capture
- Attempted solutions tracking
- Help type specification
- Urgency level setting

**Auto-labels**: `question`, `support`
**Auto-assigned**: Alex-Blumentals

## 🤖 Automated Workflows

### Issue Automation (`issue-automation.yml`)

The automation workflow provides several intelligent features:

#### 1. **Auto-labeling**
Automatically adds labels based on:
- **Title prefixes**: `[BUG]`, `[FEATURE]`, `[DEPLOY]`, `[EMERGENCY]`, `[QUESTION]`
- **Content analysis**: Keywords trigger relevant component labels
- **Priority detection**: Urgency/severity keywords add priority labels
- **Environment detection**: Environment mentions add env-specific labels

#### 2. **Auto-assignment**
- All issues automatically assigned to project owner
- Expandable for team-based assignment as project grows

#### 3. **Emergency Notifications**
When emergency issues are created:
- Automatic high-priority labeling
- Emergency response comment with checklist
- Escalation guidance
- SLA information

#### 4. **Deployment Processing**
For deployment requests:
- Deployment-specific labeling
- Review process guidance
- Timeline expectations
- Approval workflow initiation

#### 5. **Initial Response**
All new issues receive:
- Welcome message with next steps
- SLA timeline information
- Resource links
- Contribution acknowledgment

### Label Management

Standardized label system includes:

#### **Priority Labels**
- `priority: critical` - Immediate attention required
- `priority: high` - Address soon
- `priority: medium` - Normal timeline
- `priority: low` - Schedule later

#### **Component Labels**
- `webflow` - Webflow integration
- `xano` - Xano backend
- `github-actions` - CI/CD workflows
- `security` - Security related
- `performance` - Performance issues
- `configuration` - Setup/config

#### **Environment Labels**
- `env: production` - Production environment
- `env: staging` - Staging environment
- `env: development` - Development environment

#### **Status Labels**
- `needs-triage` - Needs initial review
- `in-progress` - Currently being worked on
- `ready-for-testing` - Ready for QA
- `blocked` - Waiting for dependencies

## 📊 Issue Workflow Process

### 1. **Issue Creation**
User selects appropriate template and fills out structured form

### 2. **Automatic Processing**
- Auto-labeling based on content analysis
- Auto-assignment to relevant team members
- Initial response comment posted
- Priority/severity assessment

### 3. **Triage Process**
Team reviews and:
- Validates categorization
- Adjusts priority if needed
- Assigns to specific team members
- Adds to project boards

### 4. **Work Process**
- Status updates through labels
- Progress tracking
- Communication in comments
- Linking to related issues/PRs

### 5. **Resolution**
- Verification of fix/implementation
- Documentation updates
- Closure with resolution summary

## 🔧 Best Practices

### For Issue Reporters

#### **Choose the Right Template**
- **Bug Report**: For anything that's broken or not working as expected
- **Feature Request**: For new functionality or improvements
- **Deployment Request**: For planned deployments (emergency or regular)
- **Emergency Hotfix**: ONLY for critical production issues
- **Question/Support**: For help, guidance, or general questions

#### **Provide Complete Information**
- Fill out all required fields thoroughly
- Include specific error messages and logs
- Add screenshots or videos when helpful
- Describe steps to reproduce issues
- Specify environment details

#### **Use Clear Titles**
- Be descriptive and specific
- Include relevant keywords
- Use the suggested prefixes (`[BUG]`, `[FEATURE]`, etc.)

### For Issue Handlers

#### **Triage Guidelines**
- Review new issues within SLA timeframes
- Validate priority and severity levels
- Ensure proper categorization and labeling
- Assign to appropriate team members
- Link related issues and dependencies

#### **Communication Standards**
- Provide regular status updates
- Ask clarifying questions early
- Document decisions and rationale
- Keep stakeholders informed
- Close with clear resolution summary

## 📈 Metrics and Monitoring

### Response Time SLAs
- **Emergency Issues**: 30 minutes - 2 hours
- **Critical Priority**: 4 hours
- **High Priority**: 24 hours
- **Medium Priority**: 48 hours
- **Low Priority**: 5 business days

### Quality Metrics
- Issue resolution time
- First response time
- Reopened issue rate
- Customer satisfaction
- Label accuracy

## 🔄 Template Maintenance

### Regular Reviews
- Monthly template effectiveness review
- Quarterly label system optimization
- Annual process improvement assessment

### Feedback Integration
- Collect user feedback on template usability
- Monitor automation effectiveness
- Adjust workflows based on team needs

### Version Control
- All templates are version controlled
- Changes go through pull request review
- Documentation updates with template changes

## 🎯 Tips for Effective Issue Management

### **For Users**
1. **Search first** - Check existing issues before creating new ones
2. **Be specific** - Provide detailed information and context
3. **Stay engaged** - Respond to questions and test fixes
4. **Follow up** - Confirm when issues are resolved

### **For Maintainers**
1. **Triage regularly** - Review new issues promptly
2. **Communicate clearly** - Provide status updates and expectations
3. **Document decisions** - Record rationale for future reference
4. **Close promptly** - Don't leave resolved issues open

### **For the Team**
1. **Use labels consistently** - Maintain labeling standards
2. **Link related work** - Connect issues, PRs, and discussions
3. **Update project boards** - Keep project status current
4. **Learn from patterns** - Identify recurring issues and root causes

---

This issue template system is designed to streamline communication, improve response times, and maintain high-quality issue resolution. The templates and automation workflows work together to ensure nothing falls through the cracks while providing clear processes for all stakeholders.