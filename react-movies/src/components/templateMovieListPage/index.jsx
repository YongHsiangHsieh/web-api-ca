/**
 * Movie List Page Template Component
 *
 * This is a reusable template component that provides a complete page layout for displaying
 * movie lists with filtering, sorting, and action capabilities. It's used across multiple
 * pages (Home, Upcoming, Popular, Top Rated, etc.) to ensure consistent UI and behavior.
 *
 * Key Design Decisions:
 *
 * 1. Template Pattern
 *    - I created this as a reusable template to reduce code duplication
 *    - Multiple pages (Upcoming, Popular, Top Rated) use this same structure
 *    - Only the movies data, title, and action prop differ between pages
 *    - This ensures consistent filtering/sorting behavior across the app
 *
 * 2. Multi-Filter System
 *    - Name filter: Text search on movie titles (case-insensitive)
 *    - Genre filter: Filter by specific genre ID (0 = all genres)
 *    - Rating filter: Range slider [min, max] for vote_average
 *    - Year filter: Filter movies released from a specific year onwards
 *    - Sort option: Sort by popularity, rating, release date, or none
 *
 * 3. Filter Chain
 *    - I apply all filters sequentially using .filter() chains
 *    - Each filter is independent and can be combined with others
 *    - Sorting is applied AFTER all filters to only sort visible movies
 *    - This provides powerful filtering without complex state management
 *
 * 4. Name/Title Search
 *    - I convert both the movie title and search term to lowercase
 *    - Use .search() method to find matches anywhere in the title
 *    - Returns -1 if not found, so I check !== -1 to include matches
 *
 * 5. Genre Filtering
 *    - I convert genreFilter to a number for comparison
 *    - If genreId > 0, I check if it's in the movie's genre_ids array
 *    - If genreId is 0 (default), I return true to include all movies
 *
 * 6. Rating Range Filter
 *    - I use vote_average from each movie (default to 0 if missing)
 *    - Check if rating is within the [min, max] range (inclusive)
 *    - Slider provides intuitive range selection
 *
 * 7. Year Filter
 *    - I parse the release_date to extract the year
 *    - Filter shows movies from the selected year to current year
 *    - If no year is selected, I include all movies
 *    - Movies without release dates are excluded when year filter is active
 *
 * 8. Sorting Logic
 *    - I check the sort option and call the appropriate utility function
 *    - Sorting happens after filtering to improve performance
 *    - None option preserves the original order
 *    - Utility functions handle the actual sorting algorithm
 *
 * 9. Centralized State Handler
 *    - handleChange receives a type and value parameter
 *    - This single handler updates the appropriate state based on type
 *    - Simplifies the FilterCard prop interface
 *    - Makes it easy to add new filter types
 *
 * 10. Action Prop Pattern
 *     - The action prop is passed through to MovieList and then to individual cards
 *     - This allows different pages to provide different actions (favorites, must-watch, etc.)
 *     - Makes the template flexible for various use cases
 *
 * Layout Structure:
 * - PageHeader: Shows the page title with navigation
 * - FilterCard: All filter controls in one component
 * - MovieList: Grid of filtered and sorted movie cards
 *
 * @component
 * @example
 * // Used in UpcomingMoviesPage
 * <MovieListPageTemplate
 *   movies={upcomingMovies}
 *   title="Upcoming Movies"
 *   action={(movie) => <AddToMustWatch movie={movie} />}
 * />
 *
 * @example
 * // Used in PopularMoviesPage
 * <MovieListPageTemplate
 *   movies={popularMovies}
 *   title="Popular Movies"
 *   action={(movie) => <AddToFavorites movie={movie} />}
 * />
 */

import React, { useState } from "react";
import PageHeader from "../pageHeader";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import { SORT_OPTIONS } from "../sortMoviesDropdown";
import {
  sortMoviesByPopularity,
  sortMoviesByRating,
  sortMoviesByReleaseDate,
} from "../../utils/movie";

/**
 * Renders a complete movie list page with filtering, sorting, and customizable actions.
 *
 * I built this as a reusable template to provide consistent behavior across different
 * movie list pages. It manages all filter states internally and applies them in a chain
 * to progressively narrow down the displayed movies. Sorting is applied last for efficiency.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.movies - Array of movie objects to display and filter
 * @param {string} props.title - Page title shown in the header
 * @param {Function} props.action - Render prop function for movie card actions
 * @param {Object} props.action.movie - Movie object passed to the action component
 * @returns {JSX.Element} A complete page layout with header, filters, and movie grid
 */
function MovieListPageTemplate({ movies, title, action }) {
  // I maintain separate state for each filter type to allow independent control
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0"); // "0" means all genres
  const [ratingFilter, setRatingFilter] = useState([0, 10]); // Full rating range
  const [yearFilter, setYearFilter] = useState(""); // Empty means all years
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NONE); // No sorting by default

  // I convert genreFilter to a number for comparison with genre_ids
  const genreId = Number(genreFilter);

  // I apply filters in a chain, progressively narrowing down the movie list
  let displayedMovies = movies
    // Name/title filter: case-insensitive search
    .filter((m) => {
      // I search for the filter text anywhere in the movie title
      // Converting both to lowercase makes it case-insensitive
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    // Genre filter: check if movie has the selected genre
    .filter((m) => {
      // If genreId is 0 (all genres), I include all movies
      // Otherwise, I check if the genre is in the movie's genre_ids array
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    })
    // Rating filter: check if rating is within the selected range
    .filter((m) => {
      // I use vote_average, defaulting to 0 if it's missing
      const rating = m.vote_average || 0;
      // I check if rating is between min and max (inclusive)
      return rating >= ratingFilter[0] && rating <= ratingFilter[1];
    })
    // Year filter: check if movie was released in or after the selected year
    .filter((m) => {
      // If no year filter is set, I include all movies
      if (!yearFilter) return true;

      // I extract the year from the release_date string
      const releaseYear = m.release_date
        ? new Date(m.release_date).getFullYear()
        : null;
      const fromYear = Number(yearFilter);
      const currentYear = new Date().getFullYear();

      // I exclude movies without release dates when year filter is active
      if (!releaseYear) return false;
      // I include movies released between the selected year and now
      return releaseYear >= fromYear && releaseYear <= currentYear;
    });

  // I apply sorting after all filters to only sort the visible movies
  // This is more efficient than sorting the full list first
  if (sortOption === SORT_OPTIONS.POPULARITY) {
    displayedMovies = sortMoviesByPopularity(displayedMovies);
  } else if (sortOption === SORT_OPTIONS.RATING) {
    displayedMovies = sortMoviesByRating(displayedMovies);
  } else if (sortOption === SORT_OPTIONS.RELEASE_DATE) {
    displayedMovies = sortMoviesByReleaseDate(displayedMovies);
  }
  // If sortOption is NONE, I leave the array in its original order

  /**
   * Handles changes to any filter or sort control.
   *
   * I use a single handler with a type parameter to update the appropriate state.
   * This simplifies the FilterCard interface and makes it easy to add new filters.
   *
   * @param {string} type - The type of filter being changed (name, genre, rating, year, sort)
   * @param {string|number|Array} value - The new value for the filter
   */
  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "genre") setGenreFilter(value);
    else if (type === "rating") setRatingFilter(value);
    else if (type === "year") setYearFilter(value);
    else if (type === "sort") setSortOption(value);
  };

  return (
    <Grid container>
      {/* Page header with title and navigation buttons */}
      <Grid size={12}>
        <PageHeader title={title} />
      </Grid>

      {/* Filter card with all filtering and sorting controls */}
      <Grid size={12}>
        <FilterCard
          // I pass the handleChange callback so FilterCard can update any filter
          onUserInput={handleChange}
          // I pass all current filter values so FilterCard can display them
          titleFilter={nameFilter}
          genreFilter={genreFilter}
          ratingFilter={ratingFilter}
          yearFilter={yearFilter}
          sortOption={sortOption}
        />
      </Grid>

      {/* Movie grid with filtered and sorted results */}
      <Grid container sx={{ flex: "1 1 500px" }}>
        {/* I pass the action prop through to MovieList so each card can render custom actions */}
        <MovieList action={action} movies={displayedMovies}></MovieList>
      </Grid>
    </Grid>
  );
}

export default MovieListPageTemplate;
