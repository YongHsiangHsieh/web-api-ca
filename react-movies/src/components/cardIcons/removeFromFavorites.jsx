import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";

/**
 * RemoveFromFavoritesIcon Component
 *
 * This component renders an interactive delete icon button that allows users to remove a movie
 * from their Favorites list. I designed this as a reusable card action icon that integrates
 * with the application's global movies context for centralized state management.
 *
 * State Management Strategy:
 * I use React Context (MoviesContext) to manage the Favorites list globally. This approach
 * ensures that when a user removes a movie, the change is immediately reflected across all
 * components that display or depend on the favorites list, without requiring prop drilling
 * through multiple component layers.
 *
 * Event Handling Logic:
 * I call preventDefault() on the click event to stop event propagation to parent elements.
 * This is essential because this icon is often nested inside clickable cards or links - I want
 * to ensure that clicking the delete icon only removes the movie and doesn't trigger navigation
 * or other parent click handlers.
 *
 * Visual Design:
 * I implemented a hover animation that scales the icon by 20% and changes its color to the error
 * theme color (typically red). This color choice is intentional - red universally signals a
 * destructive action, providing users with clear visual feedback that they're about to remove
 * something from their collection.
 *
 * Accessibility:
 * I include both a descriptive tooltip (for sighted users) and an aria-label (for screen readers)
 * to ensure the button's purpose is clearly communicated to all users, regardless of how they
 * interact with the application.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object to be removed from the Favorites list
 * @param {number} props.movie.id - The unique identifier of the movie (used for state management)
 *
 * @returns {React.ReactElement} An interactive delete icon button wrapped in a tooltip
 *
 * @example
 * import RemoveFromFavoritesIcon from './components/cardIcons/removeFromFavorites';
 *
 * <RemoveFromFavoritesIcon movie={{ id: 550, title: "Fight Club" }} />
 */

/**
 * Renders a clickable delete icon button that removes a movie from the Favorites list.
 *
 * I access the MoviesContext to retrieve the removeFromFavorites function, which handles
 * the actual state update and persistence. This separation keeps the component focused on
 * UI concerns while delegating complex state management logic to the context.
 *
 * @function RemoveFromFavoritesIcon
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object to be removed
 * @param {number} props.movie.id - Unique movie identifier used for removal operation
 *
 * @returns {React.ReactElement} A Material-UI IconButton with hover effects, tooltip, and
 *                               accessibility features
 */
const RemoveFromFavoritesIcon = ({ movie }) => {
  // I access the global movies context to get the removal function
  const context = useContext(MoviesContext);

  /**
   * Handles the click event to remove the movie from the Favorites list.
   *
   * I call preventDefault() to stop the event from bubbling up to parent elements.
   * This is critical when this icon is nested inside clickable components like movie cards
   * or navigation links. Without preventDefault(), clicking the delete icon might also
   * trigger navigation to the movie details page, which is not the intended behavior.
   *
   * @function handleRemoveFromFavorites
   * @param {React.MouseEvent} e - The click event object from the IconButton
   */
  const handleRemoveFromFavorites = (e) => {
    e.preventDefault();
    context.removeFromFavorites(movie);
  };

  return (
    <Tooltip title="Remove from Favorites" arrow placement="top">
      <IconButton
        aria-label="remove from favorites"
        onClick={handleRemoveFromFavorites}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)", // I scale up on hover for immediate visual feedback
            color: "error.main", // I use error color (red) to signal destructive action
          },
        }}
      >
        <DeleteIcon color="primary" fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default RemoveFromFavoritesIcon;
