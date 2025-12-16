import React from "react";
import Typography from "@mui/material/Typography";

/**
 * MovieReview Component
 *
 * This component renders a single movie review with the author's name and review content.
 * I designed this as a simple, focused presentation component that displays review information
 * in a clear, readable format.
 *
 * Design Philosophy:
 * I keep this component deliberately simple because it's meant to be used within a list or
 * collection of reviews. The parent component (like MovieReviews) handles the layout, spacing,
 * and any additional decorative elements, while this component focuses solely on displaying
 * the review data.
 *
 * Typography Hierarchy:
 * I use h5 for the author name to make it prominent and clearly identify who wrote the review.
 * The review content uses h6 styling but is semantically a paragraph (component="p"), which
 * provides good visual weight for the text while maintaining proper HTML semantics.
 *
 * Fragment Usage:
 * I wrap the content in a React Fragment (<></>) rather than a div because this component
 * doesn't need its own container element. This keeps the DOM clean and gives the parent
 * component full control over spacing and layout between multiple reviews.
 *
 * Simplicity Rationale:
 * I intentionally avoid adding borders, backgrounds, or complex styling here. This makes
 * the component more flexible and allows it to adapt to different contexts (modal, drawer,
 * page section) without fighting against parent styles.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.review - The review object containing author and content
 * @param {string} props.review.author - The name of the review author
 * @param {string} props.review.content - The full text content of the review
 *
 * @returns {React.ReactElement} A fragment containing the review author and content
 *
 * @example
 * import MovieReview from './components/movieReview';
 *
 * <MovieReview
 *   review={{
 *     author: "John Doe",
 *     content: "This movie was absolutely fantastic! The cinematography..."
 *   }}
 * />
 */

/**
 * Renders a single review with author name and content.
 *
 * I use Typography components with appropriate variants to create visual hierarchy.
 * The Fragment wrapper keeps the DOM clean without adding unnecessary container elements,
 * allowing the parent component to control layout and spacing.
 *
 * @function MovieReview
 * @param {Object} props - Component props
 * @param {Object} props.review - Review data object
 * @param {string} props.review.author - Display name of the reviewer
 * @param {string} props.review.content - Full review text
 *
 * @returns {React.ReactElement} A React Fragment with author heading and review content
 */
const MovieReview = ({ review }) => {
  return (
    <>
      {/* I use h5 variant to make the author name prominent */}
      <Typography variant="h5" component="h3">
        Review By: {review.author}
      </Typography>

      {/* I use h6 variant for good text weight while keeping semantic paragraph element */}
      <Typography variant="h6" component="p">
        {review.content}
      </Typography>
    </>
  );
};

export default MovieReview;
