import {
  backendFetch,
  extractIdFromQueryKey,
  extractSearchQueryFromQueryKey,
} from "./backend-client";

/**
 * Movies API Module - Frontend
 * 
 * This module provides all API functions for the React frontend.
 * ALL calls now go through our backend API instead of directly to TMDB.
 * 
 * Key Changes from Original:
 * - Uses backendFetch() instead of apiClient()
 * - No API key handling (backend has it)
 * - Simpler URLs (just our backend endpoints)
 * - Same function signatures (React Query compatible)
 * 
 * The frontend doesn't know or care about TMDB anymore.
 * It just calls our backend and gets movie data back.
 */

// ============================================
// MOVIE LIST ENDPOINTS
// These return collections of movies
// ============================================

/**
 * Fetches discover movies for the homepage
 */
export const getMovies = () => {
  return backendFetch('/movies/discover');
};

/**
 * Fetches upcoming movies (coming soon to theaters)
 */
export const getUpcomingMovies = () => {
  return backendFetch('/movies/upcoming');
};

/**
 * Fetches currently popular movies
 */
export const getPopularMovies = () => {
  return backendFetch('/movies/popular');
};

/**
 * Fetches top rated movies of all time
 */
export const getTopRatedMovies = () => {
  return backendFetch('/movies/top-rated');
};

/**
 * Fetches movies currently in theaters
 */
export const getNowPlayingMovies = () => {
  return backendFetch('/movies/now-playing');
};

/**
 * Fetches trending movies this week
 */
export const getTrendingMovies = () => {
  return backendFetch('/movies/trending');
};

/**
 * Fetches all available movie genres
 */
export const getGenres = () => {
  return backendFetch('/movies/genres');
};

// ============================================
// SINGLE MOVIE ENDPOINTS
// These return data for a specific movie
// ============================================

/**
 * Fetches detailed information about a specific movie
 * @param {Object} args - React Query arguments
 * @param {Array} args.queryKey - Contains the movie ID
 */
export const getMovie = (args) => {
  const id = extractIdFromQueryKey(args.queryKey);
  return backendFetch(`/movies/${id}`);
};

/**
 * Fetches images for a specific movie
 * @param {Object} args - React Query arguments
 */
export const getMovieImages = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/movies/${id}/images`);
};

/**
 * Fetches user reviews for a specific movie
 * @param {Object} args - React Query arguments
 */
export const getMovieReviews = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/movies/${id}/reviews`);
};

/**
 * Fetches cast and crew for a specific movie
 * @param {Object} args - React Query arguments
 */
export const getMovieCredits = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/movies/${id}/credits`);
};

/**
 * Fetches recommended movies based on a specific movie
 * @param {Object} args - React Query arguments
 */
export const getMovieRecommendations = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/movies/${id}/recommendations`);
};

/**
 * Fetches movies similar to a specific movie
 * @param {Object} args - React Query arguments
 */
export const getMovieSimilar = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/movies/${id}/similar`);
};

// ============================================
// SEARCH ENDPOINTS
// ============================================

/**
 * Searches for movies by title
 * @param {Object} args - React Query arguments
 * @param {Array} args.queryKey - Contains the search query
 */
export const searchMovies = ({ queryKey }) => {
  const query = extractSearchQueryFromQueryKey(queryKey);
  return backendFetch(`/movies/search?query=${encodeURIComponent(query)}`);
};

// ============================================
// PEOPLE ENDPOINTS
// These return data about actors, directors, etc.
// ============================================

/**
 * Fetches detailed information about a person (actor/director)
 * @param {Object} args - React Query arguments
 * @param {Array} args.queryKey - Contains the person ID
 */
export const getPersonDetails = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/people/${id}`);
};

/**
 * Fetches a person's filmography (movie credits)
 * @param {Object} args - React Query arguments
 */
export const getPersonMovieCredits = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return backendFetch(`/people/${id}/movie-credits`);
};

/**
 * Searches for people (actors, directors) by name
 * @param {Object} args - React Query arguments
 * @param {Array} args.queryKey - Contains the search query
 */
export const searchPeople = ({ queryKey }) => {
  const query = extractSearchQueryFromQueryKey(queryKey);
  return backendFetch(`/people/search?query=${encodeURIComponent(query)}`);
};
