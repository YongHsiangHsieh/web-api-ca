import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    getMovies,
    getUpcomingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getTrendingMovies,
    getGenres,
    getMovie,
    getMovieImages,
    getMovieReviews,
    getMovieCredits,
    getMovieRecommendations,
    getMovieSimilar,
    searchMovies
} from '../tmdb-api';

const router = express.Router();

/**
 * Movies Router
 * 
 * This router handles all movie-related API endpoints.
 * Each route calls the corresponding function from tmdb-api.js
 * 
 * Route naming convention: Clean, lowercase, hyphenated
 * Example: /top-rated instead of /top_rated
 */

// ============================================
// MOVIE LIST ROUTES
// These return collections of movies
// ============================================

/**
 * GET /api/movies/discover
 * Returns a curated list of discover movies for the homepage
 */
router.get('/discover', asyncHandler(async (req, res) => {
    const movies = await getMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/upcoming
 * Returns movies coming soon to theaters
 */
router.get('/upcoming', asyncHandler(async (req, res) => {
    const movies = await getUpcomingMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/popular
 * Returns currently popular movies
 */
router.get('/popular', asyncHandler(async (req, res) => {
    const movies = await getPopularMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/top-rated
 * Returns highest rated movies of all time
 * Note: Using clean URL (top-rated) instead of TMDB's (top_rated)
 */
router.get('/top-rated', asyncHandler(async (req, res) => {
    const movies = await getTopRatedMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/now-playing
 * Returns movies currently in theaters
 * Note: Using clean URL (now-playing) instead of TMDB's (now_playing)
 */
router.get('/now-playing', asyncHandler(async (req, res) => {
    const movies = await getNowPlayingMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/trending
 * Returns trending movies this week
 */
router.get('/trending', asyncHandler(async (req, res) => {
    const movies = await getTrendingMovies();
    res.status(200).json(movies);
}));

/**
 * GET /api/movies/genres
 * Returns all available movie genres
 */
router.get('/genres', asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
}));

/**
 * GET /api/movies/search?query=xxx
 * Search for movies by title
 * Query parameter: query (required) - the search term
 */
router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const movies = await searchMovies(query);
    res.status(200).json(movies);
}));

// ============================================
// SINGLE MOVIE ROUTES
// These return data for a specific movie
// ============================================

/**
 * GET /api/movies/:id
 * Returns detailed information about a specific movie
 * URL parameter: id (required) - the TMDB movie ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movie = await getMovie(id);
    res.status(200).json(movie);
}));

/**
 * GET /api/movies/:id/images
 * Returns images (posters, backdrops) for a specific movie
 */
router.get('/:id/images', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const images = await getMovieImages(id);
    res.status(200).json(images);
}));

/**
 * GET /api/movies/:id/reviews
 * Returns user reviews for a specific movie
 */
router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviews = await getMovieReviews(id);
    res.status(200).json(reviews);
}));

/**
 * GET /api/movies/:id/credits
 * Returns cast and crew for a specific movie
 */
router.get('/:id/credits', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const credits = await getMovieCredits(id);
    res.status(200).json(credits);
}));

/**
 * GET /api/movies/:id/recommendations
 * Returns recommended movies based on a specific movie
 */
router.get('/:id/recommendations', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recommendations = await getMovieRecommendations(id);
    res.status(200).json(recommendations);
}));

/**
 * GET /api/movies/:id/similar
 * Returns movies similar to a specific movie
 */
router.get('/:id/similar', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const similar = await getMovieSimilar(id);
    res.status(200).json(similar);
}));

export default router;
