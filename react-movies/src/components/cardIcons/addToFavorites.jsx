import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from "@mui/icons-material/Favorite";

/**
 * AddToFavoritesIcon Component
 *
 * This component renders an interactive heart icon button that allows users to add a movie
 * to their Favorites collection. I designed this as a reusable card action icon that integrates
 * seamlessly with the application's global movies context for centralized state management.
 *
 * State Management Strategy:
 * I use React Context (MoviesContext) to manage the Favorites list globally. This approach
 * ensures that when a user adds a movie to favorites, the change is immediately reflected
 * across all components that display or depend on the favorites collection, without requiring
 * complex prop drilling through multiple component layers.
 *
 * Event Handling Logic:
 * I call preventDefault() on the click event to prevent event propagation to parent elements.
 * This is essential because this icon is typically nested inside clickable movie cards or links.
 * Without preventDefault(), clicking the heart icon would both add the movie to favorites AND
 * trigger navigation, which would disrupt the user's browsing flow and create confusion.
 *
 * Visual Design:
 * I implemented a hover animation that scales the icon by 20% and changes its color to a
 * custom favorite color (likely a shade of red or pink). I chose the heart icon (FavoriteIcon)
 * because it's universally recognized as a symbol for liking or favoriting content, making
 * the button's purpose immediately intuitive to users across cultures.
 *
 * Accessibility:
 * I include both a descriptive tooltip (for sighted users on hover) and an aria-label (for
 * screen readers) to ensure the button's purpose is clearly communicated to all users,
 * regardless of their abilities or how they interact with the application.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object to be added to the Favorites list
 * @param {number} props.movie.id - The unique identifier of the movie (required for state management)
 *
 * @returns {React.ReactElement} An interactive heart icon button wrapped in a tooltip
 *
 * @example
 * import AddToFavoritesIcon from './components/cardIcons/addToFavorites';
 *
 * <AddToFavoritesIcon movie={{ id: 550, title: "Fight Club" }} />
 */

/**
 * Renders a clickable heart icon button that adds a movie to the Favorites list.
 *
 * I access the MoviesContext to retrieve the addToFavorites function, which handles the
 * actual state update and persistence logic. This separation of concerns keeps the component
 * focused on presentation and user interaction, while delegating complex state management
 * (such as duplicate checking, storage, and notification) to the context layer.
 *
 * @function AddToFavoritesIcon
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object to be added to the Favorites list
 * @param {number} props.movie.id - Unique movie identifier used for the add operation
 *
 * @returns {React.ReactElement} A Material-UI IconButton with hover effects, tooltip, and
 *                               accessibility features
 */
const AddToFavoritesIcon = ({ movie }) => {
  // I access the global movies context to get the add function
  const context = useContext(MoviesContext);

  /**
   * Handles the click event to add the movie to the Favorites list.
   *
   * I call preventDefault() to stop the event from bubbling up to parent elements.
   * This is critical when this icon is nested inside clickable components like movie cards
   * or navigation links. Without preventDefault(), clicking the heart icon might also
   * navigate to the movie details page, which would interrupt the user's browsing session
   * and create uncertainty about whether the movie was successfully added to favorites.
   *
   * @function handleAddToFavorites
   * @param {React.MouseEvent} e - The click event object from the IconButton
   */
  const handleAddToFavorites = (e) => {
    e.preventDefault();
    context.addToFavorites(movie);
  };

  return (
    <Tooltip title="Add to Favorites" arrow placement="top">
      <IconButton
        aria-label="add to favorites"
        onClick={handleAddToFavorites}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)", // I scale up on hover for immediate visual feedback
            color: "custom.favorite", // I use custom favorite color (likely red/pink) for emotional connection
          },
        }}
      >
        <FavoriteIcon color="primary" fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AddToFavoritesIcon;
