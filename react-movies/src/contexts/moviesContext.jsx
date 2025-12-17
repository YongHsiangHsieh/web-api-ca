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
 * 2. Backend Sync with Optimistic Updates
 *    - Local state is updated immediately for responsive UI
 *    - Backend API is called in background to persist data
 *    - If user is not authenticated, only local state is used
 *    - This gives instant feedback while ensuring data persistence
 *
 * 3. Auth Integration
 *    - I access AuthContext to get the token for API calls
 *    - When authenticated, add/remove operations sync to backend
 *    - loadUserLists() loads data from backend on login
 *    - clearLists() resets state on logout
 *
 * 4. Collection Storage
 *    - Favorites and must-watch are stored as arrays of movie IDs
 *    - Arrays make it easy to map over and display collections
 *
 * 5. Reviews Storage
 *    - I store reviews as an object keyed by movie ID
 *    - This makes lookups O(1) - instant checking if a movie has a review
 *    - Object structure: { movieId: reviewObject, movieId: reviewObject, ... }
 *
 * Global State Structure:
 * {
 *   // Favorites
 *   favorites: [movieId1, movieId2, ...],
 *   addToFavorites: (movie) => void,
 *   removeFromFavorites: (movie) => void,
 *
 *   // Must Watch
 *   mustWatch: [movieId1, movieId2, ...],
 *   addToMustWatch: (movie) => void,
 *   removeFromMustWatch: (movie) => void,
 *
 *   // List Management (for auth integration)
 *   loadUserLists: (token) => Promise<void>,
 *   clearLists: () => void,
 *
 *   // Reviews
 *   addReview: (movie, review) => void,
 *   myReviews: { movieId: review, movieId: review, ... }
 * }
 *
 * @module contexts/moviesContext
 */

import React, { useState, useContext } from "react";
import { AuthContext } from "./authContext";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getMustWatch,
  addToMustWatch as apiAddToMustWatch,
  removeFromMustWatch as apiRemoveFromMustWatch,
} from "../api/backend-client";

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
 * 1. Favorites - Array of favorite movie IDs
 * 2. Must Watch - Array of movie IDs to watch later
 * 3. My Reviews - Object of user-written reviews keyed by movie ID
 *
 * The provider handles state initialization, backend synchronization,
 * and context value assembly. It wraps the application tree to provide global access.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} A Context Provider wrapping the children
 */
const MoviesContextProvider = ({ children }) => {
  // I get auth state to determine if we should sync with backend
  const { token, isAuthenticated } = useContext(AuthContext);

  // I maintain favorites as an array of movie IDs
  const [favorites, setFavorites] = useState([]);

  // I maintain must-watch as an array of movie IDs
  const [mustWatch, setMustWatch] = useState([]);

  // I maintain reviews as an object keyed by movieId for O(1) lookup
  const [myReviews, setMyReviews] = useState({});

  // ============================================
  // FAVORITES HANDLERS
  // ============================================

  /**
   * Adds a movie to favorites.
   *
   * I use optimistic updates: the UI updates immediately, and the backend
   * sync happens in the background. If the user is not authenticated,
   * only local state is updated.
   *
   * @param {Object} movie - Movie object with id property
   */
  const addToFavorites = async (movie) => {
    const movieId = movie.id;

    // Optimistic update - update UI immediately
    setFavorites((prev) => {
      if (prev.includes(movieId)) {
        return prev; // Already in favorites
      }
      return [...prev, movieId];
    });

    // Sync to backend if authenticated
    if (isAuthenticated && token) {
      try {
        await addFavorite(token, movieId);
      } catch (error) {
        console.error("Failed to sync favorite to backend:", error);
        // Note: We don't revert the UI here for simplicity
        // In production, you might want to show an error toast
      }
    }
  };

  /**
   * Removes a movie from favorites.
   *
   * @param {Object} movie - Movie object with id property
   */
  const removeFromFavorites = async (movie) => {
    const movieId = movie.id;

    // Optimistic update - update UI immediately
    setFavorites((prev) => prev.filter((id) => id !== movieId));

    // Sync to backend if authenticated
    if (isAuthenticated && token) {
      try {
        await removeFavorite(token, movieId);
      } catch (error) {
        console.error("Failed to sync favorite removal to backend:", error);
      }
    }
  };

  // ============================================
  // MUST-WATCH HANDLERS
  // ============================================

  /**
   * Adds a movie to must-watch list.
   *
   * @param {Object} movie - Movie object with id property
   */
  const addToMustWatch = async (movie) => {
    const movieId = movie.id;

    // Optimistic update - update UI immediately
    setMustWatch((prev) => {
      if (prev.includes(movieId)) {
        return prev; // Already in must-watch
      }
      return [...prev, movieId];
    });

    // Sync to backend if authenticated
    if (isAuthenticated && token) {
      try {
        await apiAddToMustWatch(token, movieId);
      } catch (error) {
        console.error("Failed to sync must-watch to backend:", error);
      }
    }
  };

  /**
   * Removes a movie from must-watch list.
   *
   * @param {Object} movie - Movie object with id property
   */
  const removeFromMustWatch = async (movie) => {
    const movieId = movie.id;

    // Optimistic update - update UI immediately
    setMustWatch((prev) => prev.filter((id) => id !== movieId));

    // Sync to backend if authenticated
    if (isAuthenticated && token) {
      try {
        await apiRemoveFromMustWatch(token, movieId);
      } catch (error) {
        console.error("Failed to sync must-watch removal to backend:", error);
      }
    }
  };

  // ============================================
  // LIST MANAGEMENT (for auth integration)
  // ============================================

  /**
   * Loads user's lists from the backend.
   *
   * I call this when a user logs in to restore their saved lists.
   * The token parameter allows this to be called from AuthContext
   * without circular dependency issues.
   *
   * @param {string} userToken - JWT token for authentication
   */
  const loadUserLists = async (userToken) => {
    try {
      // Fetch both lists in parallel for better performance
      const [favoritesData, mustWatchData] = await Promise.all([
        getFavorites(userToken),
        getMustWatch(userToken),
      ]);

      // Update local state with backend data
      setFavorites(favoritesData || []);
      setMustWatch(mustWatchData || []);
    } catch (error) {
      console.error("Failed to load user lists from backend:", error);
      // Keep existing local state if load fails
    }
  };

  /**
   * Clears all lists.
   *
   * I call this when a user logs out to reset the state.
   * This ensures the next user doesn't see the previous user's data.
   */
  const clearLists = () => {
    setFavorites([]);
    setMustWatch([]);
    setMyReviews({});
  };

  // ============================================
  // REVIEWS HANDLER
  // ============================================

  /**
   * Adds a review for a movie.
   *
   * I store the review in an object keyed by the movie ID. This allows
   * quick lookup of reviews by movie ID and makes it easy to update
   * or replace a review for a specific movie.
   *
   * Note: Reviews are currently stored locally only.
   * Backend persistence could be added later.
   *
   * @param {Object} movie - Movie object containing the movie ID
   * @param {Object} review - Review object containing review data
   */
  const addReview = (movie, review) => {
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
        addToFavorites,
        removeFromFavorites,

        // Must-watch collection and handlers
        mustWatch,
        addToMustWatch,
        removeFromMustWatch,

        // List management (for auth integration)
        loadUserLists,
        clearLists,

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
