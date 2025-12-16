import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MovieListSkeleton from "../components/skeletons/MovieListSkeleton";

/**
 * Custom hook for fetching and managing a list of movies with built-in loading and error handling.
 *
 * I use React Query to handle the fetching logic with its powerful caching and state management.
 * I extract the movies array from the API response (which typically comes in a `results` property),
 * and I provide an empty array as default when the data hasn't loaded yet. I also include a
 * pre-built MovieListState component that handles displaying skeleton loaders during loading
 * and error messages when the fetch fails.
 *
 * @param {Array} queryKey - The query key array for React Query caching. This should be a unique
 *                           identifier for this particular query to enable proper cache management.
 *                           Example: ['movies', 'popular'] or ['movies', 'search', 'query']
 * @param {Function} queryFn - A callback function that performs the API call to fetch the movies.
 *                             It should return an object with a `results` property containing
 *                             the array of movie objects.
 *
 * @returns {Object} An object containing:
 *   - {Array} movies - Array of movie objects fetched from the API (empty array if still loading or if API returns no results)
 *   - {boolean} isLoading - True while the movies data is being fetched
 *   - {Error|null} error - Error object if the fetch failed, or null if successful
 *   - {React.Component} MovieListState - A pre-built UI component that displays either a skeleton
 *                                         loader grid while loading, or an error message if the fetch fails
 *
 * @example
 * // Basic usage in a component
 * const { movies, isLoading, error, MovieListState } = useMovieList(
 *   ['movies', 'popular'],
 *   () => fetchPopularMovies()
 * );
 *
 * if (error) {
 *   return <MovieListState />;
 * }
 *
 * return (
 *   <>
 *     {isLoading && <MovieListState />}
 *     <MovieGrid movies={movies} />
 *   </>
 * );
 */
export const useMovieList = (queryKey, queryFn) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  });

  /**
   * Internal React component that renders the current state of the movie list query.
   *
   * I handle three different states:
   * 1. Loading state - displays a MovieListSkeleton component that shows a grid of placeholder
   *    cards to indicate content is loading
   * 2. Error state - displays a centered error message in a large heading style to inform the user
   *    that the movie list could not be loaded
   * 3. Success state - returns null, allowing the calling component to render the actual movies data
   *
   * This component keeps the state-handling logic in one place, preventing duplicate loading/error
   * UI code across different pages that use this hook.
   *
   * @returns {React.ReactElement|null} A Material-UI Box component containing either skeleton loaders,
   *                                     an error message, or null if the data loaded successfully
   */
  const MovieListState = () => {
    if (isPending) {
      return <MovieListSkeleton />;
    }

    if (isError) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            {error.message}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return {
    movies: data?.results || [],
    isLoading: isPending,
    error: isError ? error : null,
    MovieListState,
  };
};
