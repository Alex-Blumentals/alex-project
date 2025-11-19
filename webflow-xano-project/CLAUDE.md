# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack project template that integrates Webflow (frontend) with Xano (backend). The architecture separates concerns between visual design (Webflow) and backend logic (Xano), with JavaScript acting as the integration layer.

## Development Commands

### Essential Commands
- `npm run dev` - Start both Webflow and Xano development servers concurrently
- `npm run build` - Build the project for production
- `npm run deploy` - Deploy both frontend to Webflow and sync backend with Xano
- `npm run lint` - Run ESLint on all JavaScript files
- `npm run format` - Format code with Prettier
- `npm run test` - Run test suite with Vitest

### Webflow-Specific Commands
- `npm run webflow:dev` - Start Webflow development server with file watching
- `npm run webflow:build` - Build and optimize Webflow assets
- `npm run webflow:deploy` - Deploy to Webflow hosting

### Xano-Specific Commands
- `npm run xano:dev` - Start Xano development utilities and health monitoring
- `npm run xano:sync` - Sync database schema and create backups
- `node scripts/xano-sync.js list` - List available backups
- `node scripts/xano-sync.js restore [backup-file]` - Restore from backup

## Architecture Overview

### Frontend (Webflow Integration)
- **Webflow Designer**: Visual design and layout creation
- **CMS Integration**: Dynamic content management through Webflow CMS
- **JavaScript Layer**: Custom functionality and API integration
- **Asset Management**: Optimized build process for production

### Backend (Xano Integration)
- **Database**: No-code database design and management
- **API Endpoints**: RESTful APIs generated from Xano
- **Authentication**: Built-in user management and JWT tokens
- **Environment Management**: Development, staging, and production environments

### Integration Layer
- **XanoClient**: Centralized API client with automatic token refresh
- **Webflow Components**: Helper functions for CMS operations
- **Environment Configuration**: Unified config management across environments

## Key Files and Their Purpose

### Configuration
- `frontend/src/webflow-config.js` - Webflow site and API configuration
- `backend/config/xano-config.js` - Xano workspace and endpoint definitions
- `frontend/utils/env-config.js` - Environment variable management and validation

### Core Integration
- `backend/utils/xano-client.js` - Main Xano API client with authentication handling
- `frontend/components/webflow-integration.js` - Webflow CMS helper functions
- `backend/types/xano-types.js` - Type definitions and validation helpers

### Development Scripts
- `scripts/webflow-dev.js` - Webflow development server with hot reload
- `scripts/xano-dev.js` - Xano development utilities and health monitoring
- `scripts/xano-sync.js` - Schema synchronization and backup management

## Environment Setup

### Required Environment Variables
Before development, ensure these are set in `.env`:
- `WEBFLOW_SITE_ID` and `WEBFLOW_API_TOKEN` for Webflow integration
- `XANO_WORKSPACE_ID` and environment URLs for Xano integration
- Development flags like `NODE_ENV`, `DEV_PORT`, `HOT_RELOAD`

### Validation
The project includes environment validation that will throw errors for missing required variables. Use `frontend/utils/env-config.js` functions for consistent environment handling.

## Authentication Pattern

Authentication follows this flow:
1. Login/register through XanoClient
2. Automatic token storage and refresh
3. Automatic retry of failed requests with fresh tokens
4. Global authentication state management

Use the singleton `xanoClient` instance for all API calls to maintain consistent authentication state.

## Development Workflow

1. **Start Development**: `npm run dev` starts both servers
2. **Webflow Changes**: Edit in Webflow Designer, test locally
3. **Backend Changes**: Modify Xano endpoints, sync with `npm run xano:sync`
4. **Integration**: Use helper functions from `webflow-integration.js` and `xano-client.js`
5. **Testing**: Use built-in test helpers (`testXanoAPI`, `testXanoAuth`)
6. **Build**: `npm run build` for production-ready assets
7. **Deploy**: `npm run deploy` for full deployment

## Common Patterns

### Loading CMS Data
```javascript
import { loadCMSData } from './frontend/components/webflow-integration.js';
const items = await loadCMSData(collectionId, { limit: 10 });
```

### API Calls
```javascript
import { xanoClient } from './backend/utils/xano-client.js';
const data = await xanoClient.get('/endpoint');
```

### Environment Handling
```javascript
import { getRequiredEnv, isDevelopment } from './frontend/utils/env-config.js';
const apiUrl = getRequiredEnv('XANO_DEV_URL');
```

## Error Handling

- XanoClient includes automatic retry logic and token refresh
- Environment validation throws descriptive errors for missing variables
- Development servers include health monitoring and graceful error handling
- All async operations should be wrapped in try-catch blocks

## Testing Strategy

- Use Vitest for unit and integration tests
- Built-in API testing helpers for development
- Environment-specific testing configurations
- Health monitoring and connectivity tests