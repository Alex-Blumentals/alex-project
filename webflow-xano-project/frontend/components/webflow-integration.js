/**
 * Webflow Integration Components
 * Helper functions for integrating with Webflow CMS and interactions
 */

import { webflowConfig } from '../src/webflow-config.js';

/**
 * Load Webflow CMS data
 * @param {string} collectionId - Webflow collection ID
 * @param {Object} options - Query options
 */
export const loadCMSData = async (collectionId, options = {}) => {
  try {
    const { limit = 100, offset = 0, sort = [] } = options;
    
    // This would integrate with Webflow API
    const response = await fetch(`https://api.webflow.com/collections/${collectionId}/items`, {
      headers: {
        'Authorization': `Bearer ${webflowConfig.apiToken}`,
        'Accept-Version': '1.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error loading CMS data:', error);
    return [];
  }
};

/**
 * Initialize Webflow interactions
 * Call this after DOM is loaded
 */
export const initWebflowInteractions = () => {
  // Initialize Webflow's built-in interactions
  if (typeof Webflow !== 'undefined') {
    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
  }
};

/**
 * Update CMS item
 * @param {string} collectionId - Webflow collection ID  
 * @param {string} itemId - Item ID to update
 * @param {Object} data - Data to update
 */
export const updateCMSItem = async (collectionId, itemId, data) => {
  try {
    const response = await fetch(`https://api.webflow.com/collections/${collectionId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${webflowConfig.apiToken}`,
        'Accept-Version': '1.0.0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });
    
    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating CMS item:', error);
    throw error;
  }
};

/**
 * Create new CMS item
 * @param {string} collectionId - Webflow collection ID
 * @param {Object} data - Item data
 */
export const createCMSItem = async (collectionId, data) => {
  try {
    const response = await fetch(`https://api.webflow.com/collections/${collectionId}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${webflowConfig.apiToken}`,
        'Accept-Version': '1.0.0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });
    
    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating CMS item:', error);
    throw error;
  }
};