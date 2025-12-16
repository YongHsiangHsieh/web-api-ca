/**
 * Person Details Hook Module
 *
 * This hook fetches detailed information about an actor or person from the TMDB API.
 * It handles loading and error states, and provides a skeleton component that matches
 * the layout of the final person details display.
 *
 * Key Design Decisions:
 *
 * 1. Reusable Query Function
 *    - I accept queryFn as a parameter instead of hardcoding the API call
 *    - This allows different components to use different query functions
 *    - Makes the hook flexible and testable with mock functions
 *    - Enables easy adaptation for API changes
 *
 * 2. Person ID as Cache Key
 *    - I use QUERY_KEYS.PERSON(personId) for unique caching per person
 *    - Different actors have separate caches
 *    - Switching between actors reuses cached data if already fetched
 *    - Improves performance when revisiting previous actors
 *
 * 3. Detailed Loading Skeleton
 *    - I provide a comprehensive skeleton that matches the actual layout
 *    - Skeleton includes: name, profile photo, biography, and additional info
 *    - All skeleton elements use realistic dimensions
 *    - Prevents layout shift when actual data loads
 *
 * 4. Profile Photo Skeleton
 *    - 300x450 dimensions match typical poster/profile photo aspect ratio
 *    - borderRadius: 2 matches the rounded corners of real photos
 *    - Shows users what type of content is loading
 *
 * 5. Biography Section Skeleton
 *    - Multiple text skeletons of varying widths simulate paragraph layout
 *    - Widths range from 90-100% to look natural
 *    - Gives visual context of biography length
 *
 * 6. Additional Info Section Skeleton
 *    - Two-column layout for additional details (birthday, place of birth, etc.)
 *    - Demonstrates the layout users will see
 *    - Each column has a label and value skeleton
 *
 * 7. Direct Data Return
 *    - I return the person data directly (not wrapped)
 *    - Keeps return object simple and familiar
 *    - Component receives the full person object with all properties
 *
 * 8. State Encapsulation
 *    - I provide PersonState component for rendering loading/error UI
 *    - Separates loading/error display from data logic
 *    - Components can render state or data independently
 *
 * Data Flow:
 * 1. Receive personId and queryFn
 * 2. Execute React Query with person-specific cache key
 * 3. Return person data, loading state, error state
 * 4. Provide PersonState component for conditional rendering
 *
 * @module hooks/usePersonDetails
 * @example
 * // In an actor detail page
 * const { person, isLoading, PersonState } = usePersonDetails(
 *   actorId,
 *   getPersonDetails
 * );
 *
 * return (
 *   <Box>
 *     <PersonState />
 *     {!isLoading && person && (
 *       <ActorProfile actor={person} />
 *     )}
 *   </Box>
 * );
 */

import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Custom hook for fetching actor/person details by ID.
 *
 * I built this hook to simplify fetching and displaying person details pages.
 * It manages loading and error states, and provides a skeleton UI component
 * that matches the layout of the actual person details display.
 *
 * The hook accepts a query function, making it flexible for different data sources
 * or query variations. It caches results per person ID, so revisiting previously
 * viewed actors will use the cached data.
 *
 * @param {string|number} personId - The TMDB person/actor ID to fetch details for
 * @param {Function} queryFn - The API query function that fetches person details
 *                             This function is called with the person ID as parameter
 * @returns {Object} Person details and state object
 * @returns {Object|null} return.person - The person object with all details (name, biography, images, etc.)
 * @returns {boolean} return.isLoading - True while person details are being fetched
 * @returns {Error|null} return.error - Error object if fetch fails, null otherwise
 * @returns {React.Component} return.PersonState - Component for rendering loading/error UI
 *
 * @example
 * // Basic usage in an actor detail page
 * const { person, isLoading, error, PersonState } = usePersonDetails(
 *   1,  // Person ID for Tom Hanks
 *   getPersonDetails
 * );
 *
 * return (
 *   <>
 *     <PersonState />
 *     {!isLoading && person && (
 *       <Box>
 *         <Typography variant="h4">{person.name}</Typography>
 *         <Typography>{person.biography}</Typography>
 *       </Box>
 *     )}
 *   </>
 * );
 */
export const usePersonDetails = (personId, queryFn) => {
  // I fetch person details using React Query
  // The query key is person-specific so different actors have separate caches
  const {
    data: person,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.PERSON(personId),
    queryFn: queryFn,
  });

  /**
   * Component for rendering person details loading and error states.
   *
   * I encapsulate the UI logic for loading skeletons and error messages
   * in a component. This keeps display logic separate from data fetching.
   * The skeleton layout closely matches the actual person details display.
   */
  const PersonState = () => {
    // While loading, I show a skeleton UI that matches the final layout
    if (isPending) {
      return (
        <Box sx={{ p: 3 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            {/* Person name skeleton - large text like the actual heading */}
            <Skeleton variant="text" width="50%" height={60} sx={{ mb: 2 }} />

            {/* Profile photo skeleton - matches typical poster dimensions */}
            <Skeleton
              variant="rectangular"
              width={300}
              height={450}
              sx={{ mb: 3, borderRadius: 2 }}
            />

            {/* Biography section skeleton */}
            {/* I use varying widths to simulate natural paragraph layout */}
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="98%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />

            {/* Additional info skeleton - two column layout */}
            {/* Shows place of birth, birthday, and other details */}
            <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                {/* First column (e.g., Birth Date) */}
                <Skeleton variant="text" width="60%" height={25} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
              <Box sx={{ flex: 1 }}>
                {/* Second column (e.g., Place of Birth) */}
                <Skeleton variant="text" width="60%" height={25} />
                <Skeleton variant="text" width="70%" height={20} />
              </Box>
            </Box>
          </Paper>
        </Box>
      );
    }

    // If the query fails, I display an error message
    if (isError) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            {error.message}
          </Typography>
        </Box>
      );
    }

    // If neither loading nor error, return null (no state to display)
    return null;
  };

  return {
    // I return the person data directly without wrapping
    // Component receives the full person object with all properties
    person,

    // I return the pending state directly as isLoading
    isLoading: isPending,

    // I return error only if isError is true, otherwise null
    error: isError ? error : null,

    // I provide the PersonState component for rendering loading/error UI
    PersonState,
  };
};
