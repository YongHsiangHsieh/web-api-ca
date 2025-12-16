/**
 * Movies Context and Provider
 *
 * This module provides global state management for user-specific movie data:
 * favorites, must-watch lists, and user reviews. It uses React Context API
 * to make this data accessible throughout the application without prop drilling.
 *
 * Key Design Decisions:
 *
 * 1. Context API over Redux
 *    - I chose Context API for simplicity since the state is relatively small
 *    - Avoids boilerplate and complexity of Redux
 *    - Still provides clean separation of state management
 *    - Perfect for this use case with moderate state needs
 *
 * 2. Collection Storage
 *    - Favorites and must-watch are stored as arrays
 *    - I use these for lists of movies, making iteration straightforward
 *    - Arrays make it easy to map over and display collections
 *
 * 3. Reviews Storage
 *    - I store reviews as an object keyed by movie ID
 *    - This makes lookups O(1) - instant checking if a movie has a review
 *    - Object structure: { movieId: reviewObject, movieId: reviewObject, ... }
 *    - Different pattern from collections to optimize retrieval
 *
 * 4. Reusable Handlers
 *    - I use createCollectionHandlers utility for favorites and must-watch
 *    - Both collections share the same add/remove logic
 *    - This reduces code duplication and ensures consistency
 *    - Handlers are pre-bound to their respective state/setState pairs
 *
 * 5. Review Management
 *    - I implement addReview with a custom handler since it needs object updates
 *    - Using spread syntax (...prev) to create immutable updates
 *    - This pattern is more efficient than array operations for movie-by-ID lookup
 *
 * 6. Provider Pattern
 *    - I export the context and provider separately
 *    - Context: For using useContext in components
 *    - Provider: For wrapping the app tree at the root level
 *    - Clean separation of concerns
 *
 * Global State Structure:
 * {
 *   // Favorites
 *   favorites: [movie1, movie2, ...],
 *   addToFavorites: (movie) => void,
 *   removeFromFavorites: (movieId) => void,
 *
 *   // Must Watch
 *   mustWatch: [movie1, movie2, ...],
 *   addToMustWatch: (movie) => void,
 *   removeFromMustWatch: (movieId) => void,
 *
 *   // Reviews
 *   addReview: (movie, review) => void,
 *   myReviews: { movieId: review, movieId: review, ... }
 * }
 *
 * Usage Pattern:
 * - Wrap app with <MoviesContextProvider>
 * - Use useContext(MoviesContext) in components
 * - Call functions to add/remove/review movies
 *
 * @module contexts/moviesContext
 * @example
 * // In main App component
 * <MoviesContextProvider>
 *   <App />
 * </MoviesContextProvider>
 *
 * @example
 * // In any child component
 * const context = useContext(MoviesContext);
 * context.addToFavorites(movie);
 */

import React, { useState } from "react";
import { createCollectionHandlers } from "../utils/collections";

/**
 * React Context for global movie data.
 *
 * I create this context to make movie collections and reviews accessible
 * throughout the application without prop drilling. Components can import
 * this and use useContext(MoviesContext) to access the global state.
 *
 * @constant
 * @type {React.Context}
 */
export const MoviesContext = React.createContext(null);

/**
 * Context provider component for movies data.
 *
 * I manage three separate collections here:
 * 1. Favorites - Array of favorite movies
 * 2. Must Watch - Array of movies to watch later
 * 3. My Reviews - Object of user-written reviews keyed by movie ID
 *
 * The provider handles state initialization, handler creation, and context
 * value assembly. It wraps the application tree to provide global access.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} A Context Provider wrapping the children
 */
const MoviesContextProvider = ({ children }) => {
  // I maintain favorites as an array for easy iteration and display
  const [favorites, setFavorites] = useState([]);

  // I maintain must-watch as an array with the same interface as favorites
  const [mustWatch, setMustWatch] = useState([]);

  // I maintain reviews as an object keyed by movieId for O(1) lookup
  // Structure: { movieId: reviewObject, movieId: reviewObject, ... }
  const [myReviews, setMyReviews] = useState({});

  /**
   * Handlers for the favorites collection.
   *
   * I use the createCollectionHandlers utility to generate add and remove
   * functions for the favorites. This keeps the code DRY and ensures
   * consistent collection management across all lists.
   */
  const favoritesHandlers = createCollectionHandlers(favorites, setFavorites);

  /**
   * Handlers for the must-watch collection.
   *
   * I use the same utility to create handlers for must-watch, giving it
   * the same API as favorites even though they're separate collections.
   */
  const mustWatchHandlers = createCollectionHandlers(mustWatch, setMustWatch);

  /**
   * Adds a review for a movie.
   *
   * I store the review in an object keyed by the movie ID. This allows
   * quick lookup of reviews by movie ID and makes it easy to update
   * or replace a review for a specific movie.
   *
   * @param {Object} movie - Movie object containing the movie ID
   * @param {number} movie.id - Movie ID used as the key
   * @param {Object} review - Review object containing review data
   */
  const addReview = (movie, review) => {
    // I use object spread to create an immutable update
    // This is the React best practice for updating objects in state
    setMyReviews((prev) => ({
      ...prev,
      [movie.id]: review,
    }));
  };

  return (
    <MoviesContext.Provider
      value={{
        // Favorites collection and handlers
        favorites,
        addToFavorites: favoritesHandlers.add,
        removeFromFavorites: favoritesHandlers.remove,

        // Must-watch collection and handlers
        mustWatch,
        addToMustWatch: mustWatchHandlers.add,
        removeFromMustWatch: mustWatchHandlers.remove,

        // Reviews collection and handler
        addReview,
        myReviews,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
