import http, { setClerkTokenGetter, setOnUnauthorized } from '../utils/http';
import { apiRequest } from './client';

/**
 * apiClient is the raw Axios instance for direct calls
 */
export const apiClient = http;

/**
 * setClerkTokenGetter links Clerk auth with Axios interceptors
 */
export { setClerkTokenGetter, setOnUnauthorized };

/**
 * apiRequest contains all structured API methods
 */
export { apiRequest };

export default apiClient;
