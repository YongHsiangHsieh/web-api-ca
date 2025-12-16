import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { QUERY_KEYS } from "../constants/queryKeys";
import HorizontalScrollContainer from "../components/horizontalScrollContainer";

/**
 * Custom hook for fetching and managing movie credits (cast and crew).
 *
 * I use React Query to fetch credits data from an external API and manage its state,
 * while providing pre-built UI components to display loading skeletons and error messages.
 * I extract the cast and crew arrays from the API response and provide sensible defaults
 * (empty arrays) if the data hasn't loaded yet.
 *
 * @param {string|number} movieId - The unique identifier for the movie whose credits should be fetched
 * @param {Function} queryFn - A callback function that performs the API call to fetch movie credits.
 *                             It receives the `movieId` parameter and should return an object
 *                             with `cast` and `crew` properties.
 *
 * @returns {Object} An object containing:
 *   - {Array} cast - Array of cast members for the movie (empty array if still loading)
 *   - {Array} crew - Array of crew members for the movie (empty array if still loading)
 *   - {boolean} isLoading - True while the credits data is being fetched
 *   - {Error|null} error - Error object if the fetch failed, or null if successful
 *   - {React.Component} MovieCreditsState - A pre-built UI component that displays loading skeletons
 *                                            or error messages based on the query state
 *
 * @example
 * // Basic usage in a component
 * const { cast, crew, isLoading, error, MovieCreditsState } = useMovieCredits(
 *   movieId,
 *   () => fetchCreditsFromAPI(movieId)
 * );
 *
 * if (error) {
 *   return <MovieCreditsState />;
 * }
 *
 * return (
 *   <>
 *     <MovieCreditsState />
 *     {cast.map((actor) => <ActorCard key={actor.id} actor={actor} />)}
 *   </>
 * );
 */
export const useMovieCredits = (movieId, queryFn) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.MOVIE_CREDITS(movieId),
    queryFn: queryFn,
  });

  /**
   * Internal React component that renders the current state of the movie credits query.
   *
   * I handle two different states:
   * 1. Loading state - displays a horizontal scroll container with 5 skeleton loaders that mimic
   *    the appearance of cast member cards (circular profile image, name, and role)
   * 2. Error state - displays a subtle error message indicating that cast information could not be loaded
   * 3. Success state - returns null, allowing the calling component to render the actual credits data
   *
   * The skeleton loaders are displayed in a horizontally scrollable container to match the UI pattern
   * used when displaying the actual cast members.
   *
   * @returns {React.ReactElement|null} A Material-UI component containing either skeleton loaders,
   *                                     an error message, or null if the data loaded successfully
   */
  const MovieCreditsState = () => {
    if (isPending) {
      return (
        <HorizontalScrollContainer sx={{ mb: 3 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ minWidth: 120, flexShrink: 0 }}>
              <Skeleton variant="circular" width={120} height={120} />
              <Skeleton variant="text" width="100%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))}
        </HorizontalScrollContainer>
      );
    }

    if (isError) {
      return (
        <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Could not load cast information
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return {
    cast: data?.cast || [],
    crew: data?.crew || [],
    isLoading: isPending,
    error: isError ? error : null,
    MovieCreditsState,
  };
};
