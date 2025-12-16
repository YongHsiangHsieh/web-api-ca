import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

/**
 * AddToMustWatchIcon Component
 *
 * This component renders an interactive playlist-add icon button that allows users to add
 * a movie to their "Must Watch" list. I designed this as a reusable card action icon that
 * integrates seamlessly with the application's global movies context for state management.
 *
 * State Management Strategy:
 * I use React Context (MoviesContext) to manage the Must Watch list globally. This approach
 * ensures that when a user adds a movie, the change propagates immediately to all components
 * that depend on or display the Must Watch collection, without requiring complex prop drilling
 * through multiple component layers.
 *
 * Event Handling Logic:
 * I call preventDefault() on the click event to prevent event propagation to parent elements.
 * This is crucial because this icon is typically nested inside clickable movie cards or links.
 * Without preventDefault(), clicking the icon would both add the movie AND trigger navigation,
 * which creates a confusing user experience.
 *
 * Visual Design:
 * I implemented a hover animation that scales the icon by 20% and changes its color to the
 * secondary theme color. I chose the PlaylistAdd icon because it visually communicates the
 * action of adding to a list or queue, making the button's purpose immediately intuitive to users.
 *
 * Accessibility:
 * I include both a descriptive tooltip (for sighted users on hover) and an aria-label (for
 * screen readers) to ensure the button's purpose is clearly communicated to all users,
 * regardless of their abilities or how they interact with the application.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object to be added to the Must Watch list
 * @param {number} props.movie.id - The unique identifier of the movie (required for state management)
 *
 * @returns {React.ReactElement} An interactive playlist-add icon button wrapped in a tooltip
 *
 * @example
 * import AddToMustWatchIcon from './components/cardIcons/addToMustWatch';
 *
 * <AddToMustWatchIcon movie={{ id: 550, title: "Fight Club" }} />
 */

/**
 * Renders a clickable playlist-add icon button that adds a movie to the Must Watch list.
 *
 * I access the MoviesContext to retrieve the addToMustWatch function, which handles the
 * actual state update and persistence logic. This separation of concerns keeps the component
 * focused on presentation and user interaction, while delegating complex state management
 * to the context layer.
 *
 * @function AddToMustWatchIcon
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object to be added to the Must Watch list
 * @param {number} props.movie.id - Unique movie identifier used for the add operation
 *
 * @returns {React.ReactElement} A Material-UI IconButton with hover effects, tooltip, and
 *                               accessibility features
 */
const AddToMustWatchIcon = ({ movie }) => {
  // I access the global movies context to get the add function
  const context = useContext(MoviesContext);

  /**
   * Handles the click event to add the movie to the Must Watch list.
   *
   * I call preventDefault() to stop the event from bubbling up to parent elements.
   * This is essential when this icon is nested inside clickable components like movie cards
   * or navigation links. Without preventDefault(), clicking the icon might also navigate to
   * the movie details page, which would interrupt the user's flow and create confusion about
   * whether the movie was actually added to the list.
   *
   * @function handleAddToMustWatch
   * @param {React.MouseEvent} e - The click event object from the IconButton
   */
  const handleAddToMustWatch = (e) => {
    e.preventDefault();
    context.addToMustWatch(movie);
  };

  return (
    <Tooltip title="Add to Must Watch" arrow placement="top">
      <IconButton
        aria-label="add to must watch"
        onClick={handleAddToMustWatch}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)", // I scale up on hover for immediate visual feedback
            color: "secondary.main", // I change to secondary color to indicate interactivity
          },
        }}
      >
        <PlaylistAddIcon color="primary" fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AddToMustWatchIcon;
