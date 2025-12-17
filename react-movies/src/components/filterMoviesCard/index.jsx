import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useNavigate } from "react-router";
import { getSearchRoute } from "../../constants/routes";
import SortMoviesDropdown from "../sortMoviesDropdown";

/**
 * FilterMoviesCard Component
 *
 * This component provides a comprehensive filtering and search interface for movie discovery.
 * I designed this as a unified control panel that combines multiple filtering mechanisms
 * (title, genre, rating, year) with a dedicated search feature and sorting options.
 *
 * Two-Tier Layout Design:
 * I organize the interface into two distinct rows:
 * 1. Search Bar Row - Dedicated search with submit button for global movie/actor search
 * 2. Filter Controls Row - Multiple filter inputs for refining the current movie list
 *
 * This separation helps users understand the difference between searching (navigating to
 * search results) and filtering (refining the current page's movies).
 *
 * Data Loading Strategy:
 * I use React Query to fetch the genres list from TMDB. While loading, I display skeleton
 * placeholders that match the final layout, creating a smooth loading experience without
 * content shifts. If the fetch fails, I show an error message instead of broken controls.
 *
 * Genre Handling Logic:
 * I inject an "All" option at the beginning of the genres list if it doesn't exist. This
 * gives users an easy way to clear genre filtering and view all movies without having to
 * remember which genre they selected.
 *
 * Search vs Filter Distinction:
 * - Search: Submits a form and navigates to a search results page (different route)
 * - Filters: Calls onUserInput callback to update parent component state (same route)
 *
 * This distinction is important because search is a broader query across all movies/actors,
 * while filters refine what's already displayed on the current page.
 *
 * Responsive Design:
 * I use Material-UI's responsive breakpoints to stack filter controls vertically on mobile
 * devices and display them horizontally on larger screens, ensuring usability across all
 * device sizes.
 *
 * Accessibility:
 * I include aria-labels on all input fields and ensure keyboard navigation works properly
 * throughout the form, making the interface accessible to screen reader users.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.titleFilter - Current title filter value (controlled input)
 * @param {string|number} props.genreFilter - Current selected genre ID
 * @param {Array<number>} [props.ratingFilter] - Current rating range [min, max], defaults to [0, 10]
 * @param {string|number} [props.yearFilter] - Current year filter (movies from this year onward)
 * @param {string} props.sortOption - Current sort option value
 * @param {Function} props.onUserInput - Callback function when any filter changes.
 *                                       Called with (type, value) where type is 'name',
 *                                       'genre', 'rating', 'year', or 'sort'
 *
 * @returns {React.ReactElement} A Paper component containing search bar and filter controls
 *
 * @example
 * import FilterMoviesCard from './components/filterMoviesCard';
 *
 * <FilterMoviesCard
 *   titleFilter=""
 *   genreFilter="0"
 *   ratingFilter={[0, 10]}
 *   yearFilter=""
 *   sortOption="popularity.desc"
 *   onUserInput={(type, value) => {
 *     // Handle filter changes
 *   }}
 * />
 */

/**
 * Renders a comprehensive movie filtering and search interface.
 *
 * I use React Query to fetch genres from TMDB API with automatic caching and error handling.
 * The component handles three states: loading (skeletons), error (message), and success
 * (full interface). This ensures users always see meaningful feedback about the data state.
 *
 * @function FilterMoviesCard
 * @param {Object} props - Component props containing current filter values and change handler
 * @returns {React.ReactElement} A Paper component with search and filter controls, or loading/error states
 */
export default function FilterMoviesCard(props) {
  const navigate = useNavigate();

  // I fetch genres using React Query for caching and automatic refetching
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.GENRES,
    queryFn: getGenres,
  });

  // Loading State - I show skeleton placeholders that match the final layout
  if (isPending) {
    return (
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
        {/* Search bar skeleton - I match the search bar's layout */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" height={40} sx={{ flex: 1 }} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
        {/* Filter controls skeleton - I create placeholders for all filter inputs */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={220} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
      </Paper>
    );
  }

  // Error State - I display the error message in a user-friendly format
  if (isError) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
        <Typography color="error">{error.message}</Typography>
      </Paper>
    );
  }

  // I ensure the "All" option exists at the beginning of the genres list
  const genres = data.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  /**
   * Generic handler for filter changes.
   * I use this to standardize how all filter inputs communicate with the parent component.
   *
   * @function handleChange
   * @param {Event} e - The change event
   * @param {string} type - The type of filter being changed ('name', 'genre', 'rating', 'year', 'sort')
   * @param {*} value - The new value for the filter
   */
  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value);
  };

  /**
   * Handles title filter text input changes.
   * I extract the value from the event and pass it to the generic handler.
   *
   * @function handleTextChange
   * @param {Event} e - The input change event
   */
  const handleTextChange = (e) => {
    handleChange(e, "name", e.target.value);
  };

  /**
   * Handles genre dropdown selection changes.
   * I extract the selected genre ID and pass it to the generic handler.
   *
   * @function handleGenreChange
   * @param {Event} e - The select change event
   */
  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  /**
   * Handles search form submission.
   * I navigate to the search results page rather than filtering the current page,
   * because search is a broader query that should show dedicated results.
   *
   * @function handleSearchSubmit
   * @param {Event} e - The form submit event
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query?.trim()) {
      navigate(getSearchRoute(query.trim()));
    }
  };

  /**
   * Handles sort option changes from the dropdown.
   * I pass the value directly since the SortMoviesDropdown already manages its own state.
   *
   * @function handleSortChange
   * @param {string} value - The new sort option value
   */
  const handleSortChange = (value) => {
    props.onUserInput("sort", value);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Search Bar Row - I separate this from filters because it navigates to a different page */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          name="search"
          placeholder="Search movies or actors..."
          type="search"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{
            "aria-label": "Search movies or actors",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ minWidth: 100, textTransform: "none" }}
        >
          Search
        </Button>
      </Box>

      {/* Filter Controls Row - I group all filters together for easy access */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // I stack on mobile, horizontal on desktop
          gap: 2,
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        {/* Title Filter - I let users filter by movie title as they type */}
        <TextField
          sx={{ flex: 1 }}
          id="filter-movies"
          label="Filter by title"
          type="search"
          size="small"
          value={props.titleFilter}
          onChange={handleTextChange}
          inputProps={{
            "aria-label": "Filter movies by title",
          }}
        />

        {/* Genre Filter - I provide a dropdown of all available genres */}
        <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
          <InputLabel id="genre-label">Genre</InputLabel>
          <Select
            labelId="genre-label"
            id="genre-select"
            value={props.genreFilter}
            onChange={handleGenreChange}
            label="Genre"
            inputProps={{
              "aria-label": "Filter movies by genre",
            }}
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rating Filter - I use a slider for intuitive range selection */}
        <Box sx={{ flex: 1, minWidth: 220, px: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            gutterBottom
            sx={{ display: "block", mb: 0.5 }}
          >
            Rating:{" "}
            {props.ratingFilter
              ? `${props.ratingFilter[0]} - ${props.ratingFilter[1]}`
              : "0 - 10"}
          </Typography>
          <Slider
            value={props.ratingFilter || [0, 10]}
            onChange={(e, newValue) => handleChange(e, "rating", newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.5}
            marks={[
              { value: 0, label: "0" },
              { value: 5, label: "5" },
              { value: 10, label: "10" },
            ]}
            aria-label="Rating range filter"
            sx={{
              mt: 1,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
              },
              "& .MuiSlider-mark": {
                height: 8,
              },
            }}
          />
        </Box>

        {/* Year Filter - I allow filtering from a specific year to present */}
        <TextField
          sx={{ flex: 1, minWidth: 120 }}
          label="Year From"
          type="number"
          size="small"
          value={props.yearFilter || ""}
          onChange={(e) => handleChange(e, "year", e.target.value)}
          placeholder={new Date().getFullYear().toString()}
          inputProps={{
            min: 1900,
            max: new Date().getFullYear(),
            "aria-label": "Filter movies from this year to present",
          }}
        />

        {/* Sort Dropdown - I delegate sorting UI to a specialized component */}
        <SortMoviesDropdown
          sortOption={props.sortOption}
          onSortChange={handleSortChange}
        />
      </Box>
    </Paper>
  );
}
