/**
 * TMDB API Configuration Module
 *
 * This module centralizes all configuration values for The Movie Database (TMDB) API integration.
 * I designed this module to make API configuration maintainable and secure by keeping all
 * settings in one place and using environment variables for sensitive data.
 *
 * Key Benefits:
 * - I centralize all API URLs and default parameters for consistency
 * - I protect the API key by loading it from environment variables
 * - I make it easy to update API settings without touching business logic
 * - I provide reusable configuration for both data fetching and image URLs
 *
 * @module config
 * @requires vite - Uses Vite's environment variable system (import.meta.env)
 */

/**
 * Core configuration object for TMDB API interactions.
 *
 * I maintain all essential API settings in this configuration object to ensure consistency
 * across the entire application. The API key is loaded from environment variables to keep
 * it secure and prevent accidental exposure in version control.
 *
 * @constant {Object}
 * @property {string} BASE_URL - The base URL for all TMDB API v3 endpoints. I use version 3
 *                                as it's the stable, production-ready API version.
 * @property {string} API_KEY - The authentication key for TMDB API access. I load this from
 *                               environment variables (VITE_TMDB_KEY) for security.
 * @property {string} IMAGE_BASE_URL - The base URL for fetching movie posters and images.
 *                                      I keep this separate from BASE_URL because image URLs
 *                                      follow a different structure.
 * @property {string} DEFAULT_LANGUAGE - The default language code for API responses. I use
 *                                        'en-US' to ensure consistent English content.
 * @property {Object} DEFAULT_PARAMS - Parameters automatically included in every API request.
 *                                      I define these defaults to avoid repeating them in
 *                                      every API call.
 * @property {string} DEFAULT_PARAMS.language - Language parameter included in all requests.
 *
 * @example
 * // Access the base URL
 * console.log(API_CONFIG.BASE_URL); // "https://api.themoviedb.org/3"
 *
 * // Access the image base URL for constructing poster URLs
 * const posterUrl = `${API_CONFIG.IMAGE_BASE_URL}/w500/poster_path.jpg`;
 */
export const API_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: import.meta.env.VITE_TMDB_KEY,
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  DEFAULT_LANGUAGE: "en-US",
  DEFAULT_PARAMS: {
    language: "en-US",
  },
};

/**
 * Constructs a complete TMDB API URL with query parameters.
 *
 * I created this function to handle all the complexities of URL construction in one place.
 * It takes an endpoint path and optional parameters, then builds a complete URL with the
 * API key and all necessary query parameters properly formatted and encoded.
 *
 * My approach:
 * 1. I construct the full URL by combining the base URL with the endpoint
 * 2. I automatically append the API key (required for all TMDB requests)
 * 3. I merge default parameters with custom ones, giving custom parameters priority
 * 4. I filter out null/undefined values to keep URLs clean
 * 5. I use URL's built-in encoding to handle special characters safely
 *
 * @function
 * @param {string} endpoint - The API endpoint path (e.g., "/movie/popular" or "/search/movie").
 *                            Should start with a forward slash.
 * @param {Object} [params={}] - Optional query parameters to include in the request.
 *                                These will be merged with DEFAULT_PARAMS.
 *
 * @returns {string} A complete, properly encoded URL ready for fetching, including the base URL,
 *                   endpoint, API key, and all query parameters
 *
 * @example
 * // Build a URL for the popular movies endpoint
 * const url = buildUrl("/movie/popular", { page: 1 });
 * // Returns: "https://api.themoviedb.org/3/movie/popular?api_key=xxx&language=en-US&page=1"
 *
 * @example
 * // Build a search URL with custom parameters
 * const searchUrl = buildUrl("/search/movie", { query: "The Matrix", page: 2 });
 * // Returns: "https://api.themoviedb.org/3/search/movie?api_key=xxx&language=en-US&query=The%20Matrix&page=2"
 *
 * @example
 * // Null values are automatically filtered out
 * const cleanUrl = buildUrl("/movie/123", { someParam: null, page: 1 });
 * // The 'someParam' won't be included in the URL
 */
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);

  // Add API key
  url.searchParams.append("api_key", API_CONFIG.API_KEY);

  // Add default and custom parameters
  const allParams = { ...API_CONFIG.DEFAULT_PARAMS, ...params };
  Object.entries(allParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
};
