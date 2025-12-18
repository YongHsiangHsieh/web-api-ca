import React from "react";
import { getUpcomingMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useMovieList } from "../hooks/useMovieList";
import AddToMustWatchIcon from "../components/cardIcons/addToMustWatch";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Page component that displays a list of upcoming movies.
 *
 * I fetch upcoming movies from the TMDB API and render them in a grid layout. I use the
 * useMovieList hook to handle data fetching, caching, and managing loading/error states.
 * Each movie card includes an "Add to Must Watch" button, allowing users to save movies
 * they're interested in watching.
 *
 * The page automatically displays loading skeletons while data is being fetched, and shows
 * error messages if the fetch fails. Once data loads successfully, the movies are displayed
 * in the PageTemplate component.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying upcoming movies with the ability
 *                               to add them to the user's must-watch list
 *
 * @example
 * // Used in routing configuration
 * import UpcomingMoviesPage from './pages/upcomingMoviesPage';
 */
const UpcomingMoviesPage = () => {
  // I fetch the list of upcoming movies using the useMovieList hook, which handles
  // caching and state management through React Query
  const { movies, MovieListState } = useMovieList(
    QUERY_KEYS.UPCOMING,
    getUpcomingMovies
  );

  // I check if there's a loading or error state to display. The MovieListState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieListState();
  if (stateComponent) return stateComponent;

  // I render the movies in the PageTemplate component, which provides a consistent layout
  // with a title, sorting options, and a grid of movie cards. Each movie card includes an
  // "Add to Must Watch" button via the action prop, enabling users to save movies to their list.
  return (
    <PageTemplate
      title="Upcoming Movies"
      movies={movies}
      action={(movie) => <AddToMustWatchIcon movie={movie} />}
    />
  );
};

export default UpcomingMoviesPage;
