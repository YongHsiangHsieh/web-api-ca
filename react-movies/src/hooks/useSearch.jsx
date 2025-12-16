/**
 * Search Hook Module
 *
 * This hook provides a convenient interface for searching both movies and people
 * simultaneously. It manages two parallel API queries and provides unified loading,
 * error, and rendering state management.
 *
 * Key Design Decisions:
 *
 * 1. Parallel Queries
 *    - I execute two separate React Query calls in parallel (movies and people)
 *    - This fetches both results simultaneously instead of sequentially
 *    - Improves perceived performance - results appear together
 *    - Each query is independent and can succeed/fail separately
 *
 * 2. Conditional Query Execution
 *    - I use enabled: !!query to only run queries when a search term exists
 *    - This prevents unnecessary API calls with empty strings
 *    - Queries automatically stop when the query parameter becomes empty
 *    - Reduces API usage and improves performance
 *
 * 3. Unified Interface
 *    - I return both datasets in a single object for convenient access
 *    - This eliminates the need to call two separate hooks
 *    - Components only need to import and use one hook
 *    - Makes search logic cleaner and easier to understand
 *
 * 4. Combined Loading State
 *    - I combine both isLoading states with OR logic
 *    - If either query is loading, isLoading is true
 *    - This ensures the skeleton shows if either result set is pending
 *    - Prevents partial results from appearing mid-load
 *
 * 5. Combined Error State
 *    - I combine both error states with OR logic
 *    - If either query fails, the error object is set
 *    - I use moviesError || peopleError to get whichever error occurred
 *    - Allows showing error messages from either search
 *
 * 6. SearchState Component
 *    - I provide a component for rendering loading/error states
 *    - This encapsulates UI logic in one place
 *    - Components can render SearchState while also rendering results
 *    - Makes conditional rendering cleaner in parent components
 *
 * 7. Safe Data Extraction
 *    - I use optional chaining (?.results) to safely access data
 *    - Default to empty arrays if data is undefined
 *    - This prevents errors when queries haven't completed
 *    - Components never need to null-check before rendering
 *
 * 8. Reusable Query Keys
 *    - I use QUERY_KEYS factory functions for consistent caching
 *    - Makes cache invalidation predictable
 *    - Follows React Query best practices
 *
 * Data Flow:
 * 1. Receive search query string
 * 2. Execute two parallel API queries (movies and people)
 * 3. Return combined results, loading state, and error state
 * 4. Provide SearchState component for conditional rendering
 *
 * @module hooks/useSearch
 * @example
 * // In a search results page
 * const { movies, people, isLoading, error, SearchState } = useSearch(query);
 *
 * return (
 *   <Box>
 *     <SearchState />
 *     <MovieGrid movies={movies} />
 *     <PeopleGrid people={people} />
 *   </Box>
 * );
 */

import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MovieListSkeleton from "../components/skeletons/MovieListSkeleton";
import { QUERY_KEYS } from "../constants/queryKeys";
import { searchMovies, searchPeople } from "../api/tmdb-api";

/**
 * Custom hook for searching movies and people in parallel.
 *
 * I built this hook to simplify search functionality by combining two API queries
 * into a single, easy-to-use interface. It handles loading and error states for
 * both queries and provides a component for rendering these states.
 *
 * The hook executes movie and people searches in parallel, so results come back
 * at roughly the same time. It only runs queries when a non-empty search term
 * is provided, avoiding unnecessary API calls.
 *
 * @param {string} query - The search query string entered by the user
 * @returns {Object} Search results and state object
 * @returns {Array<Object>} return.movies - Array of movie results (empty if no query or loading)
 * @returns {Array<Object>} return.people - Array of people results (empty if no query or loading)
 * @returns {boolean} return.isLoading - True if either query is pending
 * @returns {Error|null} return.error - Error object if either query failed, null otherwise
 * @returns {React.Component} return.SearchState - Component for rendering loading/error UI
 *
 * @example
 * // Basic usage in a search results page
 * const { movies, people, isLoading, SearchState } = useSearch(query);
 *
 * return (
 *   <>
 *     <SearchState />
 *     {!isLoading && movies.length > 0 && <MovieGrid movies={movies} />}
 *     {!isLoading && people.length > 0 && <PeopleGrid people={people} />}
 *   </>
 * );
 */
export const useSearch = (query) => {
  /**
   * Movie search query.
   *
   * I fetch movies matching the search query using React Query.
   * The queryKey includes the query string so different searches have separate caches.
   * The enabled option ensures the API is only called when a non-empty query exists.
   */
  const {
    data: moviesData,
    error: moviesError,
    isPending: isPendingMovies,
    isError: isMoviesError,
  } = useQuery({
    queryKey: QUERY_KEYS.SEARCH_MOVIES(query),
    queryFn: searchMovies,
    // I only enable the query if we have a non-empty search term
    // This prevents unnecessary API calls and network requests
    enabled: !!query,
  });

  /**
   * People search query.
   *
   * I fetch people (actors, directors, etc.) matching the search query.
   * This runs in parallel with the movie search for faster results.
   * Same query conditioning as movies to prevent unnecessary API calls.
   */
  const {
    data: peopleData,
    error: peopleError,
    isPending: isPendingPeople,
    isError: isPeopleError,
  } = useQuery({
    queryKey: QUERY_KEYS.SEARCH_PEOPLE(query),
    queryFn: searchPeople,
    // I only enable the query if we have a non-empty search term
    enabled: !!query,
  });

  /**
   * Component for rendering search loading and error states.
   *
   * I encapsulate the UI logic for loading skeletons and error messages
   * in a component. This keeps the state display logic separated from data logic.
   * Parent components can render this alongside the actual results.
   */
  const SearchState = () => {
    // While either query is loading, I show the skeleton placeholder
    if (isPendingMovies || isPendingPeople) {
      return <MovieListSkeleton />;
    }

    // If either query has an error, I display an error message
    // I use whichever error occurred (prioritizing movies, then people)
    if (isMoviesError || isPeopleError) {
      const errorMessage = moviesError?.message || peopleError?.message;
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            {errorMessage}
          </Typography>
        </Box>
      );
    }

    // If neither loading nor error, return null (no state to display)
    return null;
  };

  return {
    // I extract the results array from the API response
    // Using optional chaining (?.) prevents errors if data is undefined
    // Default to empty arrays so components never need to null-check
    movies: moviesData?.results || [],
    people: peopleData?.results || [],

    // I combine loading states with OR logic
    // If either query is pending, return true so UI shows loading state
    isLoading: isPendingMovies || isPendingPeople,

    // I combine error states with OR logic
    // If neither query has an error, return null
    // Otherwise, return whichever error occurred (prefer movies, then people)
    error: isMoviesError || isPeopleError ? moviesError || peopleError : null,

    // I provide a component for conditional rendering of loading/error states
    // This keeps UI logic clean and separated from data fetching
    SearchState,
  };
};
