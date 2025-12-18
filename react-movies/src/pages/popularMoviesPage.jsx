import React from "react";
import { getPopularMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useMovieList } from "../hooks/useMovieList";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Page component that displays a list of currently popular movies.
 *
 * I fetch the most popular movies from the TMDB API and render them in a grid layout. I use the
 * useMovieList hook to handle data fetching, caching, and managing loading/error states.
 * Each movie card includes an "Add to Favorites" button, allowing users to save popular movies
 * they're interested in watching to their personal collection.
 *
 * The page automatically displays loading skeletons while data is being fetched, and shows
 * error messages if the fetch fails. Once data loads successfully, the movies are displayed
 * in the PageTemplate component with sorting and filtering capabilities.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying popular movies with the ability
 *                               to add them to the user's favorites list
 *
 * @example
 * // Used in routing configuration
 * import PopularMoviesPage from './pages/popularMoviesPage';
 */
const PopularMoviesPage = () => {
  // I fetch the list of popular movies using the useMovieList hook, which handles
  // caching and state management through React Query
  const { movies, MovieListState } = useMovieList(
    QUERY_KEYS.POPULAR,
    getPopularMovies
  );

  // I check if there's a loading or error state to display. The MovieListState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieListState();
  if (stateComponent) return stateComponent;

  // I render the movies in the PageTemplate component, which provides a consistent layout
  // with a title, sorting options, and a grid of movie cards. Each movie card includes an
  // "Add to Favorites" button via the action prop, enabling users to save their favorite
  // movies to their collection.
  return (
    <PageTemplate
      title="Popular Movies"
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    />
  );
};

export default PopularMoviesPage;
