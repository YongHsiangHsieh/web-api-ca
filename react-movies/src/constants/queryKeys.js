/**
 * React Query Key Constants and Factory Functions
 *
 * This module provides centralized query key definitions for all API calls in the application.
 * I use this single source of truth to ensure consistent caching behavior across React Query.
 *
 * Key Design Decisions:
 *
 * 1. Query Key Factory Pattern
 *    - I use factory functions instead of hardcoded strings
 *    - This provides type safety and prevents typos in query keys
 *    - Makes it easy to maintain consistent key structure
 *
 * 2. Hierarchical Key Structure
 *    - Query keys are arrays of identifiable elements
 *    - First element is always the resource type (e.g., "movie", "reviews")
 *    - Second element (if needed) is an object with parameters (e.g., { id: 123 })
 *    - This structure makes React Query's caching logic work correctly
 *
 * 3. Parameter Encapsulation in Objects
 *    - I wrap parameters in objects (e.g., { id } not just id)
 *    - This prevents accidental cache collisions
 *    - Makes invalidation queries work predictably
 *    - React Query can match and invalidate related queries efficiently
 *
 * 4. Static vs. Dynamic Keys
 *    - Static keys (DISCOVER, UPCOMING): No parameters, cached globally
 *    - Dynamic keys: Factory functions that create keys with parameters
 *    - Static keys are constants, dynamic keys are callable functions
 *
 * 5. Cache Invalidation Benefits
 *    - Keys are grouped by resource type
 *    - I can invalidate all movie reviews with key ["reviews"]
 *    - I can invalidate one review with key ["reviews", { id: 123 }]
 *    - This gives fine-grained control over cache management
 *
 * 6. Query Key Structure Pattern
 *    - Resource type always comes first
 *    - Parameters wrapped in an object as the second element
 *    - Example: ["reviews", { id: 123 }]
 *    - Makes filtering and invalidation queries logical and consistent
 *
 * Usage Patterns:
 * - Import QUERY_KEYS constant
 * - Use static keys directly: QUERY_KEYS.DISCOVER
 * - Call factory functions with params: QUERY_KEYS.MOVIE(123)
 * - Use with useQuery: { queryKey: QUERY_KEYS.UPCOMING(...) }
 * - Invalidate related queries: queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS(movieId) })
 *
 * React Query Caching Hierarchy:
 * - useQuery with same queryKey will share cache
 * - queryClient.setQueryData uses same key matching
 * - queryClient.invalidateQueries uses key filtering
 *   - Invalidate all movie data: QUERY_KEYS.MOVIE() - matches all MOVIE keys
 *   - Invalidate one movie: QUERY_KEYS.MOVIE(123) - matches only that movie
 *
 * @module constants/queryKeys
 * @example
 * // Using with React Query
 * const { data } = useQuery({
 *   queryKey: QUERY_KEYS.UPCOMING,
 *   queryFn: getUpcomingMovies,
 * });
 *
 * @example
 * // Dynamic query for a specific movie
 * const { data } = useQuery({
 *   queryKey: QUERY_KEYS.MOVIE(movieId),
 *   queryFn: () => getMovie(movieId),
 * });
 *
 * @example
 * // Cache invalidation after adding a review
 * await addReview(movieId, reviewData);
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS(movieId) });
 */

/**
 * All React Query cache keys for the application.
 *
 * I organize these by resource type to make the caching strategy clear.
 * Each entry represents a distinct data fetch that React Query will cache.
 * Static entries are simple cache keys for globally-consistent data.
 * Factory functions generate parameterized keys for entity-specific data.
 *
 * Cache Key Structure:
 * - Static: ["resourceType"]
 * - Dynamic: ["resourceType", { parameters }]
 *
 * This structure allows React Query to:
 * - Cache queries with the same key together
 * - Invalidate related queries by partial matching
 * - Deduplicate identical requests
 * - Manage stale time and refetch behavior
 *
 * @constant
 * @type {Object}
 */
export const QUERY_KEYS = {
  /**
   * Cache key for discover/homepage movies.
   *
   * I use this for the initial set of movies shown on the homepage.
   * This is a static key since all users see the same discover feed.
   *
   * @type {Array<string>}
   */
  DISCOVER: ["discover"],

  /**
   * Cache key for upcoming movies.
   *
   * I use this for movies that will be released in the future.
   * This is a static key since upcoming movies are the same for all users.
   *
   * @type {Array<string>}
   */
  UPCOMING: ["upcoming"],

  /**
   * Cache key for popular movies.
   *
   * I use this for the current popular movies ranking.
   * This is a static key since popularity is global.
   *
   * @type {Array<string>}
   */
  POPULAR: ["popular"],

  /**
   * Cache key for top rated movies.
   *
   * I use this for the highest rated movies of all time.
   * This is a static key since ratings are global.
   *
   * @type {Array<string>}
   */
  TOP_RATED: ["topRated"],

  /**
   * Cache key for now playing movies (in theaters).
   *
   * I use this for movies currently in theaters.
   * This is a static key since theater releases are global.
   *
   * @type {Array<string>}
   */
  NOW_PLAYING: ["nowPlaying"],

  /**
   * Cache key for trending movies.
   *
   * I use this for movies trending this week/day.
   * This is a static key since trending data is global.
   *
   * @type {Array<string>}
   */
  TRENDING: ["trending"],

  /**
   * Cache key factory for a single movie's details.
   *
   * I use a factory function because each movie has a unique ID.
   * I wrap the ID in an object to maintain consistent key structure.
   * React Query will cache each movie separately by ID.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["movie", { id: 123 }]
   * @example
   * // For movie ID 550
   * QUERY_KEYS.MOVIE(550) // Returns ["movie", { id: 550 }]
   */
  MOVIE: (id) => ["movie", { id }],

  /**
   * Cache key for all movie genres.
   *
   * I use this for the list of available genres.
   * This is a static key since genres are constant.
   *
   * @type {Array<string>}
   */
  GENRES: ["genres"],

  /**
   * Cache key factory for a movie's poster and still images.
   *
   * I use a factory function because each movie has different images.
   * I wrap the ID in an object to maintain consistent key structure.
   * This allows caching different image sets for different movies.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["images", { id: 123 }]
   */
  IMAGES: (id) => ["images", { id }],

  /**
   * Cache key factory for a movie's reviews.
   *
   * I use a factory function because each movie has different reviews.
   * I wrap the ID in an object to maintain consistent key structure.
   * This enables invalidating reviews when new ones are added.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["reviews", { id: 123 }]
   */
  REVIEWS: (id) => ["reviews", { id }],

  /**
   * Cache key factory for a movie's credits (cast and crew).
   *
   * I use a factory function because each movie has different cast.
   * I wrap the ID in an object to maintain consistent key structure.
   * This allows caching cast information separately per movie.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["movieCredits", { id: 123 }]
   */
  MOVIE_CREDITS: (id) => ["movieCredits", { id }],

  /**
   * Cache key factory for recommended movies based on a given movie.
   *
   * I use a factory function because recommendations differ per movie.
   * I wrap the ID in an object to maintain consistent key structure.
   * This caches recommendations separately for each movie.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["recommendations", { id: 123 }]
   */
  RECOMMENDATIONS: (id) => ["recommendations", { id }],

  /**
   * Cache key factory for movies similar to a given movie.
   *
   * I use a factory function because similar movies differ per movie.
   * I wrap the ID in an object to maintain consistent key structure.
   * This caches similar movies separately for each movie.
   *
   * @param {string|number} id - Movie ID from TMDB
   * @returns {Array} Query key array: ["similar", { id: 123 }]
   */
  SIMILAR: (id) => ["similar", { id }],

  /**
   * Cache key factory for a person/actor's details.
   *
   * I use a factory function because each person has unique details.
   * I wrap the ID in an object to maintain consistent key structure.
   * This allows caching actor information separately per person.
   *
   * @param {string|number} id - Person ID from TMDB
   * @returns {Array} Query key array: ["person", { id: 1 }]
   */
  PERSON: (id) => ["person", { id }],

  /**
   * Cache key factory for a person's filmography (movie credits).
   *
   * I use a factory function because each person has different filmography.
   * I wrap the ID in an object to maintain consistent key structure.
   * This caches filmography separately for each actor/director.
   *
   * @param {string|number} id - Person ID from TMDB
   * @returns {Array} Query key array: ["personCredits", { id: 1 }]
   */
  PERSON_CREDITS: (id) => ["personCredits", { id }],

  /**
   * Cache key factory for movie search results.
   *
   * I use a factory function because each search query returns different results.
   * I wrap the query in an object to maintain consistent key structure.
   * This keeps search results for different queries cached separately.
   *
   * @param {string} query - Search query string (e.g., "Inception")
   * @returns {Array} Query key array: ["searchMovies", { query: "Inception" }]
   * @example
   * // For search "Inception"
   * QUERY_KEYS.SEARCH_MOVIES("Inception") // Returns ["searchMovies", { query: "Inception" }]
   */
  SEARCH_MOVIES: (query) => ["searchMovies", { query }],

  /**
   * Cache key factory for people/actor search results.
   *
   * I use a factory function because each search query returns different results.
   * I wrap the query in an object to maintain consistent key structure.
   * This keeps search results for different queries cached separately.
   *
   * @param {string} query - Search query string (e.g., "Tom Cruise")
   * @returns {Array} Query key array: ["searchPeople", { query: "Tom Cruise" }]
   */
  SEARCH_PEOPLE: (query) => ["searchPeople", { query }],
};
