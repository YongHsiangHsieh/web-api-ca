import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import authenticate from '../../authenticate';

const router = express.Router(); // eslint-disable-line

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}));

async function registerUser(req, res) {
    // Username validation regex: 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.' 
        });
    }

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character (@$!%*#?&).' 
        });
    }
    
    await User.create(req.body);
    res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, token: token });
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}

// ============================================
// FAVORITES ENDPOINTS
// All endpoints require authentication
// ============================================

/**
 * GET /api/users/favorites
 * 
 * Returns the authenticated user's list of favorite movie IDs.
 * Requires valid JWT token in Authorization header.
 * 
 * @returns {Object} { success: true, favorites: [movieId1, movieId2, ...] }
 */
router.get('/favorites', authenticate, asyncHandler(async (req, res) => {
    // req.user is set by authenticate middleware
    // It contains the full user document from MongoDB
    const user = req.user;
    
    res.status(200).json({
        success: true,
        favorites: user.favorites || []
    });
}));

/**
 * POST /api/users/favorites/:movieId
 * 
 * Adds a movie to the authenticated user's favorites list.
 * If the movie is already in favorites, returns success without duplicating.
 * 
 * @param {number} movieId - TMDB movie ID (from URL parameter)
 * @returns {Object} { success: true, msg: string, favorites: [...] }
 */
router.post('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    // Validate that movieId is a valid number
    if (isNaN(movieId)) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid movie ID. Must be a number.'
        });
    }
    
    const user = req.user;
    
    // Check if movie is already in favorites (prevent duplicates)
    if (user.favorites.includes(movieId)) {
        return res.status(200).json({
            success: true,
            msg: 'Movie is already in favorites.',
            favorites: user.favorites
        });
    }
    
    // Add movie to favorites and save
    user.favorites.push(movieId);
    await user.save();
    
    res.status(201).json({
        success: true,
        msg: 'Movie added to favorites.',
        favorites: user.favorites
    });
}));

/**
 * DELETE /api/users/favorites/:movieId
 * 
 * Removes a movie from the authenticated user's favorites list.
 * If the movie is not in favorites, returns success (idempotent).
 * 
 * @param {number} movieId - TMDB movie ID (from URL parameter)
 * @returns {Object} { success: true, msg: string, favorites: [...] }
 */
router.delete('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    // Validate that movieId is a valid number
    if (isNaN(movieId)) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid movie ID. Must be a number.'
        });
    }
    
    const user = req.user;
    
    // Find and remove the movie from favorites
    const index = user.favorites.indexOf(movieId);
    
    if (index === -1) {
        // Movie not in favorites - return success anyway (idempotent)
        return res.status(200).json({
            success: true,
            msg: 'Movie was not in favorites.',
            favorites: user.favorites
        });
    }
    
    // Remove movie from favorites and save
    user.favorites.splice(index, 1);
    await user.save();
    
    res.status(200).json({
        success: true,
        msg: 'Movie removed from favorites.',
        favorites: user.favorites
    });
}));

// ============================================
// MUST-WATCH ENDPOINTS
// All endpoints require authentication
// ============================================

/**
 * GET /api/users/mustwatch
 * 
 * Returns the authenticated user's list of must-watch movie IDs.
 * Requires valid JWT token in Authorization header.
 * 
 * @returns {Object} { success: true, mustWatch: [movieId1, movieId2, ...] }
 */
router.get('/mustwatch', authenticate, asyncHandler(async (req, res) => {
    const user = req.user;
    
    res.status(200).json({
        success: true,
        mustWatch: user.mustWatch || []
    });
}));

/**
 * POST /api/users/mustwatch/:movieId
 * 
 * Adds a movie to the authenticated user's must-watch list.
 * If the movie is already in must-watch, returns success without duplicating.
 * 
 * @param {number} movieId - TMDB movie ID (from URL parameter)
 * @returns {Object} { success: true, msg: string, mustWatch: [...] }
 */
router.post('/mustwatch/:movieId', authenticate, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    // Validate that movieId is a valid number
    if (isNaN(movieId)) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid movie ID. Must be a number.'
        });
    }
    
    const user = req.user;
    
    // Check if movie is already in must-watch (prevent duplicates)
    if (user.mustWatch.includes(movieId)) {
        return res.status(200).json({
            success: true,
            msg: 'Movie is already in must-watch list.',
            mustWatch: user.mustWatch
        });
    }
    
    // Add movie to must-watch and save
    user.mustWatch.push(movieId);
    await user.save();
    
    res.status(201).json({
        success: true,
        msg: 'Movie added to must-watch list.',
        mustWatch: user.mustWatch
    });
}));

/**
 * DELETE /api/users/mustwatch/:movieId
 * 
 * Removes a movie from the authenticated user's must-watch list.
 * If the movie is not in must-watch, returns success (idempotent).
 * 
 * @param {number} movieId - TMDB movie ID (from URL parameter)
 * @returns {Object} { success: true, msg: string, mustWatch: [...] }
 */
router.delete('/mustwatch/:movieId', authenticate, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    // Validate that movieId is a valid number
    if (isNaN(movieId)) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid movie ID. Must be a number.'
        });
    }
    
    const user = req.user;
    
    // Find and remove the movie from must-watch
    const index = user.mustWatch.indexOf(movieId);
    
    if (index === -1) {
        // Movie not in must-watch - return success anyway (idempotent)
        return res.status(200).json({
            success: true,
            msg: 'Movie was not in must-watch list.',
            mustWatch: user.mustWatch
        });
    }
    
    // Remove movie from must-watch and save
    user.mustWatch.splice(index, 1);
    await user.save();
    
    res.status(200).json({
        success: true,
        msg: 'Movie removed from must-watch list.',
        mustWatch: user.mustWatch
    });
}));

export default router;