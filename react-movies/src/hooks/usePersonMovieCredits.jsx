/**
 * Person Movie Credits Hook Module
 *
 * This hook fetches an actor's or person's movie credits (filmography) from the TMDB API.
 * It handles loading and error states, and provides a component for rendering these states
 * in a horizontal scrollable format.
 *
 * Key Design Decisions:
 *
 * 1. Reusable Query Function
 *    - I accept queryFn as a parameter instead of hardcoding the API call
 *    - This allows different components to use different query functions
 *    - Makes the hook flexible for future API changes or variations
 *    - Enables testing by allowing mock functions to be passed
 *
 * 2. Person ID as Primary Parameter
 *    - The personId is the key identifier for the query
 *    - Used both for the query key and passed to the query function
 *    - Ensures proper caching based on which actor's credits we're fetching
 *
 * 3. Horizontal Scrollable Layout
 *    - I render filmography in a horizontal scroll container
 *    - Movie cards show in a carousel-like display
 *    - More efficient use of vertical space on detail pages
 *    - Users can explore filmography without endless scrolling
 *
 * 4. Loading Skeleton Generation
 *    - I generate 5 skeleton cards during loading
 *    - Skeleton cards have minWidth: 200px to match real card layout
 *    - flexShrink: 0 prevents cards from shrinking in scroll container
 *    - Placeholders give users preview of upcoming content
 *
 * 5. Graceful Error Handling
 *    - I show a subtle message if filmography fails to load
 *    - Uses secondary text color to not alarm the user
 *    - Contained in a box to show it's a distinct section
 *    - Doesn't crash the page - just hides that section
 *
 * 6. Cast Array Access
 *    - I access data.cast to get the movies array
 *    - This matches the TMDB API response structure for person credits
 *    - Different from movie credits which use a different structure
 *    - Default to empty array if undefined
 *
 * 7. State Encapsulation
 *    - I provide FilmographyState component for rendering UI states
 *    - Keeps loading/error UI logic separate from data logic
 *    - Components can render the state component or just the data
 *
 * Data Flow:
 * 1. Receive personId and queryFn
 * 2. Execute React Query with person-specific cache key
 * 3. Return movies array, loading state, error state
 * 4. Provide FilmographyState component for conditional rendering
 *
 * @module hooks/usePersonMovieCredits
 * @example
 * // In an actor detail page
 * const { movies, isLoading, error, FilmographyState } = usePersonMovieCredits(
 *   actorId,
 *   getPersonMovieCredits
 * );
 *
 * return (
 *   <Box>
 *     <FilmographyState />
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
 * Custom hook for fetching an actor's or person's movie credits (filmography).
 *
 * I built this hook to handle fetching and displaying a person's filmography.
 * It manages loading and error states, and provides a component for rendering
 * these states in a horizontal scrollable format suitable for detail pages.
 *
 * The hook accepts a query function, making it flexible for different data sources
 * or query variations. It caches results per person ID, so switching between
 * actors doesn't require re-fetching previously viewed filmographies.
 *
 * @param {string|number} personId - The TMDB person/actor ID to fetch credits for
 * @param {Function} queryFn - The API query function that fetches person movie credits
 *                             This function is called with the person ID as parameter
 * @returns {Object} Filmography data and state object
 * @returns {Array<Object>} return.movies - Array of movie objects from the person's filmography
 * @returns {boolean} return.isLoading - True while credits are being fetched
 * @returns {Error|null} return.error - Error object if fetch fails, null otherwise
 * @returns {React.Component} return.FilmographyState - Component for rendering loading/error UI
 *
 * @example
 * // Basic usage in an actor detail page
 * const { movies, isLoading, FilmographyState } = usePersonMovieCredits(
 *   1,
 *   getPersonMovieCredits
 * );
 *
 * return (
 *   <>
 *     <FilmographyState />
 *     {!isLoading && (
 *       <HorizontalScrollContainer>
 *         {movies.map(m => <MovieCard key={m.id} movie={m} />)}
 *       </HorizontalScrollContainer>
 *     )}
 *   </>
 * );
 */
export const usePersonMovieCredits = (personId, queryFn) => {
  // I fetch person movie credits using React Query
  // The query key is person-specific so credits for different actors are cached separately
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.PERSON_CREDITS(personId),
    queryFn: queryFn,
  });

  /**
   * Component for rendering filmography loading and error states.
   *
   * I encapsulate the UI logic for loading skeletons and error messages
   * in a component. This keeps display logic separate from data fetching.
   * Parent components render this component conditionally.
   */
  const FilmographyState = () => {
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
            Could not load filmography
          </Typography>
        </Box>
      );
    }

    // If neither loading nor error, return null (no state to display)
    return null;
  };

  return {
    // I access data.cast to get the movies array
    // This matches the TMDB API response structure for person credits
    // Default to empty array so components never need to null-check
    movies: data?.cast || [],

    // I return the pending state directly as isLoading
    isLoading: isPending,

    // I return error only if isError is true, otherwise null
    error: isError ? error : null,

    // I provide the FilmographyState component for rendering loading/error UI
    FilmographyState,
  };
};
