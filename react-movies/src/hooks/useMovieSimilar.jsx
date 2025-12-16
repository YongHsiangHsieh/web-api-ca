/**
 * Movie Similar Hook Module
 *
 * This hook fetches movies similar to a given movie from the TMDB API.
 * It handles loading and error states, and provides a component for rendering
 * these states in a horizontal scrollable format.
 *
 * Key Design Decisions:
 *
 * 1. Reusable Query Function
 *    - I accept queryFn as a parameter instead of hardcoding the API call
 *    - This allows different components to use different query functions
 *    - Makes the hook flexible for different data sources or variations
 *    - Enables testing with mock functions
 *
 * 2. Movie ID as Cache Key
 *    - I use QUERY_KEYS.SIMILAR(movieId) for unique caching per movie
 *    - Different movies have separate caches for their similar results
 *    - Switching between movies reuses cached similar lists if available
 *    - Improves performance when revisiting movies
 *
 * 3. Horizontal Scrollable Layout
 *    - I render similar movies in a horizontal scroll container
 *    - More efficient use of vertical space on detail pages
 *    - Users can browse similar movies without endless scrolling
 *    - Carousel-like experience for discovering related content
 *
 * 4. Loading Skeleton Generation
 *    - I generate 5 skeleton cards during loading
 *    - Skeleton cards have minWidth: 200px to match real card layout
 *    - flexShrink: 0 prevents cards from shrinking in scroll container
 *    - Gives users a preview of the content structure
 *
 * 5. Graceful Error Handling
 *    - I show a subtle message if similar movies fail to load
 *    - Uses secondary text color to avoid alarming the user
 *    - Doesn't crash the page - just hides that section
 *    - Similar to filmography error handling pattern
 *
 * 6. Results Array Access
 *    - I access data.results to get the movies array
 *    - This matches the TMDB API response structure for similar movies
 *    - Default to empty array if undefined
 *
 * 7. State Encapsulation
 *    - I provide SimilarMoviesState component for rendering UI states
 *    - Keeps loading/error UI logic separate from data logic
 *    - Components can render the state component or just the data
 *
 * 8. Reusable Pattern
 *    - This hook follows the same pattern as useMovieRecommendations
 *    - Consistent interface across related movie discovery hooks
 *    - Familiar API for developers using multiple discovery hooks
 *
 * Data Flow:
 * 1. Receive movieId and queryFn
 * 2. Execute React Query with movie-specific cache key
 * 3. Return movies array, loading state, error state
 * 4. Provide SimilarMoviesState component for conditional rendering
 *
 * @module hooks/useMovieSimilar
 * @example
 * // In a movie detail page
 * const { movies, isLoading, error, SimilarMoviesState } = useMovieSimilar(
 *   movieId,
 *   getSimilarMovies
 * );
 *
 * return (
 *   <Box>
 *     <SimilarMoviesState />
 *     {!isLoading && movies.length > 0 && (
 *       <HorizontalScrollContainer>
 *         {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
 *       </HorizontalScrollContainer>
 *     )}
 *   </Box>
 * );
 */

import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { QUERY_KEYS } from "../constants/queryKeys";
import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";
import HorizontalScrollContainer from "../components/horizontalScrollContainer";

/**
 * Custom hook for fetching movies similar to a given movie.
 *
 * I built this hook to simplify fetching and displaying similar movies on detail pages.
 * It manages loading and error states, and provides a component for rendering these states
 * in a horizontal scrollable format suitable for discovering related content.
 *
 * The hook accepts a query function, making it flexible for different data sources
 * or query variations. It caches results per movie ID, so switching between movies
 * will reuse previously fetched similar movies if available.
 *
 * @param {string|number} movieId - The TMDB movie ID to find similar movies for
 * @param {Function} queryFn - The API query function that fetches similar movies
 *                             This function is called with the movie ID as parameter
 * @returns {Object} Similar movies data and state object
 * @returns {Array<Object>} return.movies - Array of similar movie objects
 * @returns {boolean} return.isLoading - True while similar movies are being fetched
 * @returns {Error|null} return.error - Error object if fetch fails, null otherwise
 * @returns {React.Component} return.SimilarMoviesState - Component for rendering loading/error UI
 *
 * @example
 * // Basic usage in a movie detail page
 * const { movies, isLoading, SimilarMoviesState } = useMovieSimilar(
 *   550,  // Movie ID for Fight Club
 *   getSimilarMovies
 * );
 *
 * return (
 *   <>
 *     <Typography variant="h6">Similar Movies</Typography>
 *     <SimilarMoviesState />
 *     {!isLoading && movies.length > 0 && (
 *       <HorizontalScrollContainer>
 *         {movies.map(m => <MovieCard key={m.id} movie={m} />)}
 *       </HorizontalScrollContainer>
 *     )}
 *   </>
 * );
 */
export const useMovieSimilar = (movieId, queryFn) => {
  // I fetch similar movies using React Query
  // The query key is movie-specific so similar lists for different movies are cached separately
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.SIMILAR(movieId),
    queryFn: queryFn,
  });

  /**
   * Component for rendering similar movies loading and error states.
   *
   * I encapsulate the UI logic for loading skeletons and error messages
   * in a component. This keeps display logic separate from data fetching.
   * Parent components render this component conditionally.
   */
  const SimilarMoviesState = () => {
    // While loading, I show skeleton cards in a horizontal scroll
    if (isPending) {
      return (
        <HorizontalScrollContainer>
          {/* I generate 5 skeleton cards to preview the layout */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ minWidth: 200, flexShrink: 0 }}>
              {/* minWidth: 200 matches real card width */}
              {/* flexShrink: 0 prevents cards from shrinking in flex container */}
              <MovieCardSkeleton />
            </Box>
          ))}
        </HorizontalScrollContainer>
      );
    }

    // If the query fails, I show a subtle error message
    if (isError) {
      return (
        <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
          {/* I use secondary text color to avoid alarming the user */}
          <Typography variant="body2" color="text.secondary">
            Could not load similar movies
          </Typography>
        </Box>
      );
    }

    // If neither loading nor error, return null (no state to display)
    return null;
  };

  return {
    // I access data.results to get the movies array
    // This matches the TMDB API response structure for similar movies
    // Default to empty array so components never need to null-check
    movies: data?.results || [],

    // I return the pending state directly as isLoading
    isLoading: isPending,

    // I return error only if isError is true, otherwise null
    error: isError ? error : null,

    // I provide the SimilarMoviesState component for rendering loading/error UI
    SimilarMoviesState,
  };
};
