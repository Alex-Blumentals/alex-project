/**
 * Xano API Client
 * Centralized client for interacting with Xano backend
 */

import axios from 'axios';
import { xanoConfig, buildEndpointUrl } from '../config/xano-config.js';

class XanoClient {
  constructor() {
    this.authToken = null;
    this.refreshToken = null;
    
    // Create axios instance
    this.client = axios.create({
      timeout: xanoConfig.request.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Setup request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Setup response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAuthToken();
            // Retry original request
            return this.client.request(error.config);
          } catch (refreshError) {
            this.clearTokens();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Set authentication tokens
   * @param {string} authToken 
   * @param {string} refreshToken 
   */
  setTokens(authToken, refreshToken = null) {
    this.authToken = authToken;
    this.refreshToken = refreshToken;
  }
  
  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.authToken = null;
    this.refreshToken = null;
  }
  
  /**
   * Refresh authentication token
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.client.post(
      buildEndpointUrl(xanoConfig.endpoints.auth.refresh),
      { refresh_token: this.refreshToken }
    );
    
    const { authToken, refreshToken } = response.data;
    this.setTokens(authToken, refreshToken);
    
    return { authToken, refreshToken };
  }
  
  /**
   * Make GET request
   * @param {string} endpoint 
   * @param {Object} params 
   */
  async get(endpoint, params = {}) {
    const response = await this.client.get(buildEndpointUrl(endpoint), { params });
    return response.data;
  }
  
  /**
   * Make POST request
   * @param {string} endpoint 
   * @param {Object} data 
   */
  async post(endpoint, data = {}) {
    const response = await this.client.post(buildEndpointUrl(endpoint), data);
    return response.data;
  }
  
  /**
   * Make PUT request
   * @param {string} endpoint 
   * @param {Object} data 
   */
  async put(endpoint, data = {}) {
    const response = await this.client.put(buildEndpointUrl(endpoint), data);
    return response.data;
  }
  
  /**
   * Make DELETE request
   * @param {string} endpoint 
   */
  async delete(endpoint) {
    const response = await this.client.delete(buildEndpointUrl(endpoint));
    return response.data;
  }
  
  /**
   * Authentication methods
   */
  async login(email, password) {
    const response = await this.post(xanoConfig.endpoints.auth.login, {
      email,
      password
    });
    
    if (response.authToken) {
      this.setTokens(response.authToken, response.refreshToken);
    }
    
    return response;
  }
  
  async register(userData) {
    const response = await this.post(xanoConfig.endpoints.auth.register, userData);
    
    if (response.authToken) {
      this.setTokens(response.authToken, response.refreshToken);
    }
    
    return response;
  }
  
  async logout() {
    try {
      await this.post(xanoConfig.endpoints.auth.logout);
    } finally {
      this.clearTokens();
    }
  }
  
  /**
   * User methods
   */
  async getUserProfile() {
    return this.get(xanoConfig.endpoints.users.profile);
  }
  
  async updateUserProfile(userData) {
    return this.put(xanoConfig.endpoints.users.update, userData);
  }
}

// Export singleton instance
export const xanoClient = new XanoClient();
export default XanoClient;