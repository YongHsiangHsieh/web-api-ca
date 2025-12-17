import React, { useContext } from "react";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import PageHeader from "../components/pageHeader";
import MovieCard from "../components/movieCard";
import MovieListSkeleton from "../components/skeletons/MovieListSkeleton";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import RemoveFromMustWatch from "../components/cardIcons/removeFromMustWatch";
import WriteReview from "../components/cardIcons/writeReview";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { QUERY_KEYS } from "../constants/queryKeys";
import { mapMovieGenres } from "../utils/movie";

/**
 * Page component that displays the user's personal movie lists (favorites and must-watch).
 *
 * I retrieve the user's favorite and must-watch movie IDs from the MoviesContext, then fetch
 * the full movie details for each using React Query's useQueries hook (which allows parallel
 * queries). I handle loading states by displaying skeleton loaders, and I show an empty state
 * message if neither list has any movies.
 *
 * I map genre IDs for each movie to ensure filtering compatibility, then render the movies
 * in two separate sections: "Favorite Movies" with options to remove from favorites or write
 * a review, and "Must Watch" with options to remove from the must-watch list.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying the user's favorite and must-watch
 *                               movie collections with appropriate empty state messaging
 *
 * @example
 * // Used in routing configuration
 * import MyListPage from './pages/myListPage';
 * // Then add to your router configuration
 */
const MyListPage = () => {
  // I retrieve the user's favorite and must-watch movie IDs from the MoviesContext,
  // which stores the user's personal collections
  const { favorites, mustWatch } = useContext(MoviesContext);

  // I fetch the full movie details for each favorite movie ID using parallel queries.
  // React Query caches each movie individually, so if a movie is in both lists,
  // it will still only be fetched once.
  const favoriteMovieQueries = useQueries({
    queries: favorites.map((movieId) => ({
      queryKey: QUERY_KEYS.MOVIE(movieId),
      queryFn: getMovie,
    })),
  });

  // I fetch the full movie details for each must-watch movie ID using parallel queries
  const mustWatchMovieQueries = useQueries({
    queries: mustWatch.map((movieId) => ({
      queryKey: QUERY_KEYS.MOVIE(movieId),
      queryFn: getMovie,
    })),
  });

  // I check if any of the parallel queries is still loading. If so, I display skeleton
  // loaders to provide visual feedback that content is loading
  const isPending =
    favoriteMovieQueries.find((m) => m.isPending === true) ||
    mustWatchMovieQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <MovieListSkeleton />;
  }

  // I map genre IDs to genre objects for each movie to ensure compatibility with
  // filtering and sorting features in the MovieCard component
  const favoriteMovies = favoriteMovieQueries.map((q) =>
    mapMovieGenres(q.data)
  );
  const mustWatchMovies = mustWatchMovieQueries.map((q) =>
    mapMovieGenres(q.data)
  );

  const hasAnyMovies = favoriteMovies.length > 0 || mustWatchMovies.length > 0;

  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader title="My List" />
      </Grid>

      {!hasAnyMovies && (
        <Grid size={12}>
          <Box sx={{ p: 4, textAlign: "center" }}>
            {/* I display an empty state message when the user has no movies in either list,
                encouraging them to start building their collections */}
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Your list is empty
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "rgba(255, 255, 255, 0.5)" }}>
              Start adding movies to your favorites or must-watch list
            </Typography>
          </Box>
        </Grid>
      )}

      {favoriteMovies.length > 0 && (
        <Grid size={12} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ mb: 2, color: "white" }}
          >
            ❤️ Favorite Movies ({favoriteMovies.length})
          </Typography>
          {/* I render favorite movies in a responsive grid with "Remove from Favorites" and
              "Write Review" action buttons to allow users to manage and review their favorites */}
          <Grid container spacing={2}>
            {favoriteMovies.map((movie) => (
              <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MovieCard
                  movie={movie}
                  action={(movie) => (
                    <>
                      <RemoveFromFavorites movie={movie} />
                      <WriteReview movie={movie} />
                    </>
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      {mustWatchMovies.length > 0 && (
        <Grid size={12} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ mb: 2, color: "white" }}
          >
            📺 Must Watch ({mustWatchMovies.length})
          </Typography>
          {/* I render must-watch movies in a responsive grid with a "Remove from Must Watch"
              action button to allow users to manage their watchlist */}
          <Grid container spacing={2}>
            {mustWatchMovies.map((movie) => (
              <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MovieCard
                  movie={movie}
                  action={(movie) => (
                    <>
                      <RemoveFromMustWatch movie={movie} />
                    </>
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default MyListPage;
