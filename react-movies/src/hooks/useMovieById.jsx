import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Custom hook for fetching and managing a single movie by its ID.
 *
 * I use React Query to handle the fetching logic with built-in caching, and I provide
 * a reusable MovieState component to display loading and error states. This keeps the
 * movie data fetching logic separate from the UI components that display it.
 *
 * @param {string|number} id - The unique identifier for the movie to fetch
 * @param {Function} queryFn - A callback function that performs the actual API call
 *                             to fetch the movie data. It receives the `id` parameter.
 *
 * @returns {Object} An object containing:
 *   - {Object|undefined} movie - The fetched movie data, or undefined if still loading
 *   - {boolean} isLoading - True while the movie data is being fetched
 *   - {Error|null} error - Error object if the fetch failed, or null if successful
 *   - {React.Component} MovieState - A pre-built UI component that renders the appropriate
 *                                     loading skeleton or error message based on the query state
 *
 * @example
 * // Basic usage in a component
 * const { movie, isLoading, error, MovieState } = useMovieById(
 *   movieId,
 *   () => fetchMovieFromAPI(movieId)
 * );
 *
 * if (isLoading || error) {
 *   return <MovieState />;
 * }
 *
 * return <div>{movie.title}</div>;
 */
export const useMovieById = (id, queryFn) => {
  const {
    data: movie,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.MOVIE(id),
    queryFn: queryFn,
  });

  /**
   * Internal React component that renders the current state of the movie query.
   *
   * I handle three different states:
   * 1. Loading state - displays skeleton loaders to show where content will appear
   * 2. Error state - displays an error message to the user if the fetch failed
   * 3. Success state - returns null, allowing the calling component to render the actual movie data
   *
   * This component encapsulates all the UI logic for handling loading and error states,
   * making it easy to reuse across different parts of the app without duplicating this code.
   *
   * @returns {React.ReactElement|null} A Material-UI Box containing either skeleton loaders,
   *                                     an error message, or null if the data loaded successfully
   */
  const MovieState = () => {
    if (isPending) {
      return (
        <Box sx={{ p: 3 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="100%" height={40} />
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="90%" height={40} />
          </Paper>
        </Box>
      );
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
    movie,
    isLoading: isPending,
    error: isError ? error : null,
    MovieState,
  };
};
