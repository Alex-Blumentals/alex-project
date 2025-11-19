<!-- 
🚨 HOTFIX Pull Request Template

Use this template for emergency hotfixes that need fast-track review and deployment.
This template focuses on critical information needed for rapid deployment.
-->

# 🚨 EMERGENCY HOTFIX

## ⚡ Quick Summary
**What**: <!-- One sentence describing the fix -->
**Why**: <!-- One sentence describing the critical issue being fixed -->

---

## 🔗 Emergency Issue
**Related Issue**: #<!-- emergency issue number -->
**Incident**: <!-- Link to incident tracking if applicable -->

---

## 🚨 Critical Information

### Impact if NOT deployed:
<!-- Describe consequences of not deploying this hotfix immediately -->

### Risk Assessment:
- [ ] **Low Risk** - Isolated change, minimal impact
- [ ] **Medium Risk** - Some risk, but manageable
- [ ] **High Risk** - Significant risk, but emergency justifies it

### Scope of Change:
- [ ] Code fix only
- [ ] Configuration change
- [ ] Database change (specify: _____________)
- [ ] Infrastructure change
- [ ] Third-party dependency update

---

## ✅ Emergency Testing

### Completed Testing:
- [ ] **Local Testing**: Fix verified locally
- [ ] **Unit Tests**: All tests pass
- [ ] **Integration Tests**: Key flows verified
- [ ] **Staging Verification**: Tested in staging (if possible)
- [ ] **Rollback Tested**: Rollback procedure verified

### Testing Limitations:
<!-- Any testing that couldn't be completed due to urgency -->

---

## 🚀 Emergency Deployment Plan

### Deployment Requirements:
- [ ] **Zero Downtime**: Can be deployed without downtime
- [ ] **Maintenance Window**: Requires downtime (Duration: ___ minutes)
- [ ] **Gradual Rollout**: Deploy with feature flags/gradual rollout
- [ ] **Immediate Full Deployment**: Deploy to all users immediately

### Rollback Plan:
- **Rollback Time**: ___ minutes
- **Rollback Trigger**: <!-- When to rollback -->
- **Rollback Method**: <!-- How to rollback -->

### Post-Deployment Verification:
1. <!-- Quick verification step 1 -->
2. <!-- Quick verification step 2 -->
3. <!-- Quick verification step 3 -->

---

## 💥 Breaking Changes
- [ ] **No breaking changes**
- [ ] **Breaking changes** (Justify why acceptable for hotfix):

---

## 🔍 Code Changes

### Files Modified:
<!-- List key files changed -->
- 
- 
- 

### Root Cause:
<!-- Brief explanation of what caused the issue -->

### Fix Description:
<!-- Brief technical description of the fix -->

---

## 📞 Emergency Contacts

**Primary Contact**: <!-- Your name and immediate contact info -->
**Secondary Contact**: <!-- Backup person if needed -->
**Available Until**: <!-- How long you'll be available for deployment support -->

---

## ✅ Hotfix Checklist

### Pre-Deployment:
- [ ] Emergency issue clearly documented
- [ ] Fix verified to resolve the issue
- [ ] Minimal viable change implemented
- [ ] Risk assessment completed
- [ ] Rollback plan prepared and tested
- [ ] Key stakeholders notified
- [ ] Deployment team ready

### Review Requirements:
- [ ] Emergency approval from <!-- decision maker -->
- [ ] Technical lead approval
- [ ] Security review (if security-related)
- [ ] Database team approval (if DB changes)

### Communication:
- [ ] Emergency team notified
- [ ] Stakeholders alerted
- [ ] Customer support briefed
- [ ] Status page updated (if needed)

---

## 📝 Post-Deployment Follow-up

### Immediate Actions (within 1 hour):
- [ ] Verify fix resolved the issue
- [ ] Monitor error rates and performance
- [ ] Confirm user-reported issues are resolved
- [ ] Update incident status

### Short-term Actions (within 24 hours):
- [ ] Schedule post-incident review
- [ ] Document lessons learned
- [ ] Plan permanent fix (if this is temporary)
- [ ] Update monitoring/alerting (if gaps identified)

---

## ⚠️ Reviewer Instructions

**This is an emergency hotfix requiring expedited review:**

1. **Focus on**: Impact, risk assessment, and rollback plan
2. **Verify**: Fix addresses the root cause
3. **Check**: No obvious security or performance issues
4. **Approve**: If benefits outweigh risks for emergency

**Questions to ask**:
- Does this fix the critical issue?
- Is the risk acceptable given the emergency?
- Is the rollback plan viable?
- Are we prepared for deployment?

---

**⏰ Target Review Time**: Within 30 minutes
**⏰ Target Deployment**: Within 2 hours of approval