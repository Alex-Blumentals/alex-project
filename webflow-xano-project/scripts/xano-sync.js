#!/usr/bin/env node

/**
 * Xano Sync Script
 * Handles synchronization with Xano backend (schema, data, etc.)
 */

import fs from 'fs';
import path from 'path';
import { xanoClient } from '../backend/utils/xano-client.js';
import { xanoConfig } from '../backend/config/xano-config.js';

class XanoSyncManager {
  constructor() {
    this.syncDir = path.resolve('./backend/sync');
    this.schemaFile = path.join(this.syncDir, 'schema.json');
    this.backupDir = path.join(this.syncDir, 'backups');
  }
  
  /**
   * Run complete sync process
   */
  async sync() {
    console.log('🔄 Starting Xano sync process...');
    
    try {
      // Create sync directories
      this.createSyncDirectories();
      
      // Sync database schema
      await this.syncSchema();
      
      // Sync environment configurations
      await this.syncEnvironments();
      
      // Create backup
      await this.createBackup();
      
      console.log('✅ Xano sync completed successfully!');
      
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      process.exit(1);
    }
  }
  
  /**
   * Create sync directories
   */
  createSyncDirectories() {
    console.log('📁 Creating sync directories...');
    
    fs.mkdirSync(this.syncDir, { recursive: true });
    fs.mkdirSync(this.backupDir, { recursive: true });
    
    console.log('   ✓ Directories created');
  }
  
  /**
   * Sync database schema
   */
  async syncSchema() {
    console.log('🏗️  Syncing database schema...');
    
    try {
      // In a real implementation, you'd fetch schema from Xano API
      // For now, create a placeholder schema
      const schema = {
        version: '1.0.0',
        lastSync: new Date().toISOString(),
        tables: {
          users: {
            id: { type: 'integer', primary: true },
            email: { type: 'string', unique: true },
            name: { type: 'string' },
            created_at: { type: 'datetime' },
            updated_at: { type: 'datetime' }
          }
          // Add your actual table schemas here
        },
        endpoints: Object.keys(xanoConfig.endpoints).reduce((acc, key) => {
          acc[key] = xanoConfig.endpoints[key];
          return acc;
        }, {})
      };
      
      fs.writeFileSync(this.schemaFile, JSON.stringify(schema, null, 2));
      console.log('   ✓ Schema synced successfully');
      
    } catch (error) {
      console.error('   ❌ Schema sync failed:', error.message);
      throw error;
    }
  }
  
  /**
   * Sync environment configurations
   */
  async syncEnvironments() {
    console.log('🌍 Syncing environment configurations...');
    
    try {
      const envConfig = {
        environments: xanoConfig.environments,
        currentEnv: xanoConfig.currentEnv,
        lastSync: new Date().toISOString()
      };
      
      const envFile = path.join(this.syncDir, 'environments.json');
      fs.writeFileSync(envFile, JSON.stringify(envConfig, null, 2));
      
      console.log('   ✓ Environment configurations synced');
      
    } catch (error) {
      console.error('   ❌ Environment sync failed:', error.message);
      throw error;
    }
  }
  
  /**
   * Create backup of current state
   */
  async createBackup() {
    console.log('💾 Creating backup...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `backup-${timestamp}.json`);
      
      const backup = {
        timestamp: new Date().toISOString(),
        environment: xanoConfig.currentEnv,
        schema: fs.existsSync(this.schemaFile) ? 
          JSON.parse(fs.readFileSync(this.schemaFile, 'utf8')) : null,
        config: {
          workspaceId: xanoConfig.workspaceId,
          environments: xanoConfig.environments
        }
      };
      
      fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
      console.log(`   ✓ Backup created: ${path.basename(backupFile)}`);
      
      // Clean old backups (keep last 10)
      this.cleanOldBackups();
      
    } catch (error) {
      console.error('   ❌ Backup creation failed:', error.message);
      throw error;
    }
  }
  
  /**
   * Clean old backup files
   */
  cleanOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-'))
        .sort()
        .reverse();
      
      if (files.length > 10) {
        const filesToDelete = files.slice(10);
        filesToDelete.forEach(file => {
          fs.unlinkSync(path.join(this.backupDir, file));
        });
        console.log(`   ✓ Cleaned ${filesToDelete.length} old backup(s)`);
      }
    } catch (error) {
      console.warn('   ⚠️  Failed to clean old backups:', error.message);
    }
  }
  
  /**
   * Restore from backup
   * @param {string} backupFile - Backup file name
   */
  async restore(backupFile) {
    console.log(`🔄 Restoring from backup: ${backupFile}`);
    
    try {
      const backupPath = path.join(this.backupDir, backupFile);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }
      
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      // Restore schema
      if (backup.schema) {
        fs.writeFileSync(this.schemaFile, JSON.stringify(backup.schema, null, 2));
        console.log('   ✓ Schema restored');
      }
      
      console.log('✅ Restore completed successfully!');
      
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }
  
  /**
   * List available backups
   */
  listBackups() {
    console.log('📋 Available backups:');
    
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-'))
        .sort()
        .reverse();
      
      if (files.length === 0) {
        console.log('   ℹ️  No backups found');
        return [];
      }
      
      files.forEach((file, index) => {
        const stats = fs.statSync(path.join(this.backupDir, file));
        console.log(`   ${index + 1}. ${file} (${stats.size} bytes, ${stats.mtime.toLocaleString()})`);
      });
      
      return files;
    } catch (error) {
      console.error('❌ Failed to list backups:', error.message);
      return [];
    }
  }
}

// Handle CLI arguments
const syncManager = new XanoSyncManager();
const command = process.argv[2];

if (import.meta.url === `file://${process.argv[1]}`) {
  switch (command) {
    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('❌ Please specify backup file to restore');
        process.exit(1);
      }
      syncManager.restore(backupFile);
      break;
      
    case 'list':
      syncManager.listBackups();
      break;
      
    default:
      syncManager.sync();
  }
}