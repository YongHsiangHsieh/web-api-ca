import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";

/**
 * RemoveFromMustWatchIcon Component
 *
 * This component renders an interactive delete icon button that allows users to remove a movie
 * from their "Must Watch" list. I designed this as a reusable card action icon that integrates
 * with the application's global movies context for state management.
 *
 * State Management Strategy:
 * I use React Context (MoviesContext) to manage the Must Watch list state globally. This approach
 * ensures that when a user removes a movie, the change is reflected across all components that
 * depend on the Must Watch list without prop drilling.
 *
 * Event Handling Logic:
 * I call preventDefault() on the click event to prevent any parent elements (like Links or Cards)
 * from triggering their click handlers. This ensures that clicking the delete icon only removes
 * the movie and doesn't navigate elsewhere or trigger unwanted actions.
 *
 * Visual Design:
 * I implemented a hover animation that scales the icon by 20% and changes its color to the error
 * theme color (typically red). This provides clear visual feedback that this is a destructive
 * action, warning users before they remove a movie.
 *
 * Accessibility:
 * I include both a tooltip (for sighted users) and an aria-label (for screen readers) to ensure
 * the button's purpose is clear to all users.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object to be removed from the Must Watch list
 * @param {number} props.movie.id - The unique identifier of the movie
 *
 * @returns {React.ReactElement} An interactive delete icon button wrapped in a tooltip
 *
 * @example
 * import RemoveFromMustWatchIcon from './components/cardIcons/removeFromMustWatch';
 *
 * <RemoveFromMustWatchIcon movie={{ id: 550, title: "Fight Club" }} />
 */

/**
 * Renders a clickable delete icon button that removes a movie from the Must Watch list.
 *
 * I access the MoviesContext to retrieve the removeFromMustWatch function, which handles
 * the actual state update. This keeps the component focused on UI concerns while delegating
 * state management to the context.
 *
 * @function RemoveFromMustWatchIcon
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object to be removed
 * @param {number} props.movie.id - Unique movie identifier used for removal
 *
 * @returns {React.ReactElement} A Material-UI IconButton with hover effects and accessibility features
 */
const RemoveFromMustWatchIcon = ({ movie }) => {
  // I access the global movies context to get the removal function
  const context = useContext(MoviesContext);

  /**
   * Handles the click event to remove the movie from the Must Watch list.
   *
   * I call preventDefault() to stop the event from bubbling up to parent elements.
   * This is crucial when this icon is nested inside clickable cards or links - I want
   * only the removal action to occur, not navigation or other parent click handlers.
   *
   * @function handleRemoveFromMustWatch
   * @param {React.MouseEvent} e - The click event object
   */
  const handleRemoveFromMustWatch = (e) => {
    e.preventDefault();
    context.removeFromMustWatch(movie);
  };

  return (
    <Tooltip title="Remove from Must Watch" arrow placement="top">
      <IconButton
        aria-label="remove from must watch"
        onClick={handleRemoveFromMustWatch}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)", // I scale up on hover for visual feedback
            color: "error.main", // I use error color (red) to indicate destructive action
          },
        }}
      >
        <DeleteIcon color="primary" fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default RemoveFromMustWatchIcon;
