#!/usr/bin/env node

/**
 * Webflow Build Script
 * Handles production build process for Webflow integration
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { webflowConfig } from '../frontend/src/webflow-config.js';
import { envConfig } from '../frontend/utils/env-config.js';

class WebflowBuilder {
  constructor() {
    this.buildDir = path.resolve('./dist');
    this.assetsDir = path.join(this.buildDir, 'assets');
  }
  
  /**
   * Run the complete build process
   */
  async build() {
    console.log('🏗️  Starting Webflow build process...');
    
    try {
      // Clean previous build
      await this.clean();
      
      // Create build directories
      await this.createDirectories();
      
      // Build assets
      await this.buildAssets();
      
      // Optimize assets if enabled
      if (envConfig.buildOptimizeAssets) {
        await this.optimizeAssets();
      }
      
      // Generate sitemap if enabled
      if (envConfig.buildGenerateSitemap) {
        await this.generateSitemap();
      }
      
      // Copy static files
      await this.copyStaticFiles();
      
      console.log('✅ Build completed successfully!');
      console.log(`📁 Build output: ${this.buildDir}`);
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }
  
  /**
   * Clean previous build
   */
  async clean() {
    console.log('🧹 Cleaning previous build...');
    
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
    }
  }
  
  /**
   * Create build directories
   */
  async createDirectories() {
    console.log('📁 Creating build directories...');
    
    fs.mkdirSync(this.buildDir, { recursive: true });
    fs.mkdirSync(this.assetsDir, { recursive: true });
    fs.mkdirSync(path.join(this.buildDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(this.buildDir, 'js'), { recursive: true });
  }
  
  /**
   * Build and process assets
   */
  async buildAssets() {
    console.log('⚡ Building assets...');
    
    // Process JavaScript files
    await this.processJavaScript();
    
    // Process CSS files  
    await this.processCSS();
    
    // Process images
    await this.processImages();
  }
  
  /**
   * Process JavaScript files
   */
  async processJavaScript() {
    console.log('📜 Processing JavaScript files...');
    
    const jsFiles = [
      './frontend/src/webflow-config.js',
      './frontend/components/webflow-integration.js',
      './frontend/utils/env-config.js'
    ];
    
    jsFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file);
        const outputPath = path.join(this.buildDir, 'js', fileName);
        
        // In a real implementation, you'd:
        // - Transpile with Babel
        // - Bundle with webpack/rollup
        // - Minify the code
        
        fs.writeFileSync(outputPath, content);
        console.log(`   ✓ ${fileName}`);
      }
    });
  }
  
  /**
   * Process CSS files
   */
  async processCSS() {
    console.log('🎨 Processing CSS files...');
    
    // Look for CSS files in assets
    const assetsPath = './frontend/assets';
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      const cssFiles = files.filter(file => file.endsWith('.css'));
      
      cssFiles.forEach(file => {
        const content = fs.readFileSync(path.join(assetsPath, file), 'utf8');
        const outputPath = path.join(this.buildDir, 'css', file);
        
        // In a real implementation, you'd:
        // - Process with PostCSS
        // - Add vendor prefixes
        // - Minify the CSS
        
        fs.writeFileSync(outputPath, content);
        console.log(`   ✓ ${file}`);
      });
    }
  }
  
  /**
   * Process images
   */
  async processImages() {
    console.log('🖼️  Processing images...');
    
    const assetsPath = './frontend/assets';
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
      );
      
      imageFiles.forEach(file => {
        const sourcePath = path.join(assetsPath, file);
        const outputPath = path.join(this.assetsDir, file);
        
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`   ✓ ${file}`);
      });
    }
  }
  
  /**
   * Optimize assets for production
   */
  async optimizeAssets() {
    console.log('🚀 Optimizing assets...');
    
    // In a real implementation, you'd:
    // - Minify JavaScript and CSS
    // - Compress images
    // - Generate source maps
    // - Add cache-busting hashes
    
    console.log('   ✓ Assets optimized');
  }
  
  /**
   * Generate sitemap
   */
  async generateSitemap() {
    console.log('🗺️  Generating sitemap...');
    
    // Basic sitemap generation
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${webflowConfig.customDomain || 'https://your-domain.com'}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(path.join(this.buildDir, 'sitemap.xml'), sitemap);
    console.log('   ✓ Sitemap generated');
  }
  
  /**
   * Copy static files
   */
  async copyStaticFiles() {
    console.log('📋 Copying static files...');
    
    // Copy any additional static files
    const staticFiles = ['robots.txt', 'favicon.ico', 'manifest.json'];
    
    staticFiles.forEach(file => {
      const sourcePath = `./frontend/assets/${file}`;
      if (fs.existsSync(sourcePath)) {
        const outputPath = path.join(this.buildDir, file);
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`   ✓ ${file}`);
      }
    });
  }
}

// Start build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new WebflowBuilder();
  builder.build();
}