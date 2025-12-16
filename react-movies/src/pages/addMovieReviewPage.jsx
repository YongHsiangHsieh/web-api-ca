import React from "react";
import PageTemplate from "../components/templateMoviePage";
import ReviewForm from "../components/reviewForm";
import { useLocation } from "react-router";
import { getMovie } from "../api/tmdb-api";
import { useMovieById } from "../hooks/useMovieById.jsx";

/**
 * Page component for writing or editing a movie review.
 *
 * I retrieve the movie ID from the React Router location state, then fetch the full movie
 * details using the useMovieById hook. I handle loading and error states automatically through
 * the MovieState component, which displays skeleton loaders or error messages as needed.
 *
 * Once the movie data is loaded, I render the ReviewForm component within the PageTemplate,
 * which provides the movie context (poster, title, etc.) as a header. The ReviewForm allows
 * users to write or edit their personal review of the movie.
 *
 * @component
 * @returns {React.ReactElement} A page component for writing or editing a movie review,
 *                               with the movie context displayed in the header
 *
 * @example
 * // Navigation to this page should include state with the movieId
 * import { useNavigate } from 'react-router';
 *
 * const navigate = useNavigate();
 * navigate('/write-review', { state: { movieId: 550 } });
 */
const WriteReviewPage = () => {
  // I retrieve the movie ID from the React Router location state. This ID should have
  // been passed during navigation to this page.
  const location = useLocation();
  const movieId = location.state.movieId;

  // I fetch the movie data using the useMovieById hook, which handles caching and
  // state management through React Query. This hook also provides a MovieState component
  // for rendering loading and error states.
  const { movie, MovieState } = useMovieById(movieId, getMovie);

  // I check if there's a loading or error state to display. The MovieState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = MovieState();
  if (stateComponent) return stateComponent;

  // I render the ReviewForm within the PageTemplate component, which provides the movie
  // header with poster and title. The ReviewForm component handles the form submission
  // and allows users to write or edit their review for the movie.
  return (
    <PageTemplate movie={movie}>
      <ReviewForm movie={movie} />
    </PageTemplate>
  );
};

export default WriteReviewPage;
