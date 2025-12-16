import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid";

/**
 * MovieList Component
 *
 * This component renders a responsive grid layout of movie cards. I designed this as a
 * presentation component that takes an array of movies and transforms them into a Material-UI
 * Grid layout that adapts beautifully across all screen sizes.
 *
 * Responsive Grid Strategy:
 * I implement a sophisticated responsive grid that adjusts the number of columns based on
 * viewport width:
 * - xs (mobile): 1 column (full width) - Optimized for small screens
 * - sm (tablet portrait): 2 columns - Good balance for medium screens
 * - md (tablet landscape): 3 columns - Efficient use of wider screens
 * - lg (desktop): 4 columns - Standard desktop grid layout
 * - xl (large desktop): 6 columns - Maximizes space on ultra-wide displays
 *
 * This progressive enhancement ensures users on any device get an optimal viewing experience
 * without horizontal scrolling or awkward gaps.
 *
 * Spacing System:
 * I use responsive padding (2 on mobile, 2.5 on desktop) to create breathing room between
 * cards. This padding scales with screen size to maintain visual balance - tighter spacing
 * on mobile conserves screen real estate, while more generous spacing on desktop creates
 * a premium feel.
 *
 * Action Prop Pattern:
 * I pass through the action prop to each MovieCard component, following the render prop
 * pattern. This makes the MovieList flexible and reusable - different pages can inject
 * different action buttons (add to favorites, add to must watch, remove, etc.) without
 * modifying this component.
 *
 * Performance Considerations:
 * I use the movie ID as the key for each Grid item to help React efficiently update the
 * DOM when the movie list changes (filtering, sorting, pagination). This prevents
 * unnecessary re-renders of unchanged cards.
 *
 * Why Return an Array:
 * I return an array of Grid items rather than wrapping them in a container. This gives
 * parent components full control over the grid container configuration (spacing, alignment,
 * etc.), making the component more flexible and composable.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.movies - Array of movie objects to display
 * @param {number} props.movies[].id - Unique identifier for each movie (used as React key)
 * @param {Function} props.action - Render prop function passed to each MovieCard for
 *                                  rendering action buttons. Receives the movie object
 *                                  and returns React elements.
 *
 * @returns {Array<React.ReactElement>} An array of Grid items, each containing a MovieCard
 *
 * @example
 * import MovieList from './components/movieList';
 * import AddToFavoritesIcon from './components/cardIcons/addToFavorites';
 *
 * <Grid container>
 *   <MovieList
 *     movies={[
 *       { id: 550, title: "Fight Club", ... },
 *       { id: 680, title: "Pulp Fiction", ... }
 *     ]}
 *     action={(movie) => <AddToFavoritesIcon movie={movie} />}
 *   />
 * </Grid>
 */

/**
 * Renders a responsive grid of movie cards.
 *
 * I map over the movies array and wrap each movie in a Grid item with responsive sizing.
 * The Grid component automatically handles the layout calculations, adjusting columns
 * based on viewport width to create an optimal viewing experience.
 *
 * @function MovieList
 * @param {Object} props - Component props
 * @param {Array<Object>} props.movies - Movies to display in the grid
 * @param {Function} props.action - Action render prop passed to each MovieCard
 *
 * @returns {Array<React.ReactElement>} Array of Grid items containing MovieCard components
 */
const MovieList = (props) => {
  // I map each movie to a responsive Grid item containing a MovieCard
  let movieCards = props.movies.map((m) => (
    <Grid
      key={m.id} // I use movie ID as key for React reconciliation
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} // I define responsive column widths (12-column grid)
      sx={{ p: { xs: 2, md: 2.5 } }} // I add responsive padding for spacing
    >
      <Movie key={m.id} movie={m} action={props.action} />
    </Grid>
  ));

  // I return the array of Grid items for parent to wrap in Grid container
  return movieCards;
};

export default MovieList;
