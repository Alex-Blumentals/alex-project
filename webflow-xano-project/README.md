# Webflow + Xano Full-Stack Project

A modern full-stack project template using Webflow for frontend and Xano for backend, with proper development workflow and environment management.

## 🚀 Quick Start

1. **Clone and setup:**
   ```bash
   cd webflow-xano-project
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Webflow and Xano credentials
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
webflow-xano-project/
├── frontend/                 # Webflow frontend integration
│   ├── src/
│   │   └── webflow-config.js # Webflow configuration
│   ├── components/
│   │   └── webflow-integration.js # Webflow CMS helpers
│   ├── assets/              # Static assets
│   └── utils/
│       └── env-config.js    # Environment utilities
├── backend/                 # Xano backend integration
│   ├── config/
│   │   └── xano-config.js   # Xano configuration
│   ├── utils/
│   │   └── xano-client.js   # API client
│   └── types/
│       └── xano-types.js    # Type definitions
├── scripts/                 # Development scripts
│   ├── webflow-dev.js      # Webflow dev server
│   ├── webflow-build.js    # Build script
│   ├── xano-dev.js         # Xano dev utilities
│   └── xano-sync.js        # Sync script
└── docs/                   # Documentation
```

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

**Webflow:**
- `WEBFLOW_SITE_ID` - Your Webflow site ID
- `WEBFLOW_API_TOKEN` - Webflow API token
- `WEBFLOW_CUSTOM_DOMAIN` - Your custom domain

**Xano:**
- `XANO_WORKSPACE_ID` - Xano workspace ID
- `XANO_API_KEY` - Xano API key
- `XANO_DEV_URL` - Development environment URL
- `XANO_STAGING_URL` - Staging environment URL
- `XANO_PROD_URL` - Production environment URL

### Webflow Setup

1. Create a new Webflow project
2. Get your Site ID from Project Settings → General
3. Generate API token from Account Settings → Integrations
4. Configure collections in `frontend/src/webflow-config.js`

### Xano Setup

1. Create a Xano workspace
2. Set up your database tables
3. Create API endpoints
4. Configure environment URLs in your Xano dashboard
5. Update endpoint mappings in `backend/config/xano-config.js`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both Webflow and Xano dev servers
- `npm run webflow:dev` - Start Webflow development server
- `npm run webflow:build` - Build Webflow assets
- `npm run webflow:deploy` - Deploy to Webflow
- `npm run xano:dev` - Start Xano development utilities
- `npm run xano:sync` - Sync with Xano backend
- `npm run build` - Build for production
- `npm run deploy` - Deploy both frontend and backend
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Development Workflow

1. **Start development environment:**
   ```bash
   npm run dev
   ```

2. **Work on frontend (Webflow):**
   - Edit your Webflow project in the designer
   - Use the integration helpers in `frontend/components/webflow-integration.js`
   - Test CMS data loading and updates

3. **Work on backend (Xano):**
   - Use the Xano client in `backend/utils/xano-client.js`
   - Test API endpoints with the development utilities
   - Monitor backend health and connectivity

4. **Sync changes:**
   ```bash
   npm run xano:sync
   ```

### Testing API Integration

Use the built-in testing helpers in development:

```javascript
// Test Xano authentication
await testXanoAuth('user@example.com', 'password');

// Test API endpoints
await testXanoAPI('/user/profile');
```

## 🏗️ Building and Deployment

### Build Process

```bash
npm run build
```

This will:
- Process and optimize frontend assets
- Generate production builds
- Create optimized bundle
- Generate sitemap (if enabled)

### Deployment

```bash
npm run deploy
```

This will:
- Deploy to Webflow hosting
- Sync latest changes with Xano
- Update production environment

## 🔐 Authentication Flow

The project includes a complete authentication system:

1. **Registration/Login** - Handled by Xano backend
2. **Token Management** - Automatic refresh and storage
3. **Protected Routes** - Client-side protection
4. **User Profile** - Full CRUD operations

### Example Usage

```javascript
import { xanoClient } from './backend/utils/xano-client.js';

// Login user
const response = await xanoClient.login('user@example.com', 'password');

// Get user profile
const profile = await xanoClient.getUserProfile();

// Update profile
await xanoClient.updateUserProfile({ name: 'New Name' });
```

## 📱 Webflow CMS Integration

### Loading CMS Data

```javascript
import { loadCMSData } from './frontend/components/webflow-integration.js';

// Load blog posts
const posts = await loadCMSData('your-blog-collection-id');

// Load with options
const featuredPosts = await loadCMSData('your-blog-collection-id', {
  limit: 5,
  sort: [{ field: 'created-date', direction: 'desc' }]
});
```

### Updating CMS Items

```javascript
import { updateCMSItem, createCMSItem } from './frontend/components/webflow-integration.js';

// Update existing item
await updateCMSItem('collection-id', 'item-id', {
  name: 'Updated Title',
  content: 'Updated content'
});

// Create new item
await createCMSItem('collection-id', {
  name: 'New Post',
  content: 'Post content',
  published: true
});
```

## 🔄 Synchronization

### Schema Sync

Keep your local schema in sync with Xano:

```bash
npm run xano:sync
```

### Backup and Restore

```bash
# Create backup
npm run xano:sync

# List backups
node scripts/xano-sync.js list

# Restore from backup
node scripts/xano-sync.js restore backup-2024-01-15T10-30-00-000Z.json
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For UI testing:

```bash
npm run test:ui
```

## 📝 Type Safety

The project includes TypeScript definitions for:
- Xano API responses
- User data structures
- Configuration objects

See `backend/types/xano-types.js` for all type definitions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Connection Issues:**
- Verify your environment variables are set correctly
- Check Xano workspace and API key
- Ensure Webflow site ID and token are valid

**Build Issues:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables
- Verify all required dependencies are installed

**Sync Issues:**
- Check Xano API connectivity
- Verify workspace permissions
- Review environment URL configurations

For more help, check the documentation in the `docs/` folder.