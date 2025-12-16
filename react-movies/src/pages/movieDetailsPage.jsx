import React from "react";
import { useParams } from "react-router";
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { getMovie } from "../api/tmdb-api";
import { useMovieById } from "../hooks/useMovieById.jsx";

/**
 * Page component that displays comprehensive details about a single movie.
 *
 * I extract the movie ID from the URL parameters and use the useMovieById hook to fetch
 * the movie data from the TMDB API. I handle loading and error states automatically through
 * the MovieState component, which displays skeleton loaders or error messages as needed.
 *
 * Once the movie data is loaded, I render the movie information within the PageTemplate,
 * which provides a consistent header with movie poster and title. The MovieDetails component
 * then displays comprehensive information like synopsis, cast, recommendations, and reviews.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying detailed information about the movie,
 *                               including synopsis, cast, recommendations, and user reviews
 *
 * @example
 * // Used in routing configuration at path: /movie/:id
 * import MoviePage from './pages/movieDetailsPage';
 * // Then add to your router configuration
 */
const MoviePage = () => {
  // I extract the movie ID from the URL route parameters. This ID is used to fetch
  // the specific movie data from the TMDB API.
  const { id } = useParams();

  // I fetch the movie data using the useMovieById hook, which handles caching and
  // state management through React Query. This hook also provides a MovieState component
  // for rendering loading and error states.
  const { movie, MovieState } = useMovieById(id, getMovie);

  // I check if there's a loading or error state to display. The MovieState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieState();
  if (stateComponent) return stateComponent;

  // I render the movie details within the PageTemplate component, which provides
  // the movie header with poster and title. The MovieDetails component then displays
  // comprehensive information like synopsis, ratings, cast, recommendations, and reviews.
  return (
    <PageTemplate movie={movie}>
      <MovieDetails movie={movie} />
    </PageTemplate>
  );
};

export default MoviePage;
