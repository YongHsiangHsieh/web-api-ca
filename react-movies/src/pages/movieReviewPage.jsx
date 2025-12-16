import React from "react";
import { useLocation } from "react-router";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";

/**
 * Page component that displays a movie review.
 *
 * I retrieve the movie and review data from the React Router location state, which should be
 * passed when navigating to this page. I use the PageTemplate component to display the movie
 * header/details, and render the MovieReview component to show the full review content.
 *
 * This page is designed to be accessed via React Router's navigation with state, typically from
 * a reviews list or movie details page where a user has selected a review to read in full.
 *
 * @component
 * @param {Object} props - Component props (unused, kept for compatibility)
 * @returns {React.ReactElement} A page component displaying a full movie review with the movie
 *                               context and review details
 *
 * @example
 * // Navigation to this page should include state with movie and review data
 * import { useNavigate } from 'react-router';
 *
 * const navigate = useNavigate();
 * navigate('/movie-review', { state: { movie: movieData, review: reviewData } });
 */
const MovieReviewPage = (props) => {
  // I extract the movie and review data from the React Router location state.
  // This data should have been passed during navigation via the 'state' property.
  let location = useLocation();
  const { movie, review } = location.state;

  // I render the review within the PageTemplate component, which provides the movie
  // header and context. The MovieReview component displays the full review content.
  return (
    <PageTemplate movie={movie}>
      <MovieReview review={review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;
