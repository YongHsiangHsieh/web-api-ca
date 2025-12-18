import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import MovieListSkeleton from "../components/skeletons/MovieListSkeleton";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";
import { QUERY_KEYS } from "../constants/queryKeys";
import { mapMovieGenres } from "../utils/movie";

/**
 * Page component that displays the user's favorite movies.
 *
 * I retrieve the list of favorite movie IDs from the MoviesContext, then fetch the full
 * movie details for each using React Query's useQueries hook for parallel fetching. I handle
 * loading states by displaying skeleton loaders, and I map genre IDs to genre objects for
 * each movie to ensure compatibility with filtering and sorting features.
 *
 * Each favorite movie card includes two action buttons: "Remove from Favorites" to let users
 * manage their collection, and "Write Review" to allow them to add or edit their review.
 * The page automatically sorts and filters the movies using the PageTemplate component's
 * built-in functionality.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying the user's favorite movies with
 *                               options to remove favorites and write reviews
 *
 * @example
 * // Used in routing configuration
 * import FavoriteMoviesPage from './pages/favoriteMoviesPage';
 */
const FavoriteMoviesPage = () => {
  // I retrieve the user's favorite movie IDs from the MoviesContext, which stores
  // the user's personal movie collections
  const { favorites: movieIds } = useContext(MoviesContext);

  // I fetch the full movie details for each favorite movie ID using parallel queries.
  // React Query will cache each movie individually, so if a movie appears in multiple
  // places, it will still only be fetched once.
  const favoriteMovieQueries = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: QUERY_KEYS.MOVIE(movieId),
      queryFn: getMovie,
    })),
  });

  // I check if any of the parallel queries is still loading. If so, I display skeleton
  // loaders to provide visual feedback that content is being fetched.
  const isPending = favoriteMovieQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <MovieListSkeleton />;
  }

  // I map genre IDs to genre objects for each movie to ensure compatibility with
  // filtering and sorting features in the PageTemplate component
  const movies = favoriteMovieQueries.map((q) => mapMovieGenres(q.data));

  // I render the favorite movies in the PageTemplate component with "Remove from Favorites"
  // and "Write Review" action buttons for each movie. The PageTemplate provides sorting
  // and filtering capabilities that work with the genre-mapped data.
  return (
    <PageTemplate
      title="Favorite Movies"
      movies={movies}
      action={(movie) => (
        <>
          <RemoveFromFavorites movie={movie} />
          <WriteReview movie={movie} />
        </>
      )}
    />
  );
};

export default FavoriteMoviesPage;
