# Pull Request Templates Guide

This guide explains how to use the GitHub pull request templates for the Webflow + Xano project.

## 📋 Available PR Templates

### 1. 📝 Default Template (`pull_request_template.md`)
**Use for**: Major features, complex changes, bug fixes, or anything that affects production.

**Key Sections**:
- **Description**: Comprehensive change description with implementation details
- **Related Issues**: Links to related GitHub issues
- **Testing Checklist**: Automated, manual, integration, and environment testing
- **Deployment Checklist**: Pre-deployment, deployment strategy, rollback planning
- **Breaking Changes**: Migration guide and deprecation timeline
- **Code Quality**: Standards, security, and performance checks
- **Technical Details**: Change type, affected components, dependencies
- **Review Focus**: Specific areas requiring reviewer attention

**When to use**:
- New features or significant enhancements
- Bug fixes affecting multiple components
- Changes requiring database migrations
- API modifications or breaking changes
- Security updates or performance improvements
- Infrastructure or CI/CD changes

### 2. 📝 Simple Template (`PULL_REQUEST_TEMPLATE/simple_template.md`)
**Use for**: Minor changes, documentation updates, small fixes, or code cleanup.

**Key Sections**:
- **Basic Description**: Simple what/why description
- **Related Issue**: Single issue link
- **Quick Testing**: Basic testing verification
- **Essential Checklist**: Minimal quality checks

**When to use**:
- Documentation updates
- Code formatting or style fixes
- Small bug fixes (single file, minimal impact)
- Test improvements
- Configuration tweaks
- Dependency updates (non-breaking)

**How to access**: Add `?template=simple_template.md` to the PR URL

### 3. 🚨 Hotfix Template (`PULL_REQUEST_TEMPLATE/hotfix_template.md`)
**Use for**: Emergency fixes requiring immediate deployment to resolve critical production issues.

**Key Sections**:
- **Emergency Summary**: Critical issue and fix description
- **Risk Assessment**: Impact analysis and deployment risks  
- **Emergency Testing**: Rapid testing verification
- **Deployment Plan**: Fast-track deployment strategy
- **Emergency Contacts**: Availability for deployment support

**When to use**:
- Production system down or severely impacted
- Critical security vulnerabilities
- Data loss or corruption issues
- Revenue-blocking bugs
- Emergency compliance fixes

**How to access**: Add `?template=hotfix_template.md` to the PR URL

## 🔄 Template Selection Guide

### Decision Tree

```
Is this an emergency production fix?
├─ YES → Use Hotfix Template
└─ NO → Continue

Does this change affect multiple components or require extensive testing?
├─ YES → Use Default Template  
└─ NO → Continue

Is this a small change, documentation, or minor fix?
├─ YES → Use Simple Template
└─ NO → Use Default Template (when in doubt)
```

### Quick Reference

| Change Type | Template | Example |
|-------------|----------|---------|
| New Feature | Default | User authentication, payment integration |
| Bug Fix (Complex) | Default | Multi-component issue, data corruption fix |
| Bug Fix (Simple) | Simple | Typo fix, single function bug |
| Documentation | Simple | README update, comment additions |
| Emergency Fix | Hotfix | Production down, security breach |
| Code Cleanup | Simple | Formatting, unused code removal |
| Performance | Default | Database optimization, caching |
| Security | Default | Authentication changes, vulnerability fixes |
| Infrastructure | Default | CI/CD updates, deployment changes |
| Dependency Update | Simple | Non-breaking package updates |

## 🧪 Testing Requirements by Template

### Default Template Testing
**Required**:
- [ ] All automated tests pass
- [ ] Manual testing in development
- [ ] Integration testing with Webflow/Xano
- [ ] Cross-browser testing (if frontend)
- [ ] Performance impact assessment

**Recommended**:
- [ ] Staging environment testing
- [ ] Security testing (if applicable)
- [ ] Load testing (if performance-critical)
- [ ] User acceptance testing

### Simple Template Testing
**Required**:
- [ ] Basic functionality tested locally
- [ ] No breaking changes introduced
- [ ] All tests pass

### Hotfix Template Testing
**Required**:
- [ ] Fix verified locally
- [ ] Critical path testing
- [ ] Rollback plan tested

**If Time Permits**:
- [ ] Staging verification
- [ ] Integration testing
- [ ] Performance check

## 🚀 Deployment Considerations

### Default Template Deployment
- **Review Time**: 24-48 hours
- **Testing**: Full test suite required
- **Approval**: Technical lead + stakeholder
- **Deployment**: Standard release cycle
- **Monitoring**: Full post-deployment monitoring

### Simple Template Deployment
- **Review Time**: 2-12 hours  
- **Testing**: Basic verification
- **Approval**: Single reviewer
- **Deployment**: Next available window
- **Monitoring**: Basic health checks

### Hotfix Template Deployment
- **Review Time**: 30 minutes - 2 hours
- **Testing**: Rapid verification
- **Approval**: Emergency approval process
- **Deployment**: Immediate
- **Monitoring**: Intensive monitoring

## 👥 Review Process

### Default Template Review
**Reviewers**: Minimum 1 technical reviewer + optional stakeholder
**Focus Areas**:
- Code quality and architecture
- Security implications
- Performance impact
- Breaking changes
- Testing completeness
- Documentation updates

**Timeline**: 24-48 hours for initial review

### Simple Template Review
**Reviewers**: 1 technical reviewer
**Focus Areas**:
- Basic functionality
- Code style compliance
- No unintended side effects

**Timeline**: 2-12 hours for review

### Hotfix Template Review
**Reviewers**: Emergency reviewer (on-call or lead)
**Focus Areas**:
- Fix addresses root cause
- Risk vs. benefit analysis
- Rollback plan viability
- Emergency justification

**Timeline**: 30 minutes - 2 hours

## 📊 Quality Gates

### All Templates
- [ ] Code follows project style guidelines
- [ ] No sensitive information exposed
- [ ] Related issues linked
- [ ] Self-review completed

### Default Template Additional Gates
- [ ] Comprehensive testing completed
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Security review (if applicable)
- [ ] Performance impact assessed

### Hotfix Template Emergency Gates
- [ ] Emergency criteria met
- [ ] Risk assessment completed
- [ ] Rollback plan prepared
- [ ] Emergency contacts identified

## 🔍 Common Mistakes to Avoid

### Template Selection Mistakes
❌ **Don't use Simple template for**:
- Breaking changes
- New features
- Multi-component changes
- Database migrations

❌ **Don't use Hotfix template for**:
- Non-critical bugs
- Feature requests
- Planned maintenance
- Nice-to-have fixes

❌ **Don't use Default template for**:
- Typo fixes
- Documentation updates
- Single-line changes
- Formatting fixes

### Template Completion Mistakes
❌ **Don't skip**:
- Required sections
- Testing verification
- Issue links
- Reviewer assignments

❌ **Don't leave**:
- TODO comments in description
- Placeholder text unchanged
- Checkboxes all unchecked
- Empty required fields

## 🏷️ Auto-labeling and Assignment

### Automatic Actions
The PR automation workflow will:
- **Auto-label** based on template type and content
- **Auto-assign** based on component and expertise
- **Set priority** based on template and urgency markers
- **Add to project board** (if configured)

### Label Expectations
- **Default Template**: `enhancement`, `bug`, component labels
- **Simple Template**: `minor`, `documentation`, `cleanup`
- **Hotfix Template**: `hotfix`, `critical`, `emergency`

## 📈 Metrics and SLAs

### Response Time SLAs
- **Hotfix**: 30 minutes - 2 hours
- **Default**: 24-48 hours
- **Simple**: 2-12 hours

### Quality Metrics
- **Time to First Review**: Measured by template type
- **Review Cycle Time**: First review to approval
- **Merge Success Rate**: PRs merged without issues
- **Rollback Rate**: PRs requiring post-merge fixes

## 🔧 Customization for Teams

### Adding Team Members
Update reviewer assignments in templates:
```markdown
### Required Reviewers
@team-lead @tech-lead

### Component Experts
@frontend-expert (for Webflow changes)
@backend-expert (for Xano changes)  
@devops-expert (for CI/CD changes)
```

### Modifying Checklists
Customize checklists based on your needs:
- Add company-specific requirements
- Include compliance checkboxes
- Add performance benchmarks
- Include security requirements

### Template Validation
Consider adding GitHub Actions to:
- Validate template completion
- Enforce required sections
- Check for placeholder text
- Verify issue links

## 💡 Best Practices

### For PR Authors
1. **Choose the right template** - When in doubt, use Default
2. **Fill out all sections** - Don't leave placeholders
3. **Link related issues** - Always connect to issue tracking
4. **Self-review first** - Review your own changes before submission
5. **Update documentation** - Keep docs current with changes
6. **Test thoroughly** - More testing = faster review
7. **Provide context** - Help reviewers understand your changes

### For Reviewers
1. **Review promptly** - Respect SLA timelines
2. **Focus on template sections** - Use the structure provided
3. **Ask clarifying questions** - Better to ask than assume
4. **Check linked issues** - Verify requirements are met
5. **Test critical changes** - Don't rely only on automated tests
6. **Provide actionable feedback** - Be specific and helpful
7. **Approve confidently** - Ensure you're comfortable with changes

### For Teams
1. **Maintain templates** - Update as processes evolve
2. **Train team members** - Ensure everyone understands the system
3. **Monitor metrics** - Track response times and quality
4. **Gather feedback** - Continuously improve the process
5. **Enforce standards** - Consistently apply quality gates
6. **Celebrate success** - Recognize good PR practices

---

This template system is designed to streamline the code review process while maintaining high quality standards. The three-tier approach ensures that all changes receive appropriate review depth while enabling fast-track processing for emergency situations.