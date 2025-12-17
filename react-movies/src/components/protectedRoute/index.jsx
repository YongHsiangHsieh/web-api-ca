/**
 * Protected Route Component
 *
 * This component guards routes that require authentication.
 * It wraps protected pages and redirects unauthenticated users to the login page.
 *
 * Key Design Decisions:
 *
 * 1. Simple Redirect Pattern
 *    - I use React Router's Navigate component for declarative redirection
 *    - No intermediate "please login" screen - direct redirect to login
 *    - Clean UX: user sees login page immediately
 *
 * 2. Children Pass-Through
 *    - When authenticated, I simply render the children (the protected page)
 *    - This keeps the component flexible - any page can be protected
 *
 * 3. Context Integration
 *    - I read auth state from AuthContext using useContext
 *    - Consistent with the app's auth state management pattern
 *
 * Usage Pattern:
 * - Wrap protected routes with this component in the router configuration
 * - The component handles the auth check automatically
 *
 * @component
 * @example
 * // In route configuration
 * <Route
 *   path="/movies/my-list"
 *   element={
 *     <ProtectedRoute>
 *       <MyListPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // Multiple protected routes
 * <Route path="/reviews/form" element={
 *   <ProtectedRoute>
 *     <AddMovieReviewPage />
 *   </ProtectedRoute>
 * } />
 */

import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../contexts/authContext";
import { ROUTES } from "../../constants/routes";

/**
 * A wrapper component that protects routes from unauthenticated access.
 *
 * I check if the user is authenticated using the AuthContext. If they are,
 * I render the children (the protected page). If not, I redirect them to
 * the login page using React Router's Navigate component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The protected content to render if authenticated
 * @returns {JSX.Element} Either the children or a Navigate redirect to login
 */
const ProtectedRoute = ({ children }) => {
  // I access the auth context to check authentication status
  const { isAuthenticated } = useContext(AuthContext);

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Navigate component performs a declarative redirect
    // replace prop replaces current history entry (so back button doesn't return here)
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
