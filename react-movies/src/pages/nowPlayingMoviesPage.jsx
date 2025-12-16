import React from "react";
import { getNowPlayingMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useMovieList } from "../hooks/useMovieList";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Page component that displays a list of movies currently playing in theaters.
 *
 * I fetch the list of movies that are currently in cinemas from the TMDB API and render them
 * in a grid layout. I use the useMovieList hook to handle data fetching, caching, and managing
 * loading/error states. Each movie card includes an "Add to Favorites" button, allowing users
 * to save movies they want to see in theaters.
 *
 * The page automatically displays loading skeletons while data is being fetched, and shows
 * error messages if the fetch fails. Once data loads successfully, the movies are displayed
 * in the PageTemplate component with sorting and filtering capabilities.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying now playing movies with the ability
 *                               to add them to the user's favorites list
 *
 * @example
 * // Used in routing configuration
 * import NowPlayingMoviesPage from './pages/nowPlayingMoviesPage';
 * // Then add to your router configuration
 */
const NowPlayingMoviesPage = () => {
  // I fetch the list of now playing movies using the useMovieList hook, which handles
  // caching and state management through React Query
  const { movies, MovieListState } = useMovieList(
    QUERY_KEYS.NOW_PLAYING,
    getNowPlayingMovies
  );

  // I check if there's a loading or error state to display. The MovieListState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieListState();
  if (stateComponent) return stateComponent;

  // I render the movies in the PageTemplate component, which provides a consistent layout
  // with a title, sorting options, and a grid of movie cards. Each movie card includes an
  // "Add to Favorites" button via the action prop, enabling users to save movies they want
  // to watch in theaters.
  return (
    <PageTemplate
      title="Now Playing in Theaters"
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    />
  );
};

export default NowPlayingMoviesPage;
