import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    getPersonDetails,
    getPersonMovieCredits,
    searchPeople
} from '../tmdb-api';

const router = express.Router();

/**
 * People Router
 * 
 * This router handles all people-related API endpoints (actors, directors, etc.)
 * Each route calls the corresponding function from tmdb-api.js
 */

// ============================================
// SEARCH ROUTE
// ============================================

/**
 * GET /api/people/search?query=xxx
 * Search for people (actors, directors) by name
 * Query parameter: query (required) - the search term
 */
router.get('/search', asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const people = await searchPeople(query);
    res.status(200).json(people);
}));

// ============================================
// SINGLE PERSON ROUTES
// ============================================

/**
 * GET /api/people/:id
 * Returns detailed information about a specific person
 * URL parameter: id (required) - the TMDB person ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const person = await getPersonDetails(id);
    res.status(200).json(person);
}));

/**
 * GET /api/people/:id/movie-credits
 * Returns a person's filmography (movies they've appeared in)
 * Note: Using clean URL (movie-credits) instead of TMDB's (movie_credits)
 */
router.get('/:id/movie-credits', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const credits = await getPersonMovieCredits(id);
    res.status(200).json(credits);
}));

export default router;

