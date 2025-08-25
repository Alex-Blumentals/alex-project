# Specialized Claude Agents

This directory contains specialized agent configurations for different aspects of the Webflow + Xano integration project. Each agent has deep expertise in their domain and can provide focused assistance for specific tasks.

## Available Agents

### 🎨 [Webflow Integration Agent](webflow-integration.md)
**Specialization**: Frontend integration, custom code deployment, and visual design integration

**Use when you need help with**:
- Adding integration scripts to Webflow sites
- CMS configuration and dynamic content loading
- Form handling and validation
- Performance optimization for Webflow sites
- Custom code deployment and troubleshooting
- Mobile responsiveness and user experience

**Expertise includes**:
- ✅ Custom JavaScript integration
- ✅ Webflow CMS management
- ✅ Form processing and validation
- ✅ Performance optimization (Core Web Vitals)
- ✅ Error handling and recovery
- ✅ SEO and accessibility implementation

### 🛢️ [Xano Backend Agent](xano-backend.md)
**Specialization**: Database management, API development, and backend infrastructure

**Use when you need help with**:
- Database schema design and optimization
- API endpoint development and testing
- Authentication and authorization systems
- Data migration and backup management
- Performance optimization and query tuning
- Environment management (dev/staging/production)

**Expertise includes**:
- ✅ Database design and relationships
- ✅ RESTful API development
- ✅ JWT authentication systems
- ✅ Performance optimization and caching
- ✅ Security implementation
- ✅ Health monitoring and backup strategies

### ⚛️ [Tempo Frontend Agent](tempo-frontend.md)
**Specialization**: React development and Tempo.new project management integration

**Use when you need help with**:
- React component development
- Tempo.new API integration
- Project management dashboard creation
- GitHub workflow integration
- Task tracking and status management
- Real-time updates and notifications

**Expertise includes**:
- ✅ Modern React patterns (hooks, context, memoization)
- ✅ Tempo.new API integration
- ✅ GitHub synchronization
- ✅ State management and performance
- ✅ UI/UX implementation
- ✅ Testing strategies (unit, integration, accessibility)

### 🚀 [Deployment Manager Agent](deployment-manager.md)
**Specialization**: Multi-platform deployment orchestration and infrastructure management

**Use when you need help with**:
- CI/CD pipeline configuration
- Multi-environment deployment strategies
- Automated rollback and recovery procedures
- Security scanning and compliance
- Performance monitoring and optimization
- Infrastructure as Code management

**Expertise includes**:
- ✅ GitHub Actions workflow orchestration
- ✅ Environment management and secrets handling
- ✅ Automated health checks and monitoring
- ✅ Security scanning and vulnerability management
- ✅ Performance optimization and CDN integration
- ✅ Disaster recovery and rollback automation

## How to Use Specialized Agents

### Method 1: Direct Agent Consultation
```bash
# Use the Task tool to consult a specific agent
claude -p "Use the webflow-integration agent to help me add the Xano client to my Webflow site custom code"

claude -p "Use the xano-backend agent to help me design a user authentication system with JWT tokens"

claude -p "Use the tempo-frontend agent to help me create a task management dashboard with React"

claude -p "Use the deployment-manager agent to help me set up automated deployment to production"
```

### Method 2: Context-Aware Agent Selection
The main Claude Code assistant will automatically route requests to the appropriate specialized agent based on the context of your question:

- **Frontend/Webflow questions** → Webflow Integration Agent
- **Backend/Database questions** → Xano Backend Agent  
- **React/Dashboard questions** → Tempo Frontend Agent
- **Deployment/Infrastructure questions** → Deployment Manager Agent

### Method 3: Multi-Agent Collaboration
For complex tasks that span multiple domains, agents can work together:

```bash
# Example: Complete feature implementation
claude -p "Help me implement a contact form that:
1. Uses Webflow for the frontend design
2. Processes submissions through Xano backend  
3. Tracks implementation progress in Tempo
4. Deploys automatically to production"

# This would involve:
# - Webflow Integration Agent: Form setup and validation
# - Xano Backend Agent: API endpoint and data storage
# - Tempo Frontend Agent: Task tracking and status updates
# - Deployment Manager Agent: Automated deployment pipeline
```

## Agent Capabilities Matrix

| Capability | Webflow | Xano | Tempo | Deployment |
|-----------|---------|------|-------|------------|
| **Frontend Development** | ✅ Expert | ⚪ Basic | ✅ Expert | ⚪ Basic |
| **Backend Development** | ⚪ Basic | ✅ Expert | ⚪ Basic | ⚪ Basic |
| **Database Management** | ❌ None | ✅ Expert | ❌ None | ⚪ Basic |
| **API Integration** | ✅ Expert | ✅ Expert | ✅ Expert | ⚪ Basic |
| **React Development** | ⚪ Basic | ❌ None | ✅ Expert | ❌ None |
| **Project Management** | ❌ None | ❌ None | ✅ Expert | ⚪ Basic |
| **CI/CD Pipelines** | ⚪ Basic | ⚪ Basic | ⚪ Basic | ✅ Expert |
| **Security Implementation** | ✅ Expert | ✅ Expert | ⚪ Basic | ✅ Expert |
| **Performance Optimization** | ✅ Expert | ✅ Expert | ✅ Expert | ✅ Expert |
| **Monitoring & Alerting** | ✅ Expert | ✅ Expert | ⚪ Basic | ✅ Expert |

Legend: ✅ Expert, ⚪ Basic, ❌ None

## Common Use Cases

### 1. **New Feature Development**
```bash
# Start with planning
claude -p "Use the tempo-frontend agent to help me create a task for implementing user profiles"

# Design backend
claude -p "Use the xano-backend agent to help me design the user profile database schema"

# Implement frontend
claude -p "Use the webflow-integration agent to help me create the profile editing form"

# Deploy feature
claude -p "Use the deployment-manager agent to help me deploy the profile feature to staging"
```

### 2. **Performance Optimization**
```bash
# Diagnose performance issues
claude -p "Use the webflow-integration agent to analyze my site's Core Web Vitals"

# Optimize backend queries
claude -p "Use the xano-backend agent to optimize my database queries for better performance"

# Monitor deployment impact
claude -p "Use the deployment-manager agent to set up performance monitoring for my optimization"
```

### 3. **Troubleshooting Issues**
```bash
# Debug integration problems
claude -p "Use the webflow-integration agent to help debug why my forms aren't submitting to Xano"

# Investigate backend errors
claude -p "Use the xano-backend agent to help me troubleshoot API authentication failures"

# Check deployment status
claude -p "Use the deployment-manager agent to help me understand why my production deployment failed"
```

### 4. **System Architecture Planning**
```bash
# Plan complete system
claude -p "Help me architect a complete e-commerce solution using:
- Webflow for the storefront design
- Xano for product catalog and order management
- React dashboard for admin management
- Automated deployment pipeline"

# This engages all agents collaboratively for comprehensive planning
```

## Agent Communication Protocols

### Information Sharing
- Agents share relevant context and configurations
- Cross-references to related documentation and code
- Consistent naming conventions and standards
- Integrated monitoring and alerting strategies

### Handoff Procedures
- Clear task completion criteria
- Status updates and progress tracking
- Error escalation procedures
- Documentation updates and maintenance

### Quality Assurance
- Code review and validation
- Testing strategy coordination
- Performance impact assessment
- Security compliance verification

## Best Practices for Agent Interaction

### 1. **Be Specific About Domain**
```bash
# Good: Specific domain and task
claude -p "Use the webflow-integration agent to help me implement lazy loading for images"

# Less effective: Vague request
claude -p "Help me make my site faster"
```

### 2. **Provide Context**
```bash
# Good: Include relevant context
claude -p "Use the xano-backend agent to help me add pagination to my blog posts API. I currently have 1000+ posts and the endpoint is timing out"

# Less effective: No context provided
claude -p "Help me add pagination"
```

### 3. **Reference Current State**
```bash
# Good: Reference current project state
claude -p "Use the deployment-manager agent to help me set up staging deployment. I've already merged PR #2 and configured basic GitHub secrets"

# Less effective: No state context
claude -p "Help me deploy to staging"
```

### 4. **Ask for Multi-Domain Solutions**
```bash
# Good: Acknowledge complexity
claude -p "Help me implement real-time notifications that work across:
- Webflow frontend (display notifications)
- Xano backend (trigger events)
- React dashboard (admin controls)
- Deployment pipeline (send alerts)"
```

## Integration with Main Project

### Status Commands
Each agent integrates with the main project status system:
```bash
# Overall project status
claude -p '/project-status'

# Integration health check
claude -p '/integration-check'

# Next steps planning
claude -p '/next-steps'
```

### Documentation References
- All agents reference the main project documentation
- Consistent with CLAUDE.md development guidelines
- Integrated with monitoring and deployment systems
- Cross-referenced with session handoff documentation

### Monitoring Integration
- Agents contribute to overall system health monitoring
- Performance optimization recommendations
- Security compliance validation
- Deployment impact assessment

---

**Agent System Status**: Ready for specialized task assistance
**Last Updated**: August 23, 2025
**Integration Level**: Fully integrated with main project systems

## Quick Agent Reference

| Need help with... | Use this agent |
|------------------|----------------|
| Webflow custom code | `webflow-integration` |
| Database design | `xano-backend` |
| React components | `tempo-frontend` |
| CI/CD pipelines | `deployment-manager` |
| Form integration | `webflow-integration` |
| API endpoints | `xano-backend` |
| Task management | `tempo-frontend` |
| Production deployment | `deployment-manager` |
| Performance issues | All agents (domain-specific) |
| Security concerns | `xano-backend` + `deployment-manager` |

💡 **Tip**: For complex multi-domain tasks, start your request with "Help me..." and let the main assistant coordinate between the specialized agents automatically.