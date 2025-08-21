/**
 * Xano Type Definitions
 * Define types for your Xano data structures
 */

/**
 * @typedef {Object} XanoUser
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Update timestamp
 */

/**
 * @typedef {Object} XanoAuthResponse  
 * @property {string} authToken - JWT authentication token
 * @property {string} refreshToken - Refresh token
 * @property {XanoUser} user - User data
 */

/**
 * @typedef {Object} XanoApiResponse
 * @property {boolean} success - Request success status
 * @property {*} data - Response data
 * @property {string} message - Response message
 * @property {Array} errors - Error details if any
 */

/**
 * @typedef {Object} XanoPaginationResponse
 * @property {Array} items - Data items
 * @property {number} total - Total count
 * @property {number} page - Current page
 * @property {number} per_page - Items per page
 * @property {number} total_pages - Total pages
 */

/**
 * Common Xano API error codes
 */
export const XanoErrorCodes = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500
};

/**
 * Xano field types for validation
 */
export const XanoFieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATETIME: 'datetime',
  JSON: 'json',
  FILE: 'file',
  RELATION: 'relation'
};

/**
 * Type guards for runtime type checking
 */
export const isXanoUser = (obj) => {
  return obj && typeof obj.id === 'number' && typeof obj.email === 'string';
};

export const isXanoAuthResponse = (obj) => {
  return obj && typeof obj.authToken === 'string' && isXanoUser(obj.user);
};

export const isXanoApiResponse = (obj) => {
  return obj && typeof obj.success === 'boolean';
};