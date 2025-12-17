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
  const response = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    // Try to get error message from response body
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  return await response.json();
};

// ============================================
// AUTHENTICATION API FUNCTIONS
// These handle user signup and login
// ============================================

/**
 * Registers a new user account
 * 
 * Sends a POST request to create a new user in the database.
 * The backend validates:
 * - Username: 3-20 characters, alphanumeric and underscore only
 * - Password: 8+ characters, must include letter, digit, and special character
 * 
 * @async
 * @function
 * @param {string} username - The desired username (3-20 chars, alphanumeric + underscore)
 * @param {string} password - The password (8+ chars, letter + digit + special char)
 * 
 * @returns {Promise<string>} Success message from the backend
 * 
 * @throws {Error} Throws if registration fails (e.g., username taken, invalid password)
 *                 Error message contains the specific reason from backend
 * 
 * @example
 * try {
 *   const message = await signup('john_doe', 'SecurePass123!');
 *   console.log(message); // "User successfully created."
 * } catch (error) {
 *   console.log(error.message); // "Username must be 3-20 characters..."
 * }
 */
export const signup = async (username, password) => {
  const response = await fetch(`${BASE_URL}/users?action=register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  // Check if the backend returned success: false
  if (!data.success) {
    throw new Error(data.msg || 'Registration failed');
  }

  return data.msg;
};

/**
 * Authenticates a user and returns a JWT token
 * 
 * Sends a POST request to verify credentials and receive an authentication token.
 * The token should be stored and included in subsequent authenticated requests.
 * 
 * @async
 * @function
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * 
 * @returns {Promise<string>} JWT token for authenticated requests
 * 
 * @throws {Error} Throws if login fails (e.g., wrong password, user not found)
 *                 Error message contains the specific reason from backend
 * 
 * @example
 * try {
 *   const token = await login('john_doe', 'SecurePass123!');
 *   localStorage.setItem('token', token);
 * } catch (error) {
 *   console.log(error.message); // "Authentication failed. User not found."
 * }
 */
export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  // Check if the backend returned success: false
  if (!data.success) {
    throw new Error(data.msg || 'Login failed');
  }

  return data.token;
};

// ============================================
// FAVORITES API FUNCTIONS
// These handle user's favorite movies list
// All require authentication (token parameter)
// ============================================

/**
 * Gets the authenticated user's list of favorite movie IDs
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * 
 * @returns {Promise<number[]>} Array of TMDB movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const favorites = await getFavorites(token);
 * console.log(favorites); // [550, 438631, 157336]
 */
export const getFavorites = async (token) => {
  const response = await fetch(`${BASE_URL}/users/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to get favorites');
  }

  return data.favorites;
};

/**
 * Adds a movie to the user's favorites list
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * @param {number} movieId - TMDB movie ID to add
 * 
 * @returns {Promise<number[]>} Updated array of favorite movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const updatedFavorites = await addFavorite(token, 550);
 */
export const addFavorite = async (token, movieId) => {
  const response = await fetch(`${BASE_URL}/users/favorites/${movieId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to add favorite');
  }

  return data.favorites;
};

/**
 * Removes a movie from the user's favorites list
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * @param {number} movieId - TMDB movie ID to remove
 * 
 * @returns {Promise<number[]>} Updated array of favorite movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const updatedFavorites = await removeFavorite(token, 550);
 */
export const removeFavorite = async (token, movieId) => {
  const response = await fetch(`${BASE_URL}/users/favorites/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to remove favorite');
  }

  return data.favorites;
};

// ============================================
// MUST-WATCH API FUNCTIONS
// These handle user's must-watch movies list
// All require authentication (token parameter)
// ============================================

/**
 * Gets the authenticated user's list of must-watch movie IDs
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * 
 * @returns {Promise<number[]>} Array of TMDB movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const mustWatch = await getMustWatch(token);
 * console.log(mustWatch); // [438631, 157336]
 */
export const getMustWatch = async (token) => {
  const response = await fetch(`${BASE_URL}/users/mustwatch`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to get must-watch list');
  }

  return data.mustWatch;
};

/**
 * Adds a movie to the user's must-watch list
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * @param {number} movieId - TMDB movie ID to add
 * 
 * @returns {Promise<number[]>} Updated array of must-watch movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const updatedMustWatch = await addToMustWatch(token, 438631);
 */
export const addToMustWatch = async (token, movieId) => {
  const response = await fetch(`${BASE_URL}/users/mustwatch/${movieId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to add to must-watch');
  }

  return data.mustWatch;
};

/**
 * Removes a movie from the user's must-watch list
 * 
 * @async
 * @function
 * @param {string} token - JWT token from login
 * @param {number} movieId - TMDB movie ID to remove
 * 
 * @returns {Promise<number[]>} Updated array of must-watch movie IDs
 * 
 * @throws {Error} Throws if not authenticated or request fails
 * 
 * @example
 * const updatedMustWatch = await removeFromMustWatch(token, 438631);
 */
export const removeFromMustWatch = async (token, movieId) => {
  const response = await fetch(`${BASE_URL}/users/mustwatch/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.msg || 'Failed to remove from must-watch');
  }

  return data.mustWatch;
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

