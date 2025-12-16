import { buildUrl } from "./config";

/**
 * API Client Module
 *
 * This module provides the core HTTP client and utility functions for interacting with the TMDB API.
 * I created this centralized client to ensure consistent error handling, request formatting, and
 * response parsing across the entire application.
 *
 * Key Features:
 * - I centralize all HTTP requests through a single apiClient function
 * - I handle errors consistently and provide meaningful error messages
 * - I integrate seamlessly with React Query by re-throwing errors for its error handling
 * - I provide utility functions to extract data from React Query's queryKey pattern
 *
 * Design Philosophy:
 * I designed this module to be the single source of truth for HTTP communication. By funneling
 * all requests through one client, I can easily add features like retry logic, caching headers,
 * or request interceptors in the future without modifying individual API calls.
 *
 * @module client
 * @requires ./config - Provides buildUrl function for constructing API URLs
 */
/**
 * Unified HTTP client for all TMDB API requests.
 *
 * I created this centralized client to handle all API communication in a consistent manner.
 * My approach ensures that every API call follows the same pattern: build URL, fetch data,
 * handle errors gracefully, and return parsed JSON.
 *
 * How I handle requests:
 * 1. I extract parameters from the options object
 * 2. I build the complete URL using the buildUrl helper (includes API key automatically)
 * 3. I make the HTTP request using the Fetch API
 * 4. I check if the response was successful (status 200-299)
 * 5. If successful, I parse and return the JSON data
 * 6. If failed, I attempt to extract a meaningful error message from the response
 * 7. I throw the error so React Query can handle it (for retry logic, error states, etc.)
 *
 * Error Handling Strategy:
 * I try to extract TMDB's status_message from error responses because it provides more
 * context than generic HTTP status codes. If that fails, I fall back to a generic error
 * message with the status code. I re-throw all errors to let React Query manage them,
 * which gives us automatic retry logic and error state management.
 *
 * @async
 * @function
 * @param {string} endpoint - The API endpoint path (e.g., "/movie/popular").
 *                            Should start with a forward slash.
 * @param {Object} [options={}] - Configuration options for the request
 * @param {Object} [options.params={}] - Query parameters to append to the URL.
 *                                        These will be merged with default parameters.
 *
 * @returns {Promise<Object>} A promise resolving to the parsed JSON response from the API
 *
 * @throws {Error} Throws an error if the request fails or returns a non-OK status.
 *                 The error message will contain either TMDB's status_message or a
 *                 generic message with the HTTP status code.
 *
 * @example
 * // Fetch popular movies
 * const movies = await apiClient("/movie/popular", {
 *   params: { page: 1 }
 * });
 * console.log(movies.results);
 *
 * @example
 * // Fetch a specific movie
 * const movie = await apiClient("/movie/123");
 * console.log(movie.title);
 *
 * @example
 * // Handle errors (typically done by React Query)
 * try {
 *   const data = await apiClient("/invalid/endpoint");
 * } catch (error) {
 *   console.error(error.message); // "API Error: 404" or TMDB's error message
 * }
 */
export const apiClient = async (endpoint, options = {}) => {
  const { params = {} } = options;
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Try to get error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.status_message || `API Error: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    // Re-throw to let React Query handle it
    throw error;
  }
};

/**
 * Extracts a resource ID from React Query's queryKey array.
 *
 * I created this helper to handle the common pattern where React Query stores resource IDs
 * in the queryKey. When using React Query, I need to pass the ID through the queryKey to
 * ensure proper caching and refetching behavior. This function safely extracts that ID.
 *
 * How React Query's queryKey works:
 * React Query uses the queryKey as a unique identifier for cached data. I typically structure
 * keys as ['resourceType', { id: 123 }] where the first element describes what we're fetching
 * and the second element contains the specific parameters like the ID.
 *
 * My extraction approach:
 * 1. I destructure the array, skipping the first element (the resource name)
 * 2. I access the second element which should be an object containing the id
 * 3. I use optional chaining (?.) to safely handle cases where the structure might be unexpected
 *
 * @function
 * @param {Array} queryKey - React Query's queryKey array, expected format: ['resourceType', { id: number }]
 *                           or similar variations like ['movie', { id: 123 }]
 *
 * @returns {number|undefined} The extracted ID, or undefined if the ID cannot be found
 *
 * @example
 * // Extract movie ID from queryKey
 * const movieId = extractIdFromQueryKey(['movie', { id: 550 }]);
 * console.log(movieId); // 550
 *
 * @example
 * // Safe handling when ID is missing
 * const noId = extractIdFromQueryKey(['movie', {}]);
 * console.log(noId); // undefined
 *
 * @example
 * // Typical usage in an API function
 * export const getMovie = ({ queryKey }) => {
 *   const id = extractIdFromQueryKey(queryKey);
 *   return apiClient(`/movie/${id}`);
 * };
 */
export const extractIdFromQueryKey = (queryKey) => {
  const [, idPart] = queryKey;
  return idPart?.id;
};

/**
 * Extracts a search query string from React Query's queryKey array.
 *
 * I created this helper specifically for search-related API calls where I need to pass
 * a search query through React Query's queryKey system. This ensures that different search
 * terms create different cache entries, preventing incorrect results from being displayed.
 *
 * Why I need this:
 * When implementing search functionality with React Query, I must include the search term
 * in the queryKey so that searches for "Matrix" and "Inception" are cached separately.
 * This function extracts that search term safely and consistently.
 *
 * My extraction approach:
 * 1. I destructure the queryKey array, skipping the first element (usually 'search' or similar)
 * 2. I access the second element which should be an object containing the query string
 * 3. I use optional chaining (?.) to prevent errors if the structure is unexpected
 *
 * @function
 * @param {Array} queryKey - React Query's queryKey array, expected format: ['searchType', { query: string }]
 *                           or similar variations like ['movieSearch', { query: 'The Matrix' }]
 *
 * @returns {string|undefined} The extracted search query string, or undefined if not found
 *
 * @example
 * // Extract search query from queryKey
 * const searchTerm = extractSearchQueryFromQueryKey(['movieSearch', { query: 'The Matrix' }]);
 * console.log(searchTerm); // "The Matrix"
 *
 * @example
 * // Safe handling when query is missing
 * const noQuery = extractSearchQueryFromQueryKey(['movieSearch', {}]);
 * console.log(noQuery); // undefined
 *
 * @example
 * // Typical usage in a search API function
 * export const searchMovies = ({ queryKey }) => {
 *   const query = extractSearchQueryFromQueryKey(queryKey);
 *   return apiClient('/search/movie', { params: { query } });
 * };
 */
export const extractSearchQueryFromQueryKey = (queryKey) => {
  const [, queryPart] = queryKey;
  return queryPart?.query;
};
