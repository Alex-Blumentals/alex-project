# Custom Claude Slash Commands

This directory contains custom slash commands to help restore project context quickly and track progress.

## Available Commands

### `/project-status`
Shows the current state of the entire project with detailed status of all components.

**Usage**: `claude -p '/project-status'`

**What it shows**:
- Overall project completion (95%)
- Component-by-component status
- GitHub repository and authentication status
- Monitoring system configuration
- Integration readiness
- Next steps and documentation links

### `/setup-reminder`
Comprehensive checklist of completed and pending setup steps.

**Usage**: `claude -p '/setup-reminder'`

**What it shows**:
- ✅ Completed steps organized by category
- ⏳ Pending steps with priorities
- Progress percentage (25/35 steps complete)
- Next priority actions
- Essential commands for common tasks

### `/integration-check`
Verifies all tool integrations and their current status.

**Usage**: `claude -p '/integration-check'`

**What it checks**:
- GitHub CLI authentication
- Git configuration
- GitHub Actions workflows
- GitHub Secrets configuration
- Webflow integration files
- Xano integration files
- Monitoring system files
- Overall integration percentage

### `/next-steps`
Shows prioritized next actions based on current project state.

**Usage**: `claude -p '/next-steps'`

**What it provides**:
- Context-aware prioritization
- Critical vs High vs Medium vs Low priority tasks
- Time estimates for each task
- Recommended action plans
- Quick start guides (30-minute setup)
- Essential commands reference

## Quick Usage Examples

```bash
# Get overall project status
claude -p '/project-status'

# See what's completed vs pending
claude -p '/setup-reminder'

# Verify all integrations are working
claude -p '/integration-check'

# Get prioritized action plan
claude -p '/next-steps'
```

## Context Restoration

These commands are designed to quickly restore context when resuming work on the project:

1. **Start with** `/project-status` to get overall picture
2. **Check** `/integration-check` to verify system health
3. **Review** `/setup-reminder` to see progress
4. **Plan** with `/next-steps` to prioritize actions

## Command Output Features

- **Color-coded status indicators** (✅ ❌ ⏳)
- **Progress tracking** with percentages
- **Actionable recommendations** with specific commands
- **Time estimates** for planning
- **Quick reference sections** for common operations

## Customization

These commands can be modified to suit your workflow. They're bash scripts that:
- Check actual system state (not static)
- Provide contextual recommendations
- Include executable commands for next steps
- Automatically update status based on current state

## Integration with CLAUDE.md

These commands are referenced in the main CLAUDE.md file under the "Development Commands" section for easy discoverability.