/**
 * Backend Client Module
 * 
 * This module provides a simple, reusable HTTP client for communicating
 * with our Movies API backend. All frontend API calls go through this client.
 * 
 * Key Benefits:
 * - Centralized base URL (easy to change for production)
 * - Consistent error handling across all API calls
 * - Clean, simple interface - just pass the endpoint
 * - No API keys needed - backend handles authentication with TMDB
 * 
 * Design Philosophy:
 * Keep it simple! The frontend doesn't need to know about TMDB, API keys,
 * or complex URL building. It just calls our backend and gets data back.
 */

/**
 * Base URL for our backend API
 * In production, this would be your deployed backend URL
 */
const BASE_URL = 'http://localhost:8080/api';

/**
 * Makes a GET request to our backend API
 * 
 * This is the main function used by all API calls in the frontend.
 * It handles:
 * - Building the full URL from the endpoint
 * - Making the fetch request
 * - Checking for errors
 * - Parsing and returning JSON data
 * 
 * @async
 * @function
 * @param {string} endpoint - The API endpoint (e.g., '/movies/popular')
 *                            Should start with a forward slash
 * 
 * @returns {Promise<Object>} The parsed JSON response from the backend
 * 
 * @throws {Error} Throws an error if the request fails
 *                 Error message comes from backend or defaults to generic message
 * 
 * @example
 * // Fetch popular movies
 * const movies = await backendFetch('/movies/popular');
 * 
 * @example
 * // Search for movies
 * const results = await backendFetch('/movies/search?query=Matrix');
 * 
 * @example
 * // Get a specific movie
 * const movie = await backendFetch('/movies/550');
 */
export const backendFetch = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      // Try to get error message from response body
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Re-throw to let React Query or calling code handle it
    throw error;
  }
};

/**
 * Helper functions for extracting data from React Query's queryKey
 * 
 * React Query passes data through queryKey arrays. These helpers
 * safely extract the data we need (IDs, search queries, etc.)
 * 
 * We keep these because they're still useful for React Query integration,
 * even though we've migrated to our backend.
 */

/**
 * Extracts a resource ID from React Query's queryKey
 * 
 * @param {Array} queryKey - React Query key array, format: ['resourceType', { id: number }]
 * @returns {number|undefined} The extracted ID
 * 
 * @example
 * const id = extractIdFromQueryKey(['movie', { id: 550 }]);
 * console.log(id); // 550
 */
export const extractIdFromQueryKey = (queryKey) => {
  const [, idPart] = queryKey;
  return idPart?.id;
};

/**
 * Extracts a search query from React Query's queryKey
 * 
 * @param {Array} queryKey - React Query key array, format: ['search', { query: string }]
 * @returns {string|undefined} The extracted search query
 * 
 * @example
 * const query = extractSearchQueryFromQueryKey(['search', { query: 'Matrix' }]);
 * console.log(query); // 'Matrix'
 */
export const extractSearchQueryFromQueryKey = (queryKey) => {
  const [, queryPart] = queryKey;
  return queryPart?.query;
};

