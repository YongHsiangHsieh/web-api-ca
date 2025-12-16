/**
 * Application Route Constants and Helpers
 *
 * This module provides centralized route definitions and helper functions for the entire
 * application. I use this single source of truth to avoid magic strings scattered throughout
 * the codebase and to make routing refactors safe and straightforward.
 *
 * Key Design Decisions:
 *
 * 1. Centralized Route Definitions
 *    - I define all application routes in one place (ROUTES object)
 *    - This prevents typos and inconsistencies across the codebase
 *    - When routes need to change, I only update them here
 *    - Makes the routing structure clear and easy to understand
 *
 * 2. Nested Route Organization
 *    - I organize routes by feature area (MOVIES, REVIEWS, ACTORS, SEARCH)
 *    - This mirrors the app's domain structure and makes navigation intuitive
 *    - Easier to find related routes and understand the app's pages
 *
 * 3. Route Types
 *    - Static routes (HOME, MY_LIST): Fixed paths with no parameters
 *    - Dynamic routes (DETAILS, VIEW): Paths with :id parameter placeholders
 *    - Query-based routes (SEARCH): Paths with query string parameters
 *
 * 4. Helper Functions
 *    - I provide builder functions for dynamic routes (getMovieRoute, getReviewRoute, etc.)
 *    - These functions replace :id placeholders with actual IDs
 *    - Makes it impossible to accidentally create malformed URLs
 *    - Encodes parameters safely (e.g., encodeURIComponent for search queries)
 *
 * 5. Why Helper Functions Matter
 *    - Without helpers: navigate(`/movies/${id}`) scattered everywhere
 *    - With helpers: navigate(getMovieRoute(id)) - more semantic and DRY
 *    - If route structure changes, I only update the helper function
 *    - Reduces the surface area for bugs and makes refactoring safe
 *
 * Usage Patterns:
 * - Import ROUTES for static routes
 * - Use helper functions for dynamic routes
 * - Never hardcode route paths in components
 *
 * @module constants/routes
 * @example
 * // In navigation components
 * import { ROUTES } from './constants/routes';
 * navigate(ROUTES.HOME);
 *
 * @example
 * // For dynamic routes
 * import { getMovieRoute } from './constants/routes';
 * navigate(getMovieRoute(movieId));
 *
 * @example
 * // With React Router
 * import { ROUTES, getMovieRoute } from './constants/routes';
 * <Link to={getMovieRoute(id)}>{movie.title}</Link>
 */

/**
 * All application routes organized by feature.
 *
 * I structure this with nested objects to organize routes logically. Each section
 * represents a major feature area of the application. Static routes are defined
 * directly, while dynamic routes use :id placeholders to be filled by helper functions.
 *
 * Route structure:
 * - HOME: Landing/home page
 * - MOVIES: All movie-related pages (lists, details)
 * - REVIEWS: User reviews and review details
 * - ACTORS: Actor/person detail pages
 * - SEARCH: Search results page
 *
 * @constant
 * @type {Object}
 * @property {string} HOME - Home page route
 * @property {Object} MOVIES - Movie-related routes
 * @property {string} MOVIES.MY_LIST - User's favorite/saved movies
 * @property {string} MOVIES.UPCOMING - Upcoming movies page
 * @property {string} MOVIES.POPULAR - Popular movies page
 * @property {string} MOVIES.TOP_RATED - Top rated movies page
 * @property {string} MOVIES.NOW_PLAYING - Currently playing movies page
 * @property {string} MOVIES.DETAILS - Individual movie detail page (use getMovieRoute helper)
 * @property {Object} REVIEWS - Review-related routes
 * @property {string} REVIEWS.VIEW - Individual review view page (use getReviewRoute helper)
 * @property {string} REVIEWS.FORM - Review submission form page
 * @property {Object} ACTORS - Actor-related routes
 * @property {string} ACTORS.DETAILS - Individual actor/person detail page (use getActorRoute helper)
 * @property {Object} SEARCH - Search-related routes
 * @property {string} SEARCH.RESULTS - Search results page (use getSearchRoute helper)
 */
export const ROUTES = {
  // Home page
  HOME: "/",

  // Movie-related pages
  MOVIES: {
    MY_LIST: "/movies/my-list", // User's favorites/saved movies
    UPCOMING: "/movies/upcoming", // Movies coming soon
    POPULAR: "/movies/popular", // Popular movies
    TOP_RATED: "/movies/top_rated", // Top rated movies
    NOW_PLAYING: "/movies/now_playing", // Movies in theaters
    DETAILS: "/movies/:id", // Individual movie (use getMovieRoute helper)
  },

  // Review-related pages
  REVIEWS: {
    VIEW: "/reviews/:id", // Individual review (use getReviewRoute helper)
    FORM: "/reviews/form", // Write a new review
  },

  // Actor-related pages
  ACTORS: {
    DETAILS: "/actors/:id", // Individual actor/person (use getActorRoute helper)
  },

  // Search page
  SEARCH: {
    RESULTS: "/search", // Search results (use getSearchRoute helper)
  },
};

/**
 * Builds the movie detail route for a specific movie.
 *
 * I use this helper to generate the correct URL for a movie detail page.
 * This replaces the :id placeholder in the MOVIES.DETAILS route template
 * with the actual movie ID.
 *
 * @param {string|number} id - Movie ID from TMDB
 * @returns {string} The complete movie detail route path (e.g., "/movies/550")
 *
 * @example
 * navigate(getMovieRoute(550));  // Navigates to /movies/550
 */
export const getMovieRoute = (id) => `/movies/${id}`;

/**
 * Builds the review detail route for a specific review.
 *
 * I use this helper to generate the correct URL for viewing an individual review.
 * This replaces the :id placeholder in the REVIEWS.VIEW route template
 * with the actual review ID.
 *
 * @param {string|number} id - Review ID
 * @returns {string} The complete review detail route path (e.g., "/reviews/123abc")
 *
 * @example
 * navigate(getReviewRoute("123abc"));  // Navigates to /reviews/123abc
 */
export const getReviewRoute = (id) => `/reviews/${id}`;

/**
 * Builds the actor/person detail route for a specific actor.
 *
 * I use this helper to generate the correct URL for an actor/person detail page.
 * This replaces the :id placeholder in the ACTORS.DETAILS route template
 * with the actual actor/person ID from TMDB.
 *
 * @param {string|number} id - Actor/Person ID from TMDB
 * @returns {string} The complete actor detail route path (e.g., "/actors/1")
 *
 * @example
 * navigate(getActorRoute(1));  // Navigates to /actors/1
 */
export const getActorRoute = (id) => `/actors/${id}`;

/**
 * Builds the search results route with a query string.
 *
 * I use this helper to safely build search URLs with query parameters.
 * Importantly, I use encodeURIComponent to properly encode the search query,
 * which handles special characters, spaces, and other unsafe URL characters.
 * This ensures the search query is transmitted safely through the URL.
 *
 * @param {string} query - The search query string
 * @returns {string} The complete search results route with encoded query (e.g., "/search?q=Inception")
 *
 * @example
 * navigate(getSearchRoute("Inception"));  // Navigates to /search?q=Inception
 *
 * @example
 * // With special characters
 * navigate(getSearchRoute("Lord of the Rings"));  // Properly encodes spaces
 */
export const getSearchRoute = (query) =>
  `/search?q=${encodeURIComponent(query)}`;
