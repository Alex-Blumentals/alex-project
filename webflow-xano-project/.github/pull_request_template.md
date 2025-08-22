<!-- 
🚀 Pull Request Template for Webflow + Xano Project

Please fill out all relevant sections to help reviewers understand your changes.
Delete any sections that don't apply to your PR.
-->

## 📝 Description

### What does this PR do?
<!-- Provide a clear and concise description of what this PR accomplishes -->

### Why are these changes needed?
<!-- Explain the problem this PR solves or the feature it adds -->

### How was this implemented?
<!-- Describe the approach you took to implement these changes -->

---

## 🔗 Related Issues

<!-- Link to related issues, feature requests, or bug reports -->
- Closes #<!-- issue number -->
- Relates to #<!-- issue number -->
- Fixes #<!-- issue number -->
- Part of #<!-- issue number -->

---

## 🧪 Testing Checklist

### Automated Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved
- [ ] TypeScript type checking passes
- [ ] ESLint passes without warnings
- [ ] Build completes successfully

### Manual Testing
- [ ] Tested locally in development environment
- [ ] Tested with different browsers (if frontend changes)
- [ ] Tested on mobile devices (if applicable)
- [ ] Tested with different user roles/permissions
- [ ] Tested error scenarios and edge cases
- [ ] Performance impact assessed and acceptable

### Integration Testing
- [ ] Webflow integration tested (if applicable)
- [ ] Xano API integration tested (if applicable)
- [ ] Third-party services tested (if applicable)
- [ ] Data synchronization verified (if applicable)
- [ ] Authentication flows tested (if applicable)

### Environment Testing
- [ ] **Development**: Tested and working
- [ ] **Staging**: Ready for staging deployment
- [ ] **Production**: Ready for production (if applicable)

---

## 🚀 Deployment Checklist

### Pre-deployment Requirements
- [ ] Database migrations prepared (if needed)
- [ ] Environment variables documented (if new ones added)
- [ ] Configuration changes documented
- [ ] Dependency updates reviewed and approved
- [ ] Breaking changes communicated (if any)

### Deployment Strategy
- [ ] Can be deployed with zero downtime
- [ ] Requires maintenance window (specify duration: ___ minutes)
- [ ] Requires specific deployment order
- [ ] Requires post-deployment configuration

### Rollback Plan
- [ ] Rollback procedure documented
- [ ] Database rollback plan prepared (if schema changes)
- [ ] Rollback tested in staging
- [ ] Rollback time estimated: ___ minutes

### Post-deployment Verification
- [ ] Health check endpoints verified
- [ ] Key user journeys tested
- [ ] Performance metrics monitored
- [ ] Error rates monitored
- [ ] Stakeholder notification plan ready

---

## ⚠️ Breaking Changes

### Are there any breaking changes?
- [ ] **No breaking changes**
- [ ] **Yes, breaking changes included** (complete section below)

<!-- If you selected "Yes", please fill out the following: -->

### Breaking Changes Details
<!-- 
If this PR includes breaking changes, provide details:
- What is breaking?
- Who will be affected?
- How can users migrate?
- What's the timeline for deprecation?
-->

#### What's Breaking:
<!-- Describe the specific changes that break backward compatibility -->

#### Migration Guide:
<!-- Provide step-by-step instructions for users to migrate -->
1. 
2. 
3. 

#### Deprecation Timeline:
<!-- When will old functionality be removed? -->
- **Deprecation Notice**: <!-- Date -->
- **Final Removal**: <!-- Date -->

#### Communication Plan:
- [ ] Breaking changes documented in CHANGELOG
- [ ] Migration guide added to documentation
- [ ] Users/stakeholders notified via <!-- method -->

---

## 📋 Code Quality Checklist

### Code Standards
- [ ] Code follows project style guidelines
- [ ] Functions and variables have meaningful names
- [ ] Code is properly commented and documented
- [ ] No console.log or debug statements left in code
- [ ] No sensitive information (API keys, passwords) in code
- [ ] No TODO comments left without issues created

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented where needed
- [ ] Authentication/authorization handled correctly
- [ ] SQL injection prevention implemented (if applicable)
- [ ] XSS prevention implemented (if applicable)
- [ ] CSRF protection maintained

### Performance
- [ ] No obvious performance regressions
- [ ] Database queries optimized (if applicable)
- [ ] Large files/assets optimized
- [ ] Caching implemented where beneficial
- [ ] Bundle size impact assessed (if frontend changes)

---

## 🔧 Technical Details

### Type of Change
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Code style/formatting changes
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvements
- [ ] 🔒 Security improvements
- [ ] 🔧 Infrastructure/build changes
- [ ] 🧪 Test improvements

### Components Affected
- [ ] Webflow Integration
- [ ] Xano Backend/API
- [ ] Authentication System
- [ ] Data Synchronization
- [ ] GitHub Actions/CI-CD
- [ ] Environment Configuration
- [ ] Documentation
- [ ] Other: <!-- specify -->

### Dependencies
- [ ] No new dependencies added
- [ ] New dependencies added (list below)
- [ ] Dependencies updated (list below)
- [ ] Dependencies removed (list below)

<!-- If dependencies changed, list them here: -->
**New Dependencies:**
- 

**Updated Dependencies:**
- 

**Removed Dependencies:**
- 

---

## 📸 Screenshots/Videos

<!-- 
If your changes affect the UI, please include screenshots or videos
showing the before/after or demonstrating the new functionality
-->

### Before
<!-- Screenshot/video of the current state -->

### After  
<!-- Screenshot/video of the new state -->

---

## 📖 Documentation Updates

- [ ] No documentation updates needed
- [ ] README updated
- [ ] API documentation updated
- [ ] Deployment guide updated
- [ ] Environment setup guide updated
- [ ] CHANGELOG updated
- [ ] Other documentation updated: <!-- specify -->

---

## 🎯 Review Focus Areas

<!-- Help reviewers by highlighting specific areas that need attention -->

### Please pay special attention to:
- [ ] Algorithm correctness in <!-- specific file/function -->
- [ ] Security implications of <!-- specific change -->
- [ ] Performance impact of <!-- specific change -->
- [ ] Error handling in <!-- specific area -->
- [ ] Integration with <!-- specific system -->
- [ ] Database migration safety
- [ ] Configuration changes
- [ ] Other: <!-- specify -->

### Questions for reviewers:
<!-- Any specific questions you have for the reviewers -->
1. 
2. 

---

## 🚨 Urgency & Priority

### Priority Level
- [ ] 🔴 Critical - Emergency fix, deploy immediately
- [ ] 🟠 High - Important, should be deployed soon
- [ ] 🟡 Medium - Normal priority, standard review process
- [ ] 🟢 Low - Nice to have, can wait for next release cycle

### Timeline
- **Requested merge date**: <!-- Date -->
- **Requested deployment date**: <!-- Date -->
- **Business justification for urgency**: <!-- If high/critical priority -->

---

## 💬 Additional Notes

<!-- Any other information that reviewers should know -->

### Known Issues
<!-- Any known issues or limitations with this PR -->
- 

### Future Work
<!-- Any follow-up work planned -->
- 

### Dependencies on Other PRs
<!-- List any other PRs this depends on -->
- 

---

## ✅ Pre-submission Checklist

<!-- Final checklist before submitting the PR -->

- [ ] I have read and followed the [contributing guidelines](./CONTRIBUTING.md)
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
- [ ] I have updated the CHANGELOG (if applicable)
- [ ] I have assigned appropriate reviewers
- [ ] I have added appropriate labels to this PR

---

## 👥 Reviewers

### Required Reviewers
<!-- @ mention specific people who must review this PR -->
@Alex-Blumentals

### Optional Reviewers
<!-- @ mention people who might want to review but aren't required -->

### Subject Matter Experts
<!-- @ mention people with specific expertise in the changed areas -->

---

## 🏷️ Labels

<!-- 
Suggested labels for this PR (maintainers will apply):
- Type: bug, feature, documentation, etc.
- Priority: critical, high, medium, low
- Component: webflow, xano, github-actions, etc.
- Environment: affects-production, affects-staging, etc.
-->

**Suggested labels**: <!-- List suggested labels here -->

---

<!-- 
🎉 Thank you for contributing to the Webflow + Xano project! 
Your pull request will be reviewed as soon as possible.

For urgent issues, please reach out via the established communication channels.
-->