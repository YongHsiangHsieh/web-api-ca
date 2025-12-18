import React from "react";
import { getMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useMovieList } from "../hooks/useMovieList";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Home page component that displays a curated list of movies for discovery.
 *
 * I fetch a general list of movies from the TMDB API using the discover endpoint,
 * which provides a diverse collection of movies for users to browse. I use the useMovieList
 * hook to handle data fetching, caching, and managing loading/error states.
 *
 * Each movie card includes an "Add to Favorites" button, allowing users to immediately
 * save movies they're interested in to their personal collection. The page automatically
 * displays loading skeletons while data is being fetched, and shows error messages if
 * the fetch fails. Once data loads successfully, the movies are displayed in the PageTemplate
 * component with sorting and filtering capabilities.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying a curated list of movies for discovery,
 *                               with the ability to add them to the user's favorites list
 *
 * @example
 * // Used as the default home page in routing configuration
 * import HomePage from './pages/homePage';
 */
const HomePage = () => {
  // I fetch a general list of movies using the useMovieList hook with the DISCOVER
  // query key, which handles caching and state management through React Query
  const { movies, MovieListState } = useMovieList(
    QUERY_KEYS.DISCOVER,
    getMovies
  );

  // I check if there's a loading or error state to display. The MovieListState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieListState();
  if (stateComponent) return stateComponent;

  // I render the movies in the PageTemplate component, which provides a consistent layout
  // with a "Discover Movies" title, sorting options, and a grid of movie cards. Each movie
  // card includes an "Add to Favorites" button via the action prop, enabling users to save
  // movies they want to remember.
  return (
    <PageTemplate
      title="Discover Movies"
      movies={movies}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    />
  );
};

export default HomePage;
