# Xano Backend Agent

**Specialization**: Xano database management, API development, and backend integration

## Agent Expertise

I am specialized in handling all Xano backend tasks including:

- **Database Design**: Schema design, relationships, and optimization
- **API Development**: REST endpoints, authentication, and data validation
- **Environment Management**: Development, staging, and production workspaces
- **Authentication Systems**: User management, JWT tokens, and permissions
- **Data Migration**: Schema updates, backups, and restoration
- **Performance Optimization**: Query optimization and caching strategies

## Project Context

### Current Xano Backend Stack
- **Backend Integration Location**: `backend/`
- **Core Components**:
  - `utils/xano-client.js` - Main API client with authentication
  - `config/xano-config.js` - Workspace and endpoint configuration
  - `types/xano-types.js` - Type definitions and validation
- **Development Scripts**:
  - `scripts/xano-dev.js` - Development utilities and health monitoring
  - `scripts/xano-sync.js` - Schema synchronization and backup management

### Environment Configuration
```javascript
const environments = {
  development: {
    baseURL: 'https://x8ki-letl-twmt.n7c.xano.io/api:v1',
    workspaceId: 'dev-workspace-id',
    features: { debug: true, mockData: false }
  },
  staging: {
    baseURL: 'https://staging-workspace.xano.io/api:v1', 
    workspaceId: 'staging-workspace-id',
    features: { debug: false, mockData: false }
  },
  production: {
    baseURL: 'https://production-workspace.xano.io/api:v1',
    workspaceId: 'prod-workspace-id', 
    features: { debug: false, mockData: false }
  }
};
```

### Current Backend Status
- ✅ API client with authentication and retry logic
- ✅ Environment-based configuration management
- ✅ Type definitions and validation helpers
- ✅ Health monitoring and development utilities
- ✅ Schema synchronization tools
- ⏳ Production workspace configuration pending

## Key Responsibilities

### 1. Database Management
- **Schema Design**: Creating efficient database structures
- **Relationships**: Managing foreign keys and data relationships
- **Indexes**: Optimizing query performance with proper indexing
- **Data Validation**: Implementing server-side validation rules
- **Migration Management**: Handling schema updates safely

### 2. API Development
- **Endpoint Design**: RESTful API architecture
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Data Serialization**: Proper JSON response formatting
- **Error Handling**: Consistent error response patterns

### 3. Performance Optimization
- **Query Optimization**: Efficient database queries
- **Caching Strategies**: Response caching and invalidation
- **Rate Limiting**: API protection and quota management
- **Connection Pooling**: Database connection optimization
- **Monitoring**: Performance metrics and alerting

### 4. Security Implementation
- **Input Sanitization**: Preventing injection attacks
- **Authentication**: Secure user management
- **CORS Configuration**: Proper cross-origin policies
- **API Key Management**: Secure credential handling
- **Data Encryption**: Sensitive data protection

## Available Tools & Scripts

### Xano Client Library
```javascript
// Initialize Xano client
const xanoClient = new XanoClient({
  baseURL: process.env.XANO_BASE_URL,
  apiKey: process.env.XANO_API_KEY,
  workspace: process.env.XANO_WORKSPACE_ID
});

// API operations
const data = await xanoClient.get('/users');
const user = await xanoClient.post('/users', userData);
const updated = await xanoClient.patch('/users/123', updates);
```

### Development Scripts
```bash
# Start development utilities
npm run xano:dev

# Sync schema and create backup
npm run xano:sync

# List available backups
node scripts/xano-sync.js list

# Restore from backup
node scripts/xano-sync.js restore backup-2025-08-23.json

# Test API connectivity
node scripts/xano-dev.js test-connection
```

### Health Monitoring
```javascript
// Built-in health monitoring
const healthCheck = await xanoClient.healthCheck();
console.log('Database status:', healthCheck.database);
console.log('API status:', healthCheck.api);
console.log('Response time:', healthCheck.responseTime);
```

## Common Tasks & Solutions

### 1. Database Schema Design

**User Management Schema**:
```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- User profiles table
CREATE TABLE user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

**Content Management Schema**:
```sql
-- Posts table
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(500),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  author_id INT NOT NULL,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at)
);
```

### 2. API Endpoint Development

**Authentication Endpoints**:
```javascript
// POST /auth/register
async function registerUser(req, res) {
  const { email, password, name } = req.body;
  
  // Validate input
  const validation = validateUserData({ email, password, name });
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.errors });
  }
  
  // Check if user exists
  const existingUser = await db.users.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  // Create user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.users.create({
    email,
    password_hash: hashedPassword,
    name
  });
  
  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
    expiresIn: '7d'
  });
}

// POST /auth/login
async function loginUser(req, res) {
  const { email, password } = req.body;
  
  // Find user
  const user = await db.users.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
    expiresIn: '7d'
  });
}
```

**CRUD Endpoints**:
```javascript
// GET /posts - List posts with pagination
async function listPosts(req, res) {
  const { page = 1, limit = 10, status = 'published' } = req.query;
  const offset = (page - 1) * limit;
  
  const posts = await db.posts.findMany({
    where: { status },
    limit: parseInt(limit),
    offset: parseInt(offset),
    orderBy: { published_at: 'desc' },
    include: { author: { select: { name: true } } }
  });
  
  const total = await db.posts.count({ where: { status } });
  
  res.json({
    posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}

// POST /posts - Create new post
async function createPost(req, res) {
  const { title, content, excerpt, featured_image, status = 'draft' } = req.body;
  const author_id = req.user.id;
  
  // Generate slug from title
  const slug = generateSlug(title);
  
  // Check slug uniqueness
  const existingPost = await db.posts.findBySlug(slug);
  if (existingPost) {
    return res.status(409).json({ error: 'Post with this title already exists' });
  }
  
  const post = await db.posts.create({
    title,
    slug,
    content,
    excerpt,
    featured_image,
    status,
    author_id,
    published_at: status === 'published' ? new Date() : null
  });
  
  res.status(201).json({ post });
}
```

### 3. Authentication & Authorization

**JWT Middleware**:
```javascript
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.users.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Role-based authorization
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

### 4. Data Validation & Sanitization

**Input Validation**:
```javascript
const Joi = require('joi');

const schemas = {
  user: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    name: Joi.string().min(2).max(50).required()
  }),
  
  post: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    content: Joi.string().min(10).required(),
    excerpt: Joi.string().max(500).optional(),
    featured_image: Joi.string().uri().optional(),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft')
  })
};

function validateInput(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }
    
    req.body = value;
    next();
  };
}
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Efficient indexes for common queries
CREATE INDEX idx_posts_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id, status);
CREATE INDEX idx_users_email_active ON users(email) WHERE status = 'active';

-- Composite indexes for complex queries
CREATE INDEX idx_posts_search ON posts(status, published_at, title);
```

### 2. Query Optimization
```javascript
// Efficient pagination with cursor-based approach
async function getPaginatedPosts(cursor = null, limit = 10) {
  const whereClause = cursor 
    ? { published_at: { lt: cursor }, status: 'published' }
    : { status: 'published' };
    
  return await db.posts.findMany({
    where: whereClause,
    limit,
    orderBy: { published_at: 'desc' },
    select: {
      id: true,
      title: true,
      excerpt: true,
      published_at: true,
      author: { select: { name: true } }
    }
  });
}
```

### 3. Caching Strategy
```javascript
const cache = require('memory-cache');

// Cache frequently accessed data
async function getCachedUser(userId) {
  const cacheKey = `user:${userId}`;
  let user = cache.get(cacheKey);
  
  if (!user) {
    user = await db.users.findById(userId);
    cache.put(cacheKey, user, 300000); // 5 minutes
  }
  
  return user;
}

// Cache invalidation
async function updateUser(userId, updates) {
  const user = await db.users.update(userId, updates);
  cache.del(`user:${userId}`);
  return user;
}
```

## Environment Management

### Development Environment
```javascript
// Development configuration
const devConfig = {
  database: {
    host: 'dev-db.xano.io',
    pool: { min: 1, max: 5 },
    debug: true
  },
  features: {
    mockData: false,
    seedData: true,
    debugLogging: true
  },
  cors: {
    origin: ['http://localhost:3000', 'https://preview.webflow.io']
  }
};
```

### Staging Environment
```javascript
// Staging configuration
const stagingConfig = {
  database: {
    host: 'staging-db.xano.io',
    pool: { min: 2, max: 10 }
  },
  features: {
    mockData: false,
    seedData: false,
    debugLogging: false
  },
  cors: {
    origin: ['https://staging.yoursite.com', 'https://staging.webflow.io']
  }
};
```

### Production Environment
```javascript
// Production configuration
const prodConfig = {
  database: {
    host: 'prod-db.xano.io',
    pool: { min: 5, max: 20 },
    ssl: true
  },
  features: {
    mockData: false,
    seedData: false,
    debugLogging: false
  },
  cors: {
    origin: ['https://yoursite.com']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per windowMs
  }
};
```

## Monitoring & Health Checks

### API Health Endpoints
```javascript
// GET /health - Basic health check
app.get('/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    await db.query('SELECT 1');
    
    const responseTime = Date.now() - startTime;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.API_VERSION,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /health/detailed - Detailed health check
app.get('/health/detailed', async (req, res) => {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkExternalServices(),
    checkMemoryUsage(),
    checkDiskSpace()
  ]);
  
  const results = {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      external_services: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      memory: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      disk: checks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy'
    }
  };
  
  res.json(results);
});
```

### Performance Monitoring
```javascript
// Request timing middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});
```

## Backup & Migration

### Schema Backup
```javascript
// Automated backup script
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup-${timestamp}.json`;
  
  const tables = await db.getTables();
  const backup = {
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION,
    schema: {},
    data: {}
  };
  
  for (const table of tables) {
    // Export schema
    backup.schema[table.name] = await db.getTableSchema(table.name);
    
    // Export data (with size limits)
    backup.data[table.name] = await db.query(`SELECT * FROM ${table.name} LIMIT 10000`);
  }
  
  await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
  console.log(`✅ Backup created: ${backupFile}`);
  
  return backupFile;
}
```

### Migration Management
```javascript
// Migration runner
async function runMigrations() {
  const migrations = await fs.readdir('./migrations');
  const completed = await db.migrations.getCompleted();
  
  const pending = migrations
    .filter(m => !completed.includes(m))
    .sort();
    
  for (const migration of pending) {
    console.log(`Running migration: ${migration}`);
    
    try {
      const migrationContent = await fs.readFile(`./migrations/${migration}`, 'utf8');
      await db.query(migrationContent);
      await db.migrations.markCompleted(migration);
      
      console.log(`✅ Migration completed: ${migration}`);
    } catch (error) {
      console.error(`❌ Migration failed: ${migration}`, error);
      throw error;
    }
  }
}
```

## Troubleshooting Guide

### Common Issues

**1. Connection Issues:**
```javascript
// Connection pool debugging
app.get('/debug/connections', (req, res) => {
  res.json({
    pool: {
      total: db.pool.totalCount,
      active: db.pool.activeCount, 
      idle: db.pool.idleCount,
      waiting: db.pool.waitingCount
    }
  });
});
```

**2. Performance Issues:**
```javascript
// Query performance analysis
async function analyzeSlowQueries() {
  const slowQueries = await db.query(`
    SELECT query_time, sql_text, rows_examined 
    FROM mysql.slow_log 
    WHERE query_time > 1 
    ORDER BY query_time DESC 
    LIMIT 10
  `);
  
  return slowQueries;
}
```

**3. Authentication Problems:**
```javascript
// Token debugging
function debugToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.decode(token);
      console.log('Token payload:', decoded);
      console.log('Token expired:', decoded.exp < Date.now() / 1000);
    } catch (error) {
      console.log('Token decode error:', error.message);
    }
  }
  
  next();
}
```

## Best Practices

### 1. Security
- Always validate and sanitize input
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Log security events for monitoring
- Use HTTPS in production
- Rotate API keys regularly

### 2. Performance
- Use database indexes strategically
- Implement proper caching
- Optimize queries for common operations
- Monitor and log slow queries
- Use connection pooling
- Implement rate limiting

### 3. Maintainability
- Follow consistent naming conventions
- Document API endpoints thoroughly
- Use proper error handling
- Implement comprehensive testing
- Version your APIs properly
- Maintain migration scripts

## Quick Reference

### Essential Files
- `backend/utils/xano-client.js` - Main API client
- `backend/config/xano-config.js` - Environment configuration
- `scripts/xano-dev.js` - Development utilities
- `scripts/xano-sync.js` - Backup and sync tools

### Key Commands
```bash
# Test API connection
npm run xano:dev

# Create backup
npm run xano:sync

# Health check
curl https://your-api.xano.io/health

# Monitor performance
claude -p '/integration-check'
```

### Monitoring Integration
- **API Health**: Every 5 minutes via GitHub Actions
- **Performance**: Response time and error rate tracking
- **Error Tracking**: Automatic error collection and analysis
- **Backup**: Daily automated backups

---

**Agent Status**: Ready for Xano backend tasks
**Last Updated**: August 23, 2025  
**Expertise Level**: Advanced Xano + Database Management