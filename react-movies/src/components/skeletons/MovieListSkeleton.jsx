/**
 * Movie List Skeleton Component
 *
 * This component renders a grid of skeleton placeholders while movie data is loading.
 * It provides visual feedback to users that content is coming, maintaining the layout
 * structure and preventing layout shifts when actual content arrives.
 *
 * Key Design Decisions:
 *
 * 1. Configurable Count
 *    - I accept a count prop (default 8) to control how many skeleton cards to show
 *    - 8 is a good default as it fills approximately two rows on desktop
 *    - This gives users a sense of content volume without being overwhelming
 *
 * 2. Responsive Grid Layout
 *    - I use the same Grid configuration as the actual MovieList component
 *    - This ensures the skeleton matches the final layout perfectly
 *    - Breakpoints: xs=12 (1 col), sm=6 (2 cols), md=4 (3 cols), lg=3 (4 cols), xl=2 (6 cols)
 *    - Spacing adapts: xs=2, md=3 for consistent gaps
 *
 * 3. Array Generation
 *    - I use Array.from({ length: count }) to create a placeholder array
 *    - Map over it with index as key since these are temporary elements
 *    - Each item renders a MovieCardSkeleton for consistency
 *
 * 4. Layout Consistency
 *    - By matching the real MovieList layout, I prevent jarring layout shifts
 *    - Users see exactly where content will appear
 *    - This creates a smooth, professional loading experience
 *
 * 5. Delegation Pattern
 *    - I delegate the individual card skeleton rendering to MovieCardSkeleton
 *    - This keeps concerns separated and makes both components reusable
 *    - MovieListSkeleton handles layout, MovieCardSkeleton handles appearance
 *
 * Usage Pattern:
 * - Displayed while React Query is fetching movie data (isPending state)
 * - Replaced with actual MovieList once data is available
 * - Same props structure makes it easy to swap between skeleton and real list
 *
 * @component
 * @example
 * // Show 8 skeleton cards (default)
 * <MovieListSkeleton />
 *
 * @example
 * // Show custom number of skeleton cards
 * <MovieListSkeleton count={12} />
 *
 * @example
 * // Typical usage with loading state
 * {isPending ? <MovieListSkeleton /> : <MovieList movies={movies} />}
 */

import React from "react";
import Grid from "@mui/material/Grid";
import MovieCardSkeleton from "./MovieCardSkeleton";

/**
 * Renders a responsive grid of movie card skeletons for loading states.
 *
 * I create a grid that matches the exact layout of the real MovieList component.
 * This provides users with visual feedback during data loading while maintaining
 * layout stability and preventing content shift when movies load.
 *
 * @param {Object} props - Component props
 * @param {number} [props.count=8] - Number of skeleton cards to display (default: 8)
 * @returns {JSX.Element} A responsive grid of MovieCardSkeleton components
 */
const MovieListSkeleton = ({ count = 8 }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* I create an array of the specified length to map over for skeleton cards */}
      {/* Array.from is more readable than [...Array(count)] for creating placeholder arrays */}
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          {/* I use index as key since these are temporary loading placeholders
              that will be replaced with real movie cards that have proper IDs */}
          <MovieCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieListSkeleton;
