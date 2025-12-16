import fetch from 'node-fetch';

/**
 * TMDB API Module - Backend
 * 
 * This module centralizes ALL communication with The Movie Database (TMDB) API.
 * The frontend never talks to TMDB directly - it goes through our backend instead.
 * 
 * Benefits:
 * - API key is kept secure on the server
 * - Single place to update if TMDB API changes
 * - Can add caching, rate limiting, or data transformation here
 * 
 * All functions follow the same pattern:
 * 1. Build the TMDB URL with API key
 * 2. Make the fetch request
 * 3. Check for errors
 * 4. Return the JSON data
 */

// Base URL for all TMDB API calls
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// ============================================
// MOVIE LIST ENDPOINTS
// These return lists/collections of movies
// ============================================

/**
 * Get discover movies - a curated list for the homepage
 */
export const getMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movies');
    }

    return await response.json();
};

/**
 * Get upcoming movies - movies coming soon to theaters
 */
export const getUpcomingMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch upcoming movies');
    }

    return await response.json();
};

/**
 * Get popular movies - currently trending based on user activity
 */
export const getPopularMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch popular movies');
    }

    return await response.json();
};

/**
 * Get top rated movies - highest rated movies of all time
 */
export const getTopRatedMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch top rated movies');
    }

    return await response.json();
};

/**
 * Get now playing movies - currently in theaters
 */
export const getNowPlayingMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch now playing movies');
    }

    return await response.json();
};

/**
 * Get trending movies - what's hot this week
 */
export const getTrendingMovies = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch trending movies');
    }

    return await response.json();
};

/**
 * Get all movie genres - for filtering/categorization
 */
export const getGenres = async () => {
    const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch genres');
    }

    return await response.json();
};

// ============================================
// SINGLE MOVIE ENDPOINTS
// These return data for a specific movie by ID
// ============================================

/**
 * Get movie details by ID
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovie = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie details');
    }

    return await response.json();
};

/**
 * Get movie images (posters, backdrops)
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovieImages = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/images?api_key=${process.env.TMDB_KEY}`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie images');
    }

    return await response.json();
};

/**
 * Get movie reviews from users
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovieReviews = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie reviews');
    }

    return await response.json();
};

/**
 * Get movie credits (cast and crew)
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovieCredits = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie credits');
    }

    return await response.json();
};

/**
 * Get recommended movies based on a movie
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovieRecommendations = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch movie recommendations');
    }

    return await response.json();
};

/**
 * Get similar movies
 * @param {string|number} id - The TMDB movie ID
 */
export const getMovieSimilar = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch similar movies');
    }

    return await response.json();
};

// ============================================
// SEARCH ENDPOINTS
// ============================================

/**
 * Search for movies by query string
 * @param {string} query - The search term
 */
export const searchMovies = async (query) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to search movies');
    }

    return await response.json();
};

// ============================================
// PEOPLE ENDPOINTS
// These return data about actors, directors, etc.
// ============================================

/**
 * Get person details by ID
 * @param {string|number} id - The TMDB person ID
 */
export const getPersonDetails = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/person/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch person details');
    }

    return await response.json();
};

/**
 * Get a person's movie credits (filmography)
 * @param {string|number} id - The TMDB person ID
 */
export const getPersonMovieCredits = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${process.env.TMDB_KEY}&language=en-US`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to fetch person movie credits');
    }

    return await response.json();
};

/**
 * Search for people by query string
 * @param {string} query - The search term
 */
export const searchPeople = async (query) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/search/person?api_key=${process.env.TMDB_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.status_message || 'Failed to search people');
    }

    return await response.json();
};
