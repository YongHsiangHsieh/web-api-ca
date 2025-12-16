import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link } from "react-router";
import { ROUTES } from "../../constants/routes";

/**
 * WriteReviewIcon Component
 *
 * This component renders an interactive icon button that allows users to write a review for
 * a specific movie. I designed this as a reusable card action icon that navigates users to
 * the review form page while preserving the movie context through React Router's state.
 *
 * Navigation Strategy:
 * I use React Router's Link component with state passing to navigate to the review form.
 * This approach allows me to transfer the movie ID without exposing it in the URL, providing
 * a cleaner user experience while maintaining the necessary context for the review form.
 *
 * Visual Design:
 * I implemented a hover animation that scales the icon by 20% and changes its color to the
 * secondary theme color. This provides immediate visual feedback, indicating to users that
 * the icon is interactive and clickable.
 *
 * Accessibility:
 * I include both a tooltip (for sighted users) and an aria-label (for screen readers) to
 * ensure the button's purpose is clear to all users, regardless of their abilities.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object for which a review can be written
 * @param {number} props.movie.id - The unique identifier of the movie
 *
 * @returns {React.ReactElement} An interactive icon button wrapped in a tooltip that navigates
 *                               to the review form page when clicked
 *
 * @example
 * import WriteReviewIcon from './components/cardIcons/writeReview';
 *
 * <WriteReviewIcon movie={{ id: 550 }} />
 */

/**
 * Renders a clickable icon button that navigates to the movie review form.
 *
 * I wrap the icon button with a Tooltip to provide users with clear context about what
 * happens when they click. The button uses React Router's Link component to perform
 * client-side navigation, avoiding full page reloads for a smoother user experience.
 *
 * State Passing Logic:
 * I pass the movie ID through React Router's state mechanism rather than URL parameters
 * because it keeps the URL cleaner and prevents users from accidentally navigating to the
 * review form without proper context.
 *
 * @function WriteReviewIcon
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object containing at minimum the movie's ID
 * @param {number} props.movie.id - Unique movie identifier passed to the review form
 *
 * @returns {React.ReactElement} A Material-UI IconButton styled as a Link with hover effects
 *                               and accessibility features
 */
const WriteReviewIcon = ({ movie }) => {
  return (
    <Tooltip title="Write a Review" arrow placement="top">
      {/* I use IconButton as a Link to combine navigation with Material-UI's button styling */}
      <IconButton
        component={Link}
        to={ROUTES.REVIEWS.FORM}
        state={{
          movieId: movie.id,
        }}
        aria-label="write a review"
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)", // I scale up on hover for visual feedback
            color: "secondary.main", // I change color to indicate interactivity
          },
        }}
      >
        <RateReviewIcon color="primary" fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default WriteReviewIcon;
