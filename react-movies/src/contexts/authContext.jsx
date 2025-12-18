/**
 * Authentication Context and Provider
 *
 * This module provides global authentication state management for the application.
 * It handles user login, signup, logout, and session persistence using React Context API.
 *
 * Key Design Decisions:
 *
 * 1. Context API for Auth State
 *    - I chose Context API to make auth state accessible throughout the app
 *    - Any component can check if user is logged in without prop drilling
 *    - Consistent with the MoviesContext pattern used elsewhere in the app
 *
 * 2. Token-Based Authentication
 *    - I use JWT tokens received from the backend for authentication
 *    - Token is stored in localStorage for persistence across browser sessions
 *    - Token contains encoded username, which I decode to get user info
 *
 * 3. Session Persistence
 *    - On app load, I check localStorage for an existing token
 *    - If found, I restore the session automatically (user stays logged in)
 *    - This provides a seamless experience - no re-login needed after refresh
 *
 * 4. Error Handling
 *    - I store error messages in state for components to display
 *    - Errors are cleared when starting a new auth operation
 *    - Backend error messages are passed through for user-friendly feedback
 *
 * 5. Loading State
 *    - I track loading state during async operations (login/signup)
 *    - Components can show spinners or disable buttons while loading
 *    - Prevents double-submissions and improves UX
 *
 * Global State Structure:
 * {
 *   user: { username: string } | null,  // Current user or null if not logged in
 *   token: string | null,                // JWT token or null
 *   isAuthenticated: boolean,            // Quick check for auth status
 *   loading: boolean,                    // True during API calls
 *   error: string | null,                // Error message or null
 *   signupUser: (username, password) => Promise<boolean>,
 *   loginUser: (username, password) => Promise<boolean>,
 *   logout: () => void,
 * }
 *
 * Usage Pattern:
 * - Wrap app with <AuthContextProvider>
 * - Use useContext(AuthContext) in components
 * - Check isAuthenticated for protected routes
 * - Call loginUser/signupUser/logout for auth actions
 *
 * @module contexts/authContext
 * @example
 * // In main App component
 * <AuthContextProvider>
 *   <App />
 * </AuthContextProvider>
 *
 * @example
 * // In any child component
 * const { isAuthenticated, user, loginUser, logout } = useContext(AuthContext);
 * if (isAuthenticated) {
 *   console.log(`Welcome, ${user.username}!`);
 * }
 */

import React, { useState, useEffect } from "react";
import { signup, login } from "../api/backend-client";

/**
 * React Context for authentication state.
 *
 * I create this context to make auth state accessible throughout the application.
 * Components can import this and use useContext(AuthContext) to access auth state
 * and functions.
 *
 * @constant
 * @type {React.Context}
 */
export const AuthContext = React.createContext(null);

/**
 * Decodes a JWT token to extract the payload (without verification).
 *
 * JWT tokens have three parts separated by dots: header.payload.signature
 * The payload is base64-encoded JSON containing user data.
 *
 * Note: This only DECODES, it doesn't VERIFY. Verification happens on the backend.
 * I use this just to extract the username for display purposes.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded payload or null if decoding fails
 *
 * @example
 * const payload = decodeToken("eyJhbG...");
 * console.log(payload.username); // "john_doe"
 */
const decodeToken = (token) => {
  try {
    // Split token into parts and get the payload (middle part)
    const payload = token.split('.')[1];
    // Decode base64 and parse JSON
    return JSON.parse(atob(payload));
  } catch (error) {
    // If decoding fails, return null (invalid token)
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Authentication Context Provider component.
 *
 * I manage all authentication state here:
 * - user: The current logged-in user's info
 * - token: The JWT token for API authentication
 * - loading: Whether an auth operation is in progress
 * - error: Any error message from failed auth attempts
 *
 * On mount, I check localStorage for an existing token to restore sessions.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} A Context Provider wrapping the children
 */
const AuthContextProvider = ({ children }) => {
  // I store the current user object (contains username)
  const [user, setUser] = useState(null);

  // I store the JWT token for authenticated API requests
  const [token, setToken] = useState(null);

  // I track loading state during async operations (login/signup)
  const [loading, setLoading] = useState(false);

  // I track whether the app is still checking localStorage for a saved session
  // This prevents the "flash to login" issue on page refresh
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // I store error messages for display in UI
  const [error, setError] = useState(null);

  // I derive isAuthenticated from token existence for convenience
  const isAuthenticated = token !== null;

  /**
   * Effect: Restore session from localStorage on app mount.
   *
   * I check if there's a saved token from a previous session.
   * If found, I decode it to get the username and restore the auth state.
   * This allows users to stay logged in across browser refreshes.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // Decode the token to get user info
      const decoded = decodeToken(savedToken);
      if (decoded && decoded.username) {
        // Restore the session
        setToken(savedToken);
        setUser({ username: decoded.username });
      } else {
        // Invalid token - clear it
        localStorage.removeItem('token');
      }
    }
    // Mark session restoration as complete (whether we found a token or not)
    setIsRestoringSession(false);
  }, []); // Empty dependency array = run once on mount

  /**
   * Registers a new user account.
   *
   * I call the signup API and handle success/error states.
   * On success, I don't automatically log in - user is redirected to login page.
   * This is more consistent and avoids potential issues with auto-login.
   *
   * @async
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<boolean>} True if signup succeeded, false otherwise
   */
  const signupUser = async (username, password) => {
    // Clear any previous errors and set loading
    setError(null);
    setLoading(true);

    try {
      // Call the signup API
      await signup(username, password);
      
      // Success! Return true (caller will redirect to login)
      setLoading(false);
      return true;
    } catch (err) {
      // Failed - store the error message for display
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  /**
   * Authenticates a user and establishes a session.
   *
   * I call the login API, and on success:
   * 1. Store the token in localStorage (persistence)
   * 2. Decode the token to get username
   * 3. Update state with user and token
   *
   * @async
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<boolean>} True if login succeeded, false otherwise
   */
  const loginUser = async (username, password) => {
    // Clear any previous errors and set loading
    setError(null);
    setLoading(true);

    try {
      // Call the login API - returns the token
      const receivedToken = await login(username, password);

      // Store token in localStorage for persistence
      localStorage.setItem('token', receivedToken);

      // Decode token to get username
      const decoded = decodeToken(receivedToken);

      // Update state
      setToken(receivedToken);
      setUser({ username: decoded.username });
      setLoading(false);
      
      return true;
    } catch (err) {
      // Failed - store the error message for display
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  /**
   * Logs out the current user.
   *
   * I clear all auth state and remove the token from localStorage.
   * This effectively ends the session - user will need to log in again.
   */
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');

    // Clear state
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        // Auth state
        user,
        token,
        isAuthenticated,
        isRestoringSession, // True while checking localStorage for saved session
        loading,
        error,

        // Auth functions
        signupUser,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
