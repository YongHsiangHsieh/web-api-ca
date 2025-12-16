import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { QUERY_KEYS } from "../constants/queryKeys";
import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";
import HorizontalScrollContainer from "../components/horizontalScrollContainer";

/**
 * Custom hook for fetching and managing movie recommendations based on a specific movie.
 *
 * I use React Query to fetch recommendations from an external API and manage the query state.
 * I extract the recommended movies array from the API response (which comes in a `results` property)
 * and provide an empty array as a default when the data hasn't loaded yet. I also supply a
 * pre-built RecommendationsState component that displays skeleton loaders while loading or an
 * error message if the fetch fails.
 *
 * @param {string|number} movieId - The unique identifier for the movie to fetch recommendations for
 * @param {Function} queryFn - A callback function that performs the API call to fetch movie recommendations.
 *                             It receives the `movieId` parameter and should return an object
 *                             with a `results` property containing the array of recommended movies.
 *
 * @returns {Object} An object containing:
 *   - {Array} movies - Array of recommended movie objects (empty array if still loading or no recommendations available)
 *   - {boolean} isLoading - True while the recommendations data is being fetched
 *   - {Error|null} error - Error object if the fetch failed, or null if successful
 *   - {React.Component} RecommendationsState - A pre-built UI component that displays a horizontal scroll
 *                                               container with skeleton loaders while loading, or an error
 *                                               message if the fetch fails
 *
 * @example
 * // Basic usage in a movie details page
 * const { movies, isLoading, error, RecommendationsState } = useMovieRecommendations(
 *   movieId,
 *   () => fetchRecommendationsFromAPI(movieId)
 * );
 *
 * if (error) {
 *   return <RecommendationsState />;
 * }
 *
 * return (
 *   <>
 *     {isLoading && <RecommendationsState />}
 *     <HorizontalScrollContainer>
 *       {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
 *     </HorizontalScrollContainer>
 *   </>
 * );
 */
export const useMovieRecommendations = (movieId, queryFn) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATIONS(movieId),
    queryFn: queryFn,
  });

  /**
   * Internal React component that renders the current state of the movie recommendations query.
   *
   * I handle three different states:
   * 1. Loading state - displays a horizontal scroll container with 5 MovieCardSkeleton components
   *    that mimic the appearance of movie recommendation cards while the data is being fetched
   * 2. Error state - displays a subtle error message in a styled box indicating that recommendations
   *    could not be loaded
   * 3. Success state - returns null, allowing the calling component to render the actual recommended movies
   *
   * The skeleton loaders and horizontal scroll container match the exact layout used for displaying
   * the actual recommendation cards, providing a seamless visual transition when data loads.
   *
   * @returns {React.ReactElement|null} A Material-UI component containing either skeleton loaders
   *                                     in a horizontal scroll container, an error message, or null
   *                                     if the data loaded successfully
   */
  const RecommendationsState = () => {
    if (isPending) {
      return (
        <HorizontalScrollContainer>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ minWidth: 200, flexShrink: 0 }}>
              <MovieCardSkeleton />
            </Box>
          ))}
        </HorizontalScrollContainer>
      );
    }

    if (isError) {
      return (
        <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Could not load recommendations
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
    RecommendationsState,
  };
};
