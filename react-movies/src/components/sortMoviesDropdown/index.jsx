/**
 * Sort Movies Dropdown Component
 *
 * This component provides a dropdown selector for sorting movie lists by various criteria.
 * It's a controlled component that receives the current sort option and notifies the parent
 * when the user changes the selection.
 *
 * Key Design Decisions:
 *
 * 1. Exported Sort Options
 *    - I export SORT_OPTIONS as a constant to ensure consistency across the app
 *    - This prevents typos and makes it easy to add/modify sort options
 *    - Parent components can import these values instead of using magic strings
 *    - The object keys are descriptive, while values are camelCase for data handling
 *
 * 2. Controlled Component Pattern
 *    - I receive sortOption as a prop (current selected value)
 *    - I call onSortChange when the user makes a selection
 *    - This gives the parent full control over the sorting state
 *    - Follows React best practices for form controls
 *
 * 3. Available Sort Options
 *    - None: Shows movies in their original order (no sorting applied)
 *    - Popularity: Sorts by popularity score (most popular first)
 *    - Rating: Sorts by rating score (highest rated first)
 *    - Release Date: Sorts by release date (newest first)
 *
 * 4. Responsive Sizing
 *    - flex: 1 allows the dropdown to grow within its container
 *    - minWidth: 120 ensures the label and text remain readable
 *    - size="small" keeps the dropdown compact for filter bars
 *
 * 5. Accessibility
 *    - InputLabel with labelId connects the label to the select
 *    - aria-label provides additional context for screen readers
 *    - label prop ensures proper Material-UI label positioning
 *
 * 6. Simplicity
 *    - I keep this as a presentation component focused solely on display
 *    - The actual sorting logic lives in the parent component
 *    - This makes the component reusable and easy to test
 *
 * Usage Flow:
 * - Parent passes current sortOption and onSortChange callback
 * - User selects a new option from dropdown
 * - handleChange calls onSortChange with new value
 * - Parent updates state and re-sorts the movie list
 *
 * @module components/sortMoviesDropdown
 * @example
 * // Basic usage in a filter card
 * <SortMoviesDropdown
 *   sortOption={sortOption}
 *   onSortChange={setSortOption}
 * />
 *
 * @example
 * // Using the exported SORT_OPTIONS constant
 * import SortMoviesDropdown, { SORT_OPTIONS } from './components/sortMoviesDropdown';
 *
 * const [sortOption, setSortOption] = useState(SORT_OPTIONS.NONE);
 * <SortMoviesDropdown sortOption={sortOption} onSortChange={setSortOption} />
 */

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/**
 * Sort option constants for movie list sorting.
 *
 * I define these as a constant object so they can be imported and used
 * throughout the application for consistent sort option values. This prevents
 * typos and makes the codebase more maintainable.
 *
 * @constant
 * @type {Object}
 * @property {string} NONE - No sorting applied (original order)
 * @property {string} POPULARITY - Sort by popularity score
 * @property {string} RATING - Sort by rating score
 * @property {string} RELEASE_DATE - Sort by release date
 */
export const SORT_OPTIONS = {
  NONE: "none",
  POPULARITY: "popularity",
  RATING: "rating",
  RELEASE_DATE: "releaseDate",
};

/**
 * Renders a dropdown select for sorting movies by different criteria.
 *
 * I built this as a controlled component that displays the current sort option
 * and notifies the parent when the user selects a different option. The parent
 * component handles the actual sorting logic and state management.
 *
 * @param {Object} props - Component props
 * @param {string} props.sortOption - Current selected sort option (should match SORT_OPTIONS values)
 * @param {Function} props.onSortChange - Callback function called when sort option changes
 * @param {string} props.onSortChange.newValue - The newly selected sort option value
 * @returns {JSX.Element} A FormControl with Select dropdown for sort options
 */
export default function SortMoviesDropdown({ sortOption, onSortChange }) {
  /**
   * Handles sort option changes.
   *
   * I extract the new value from the event and pass it to the parent's
   * onSortChange callback. This keeps the component simple and delegates
   * state management to the parent.
   *
   * @param {Event} e - Change event from the Select component
   */
  const handleChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <FormControl
      sx={{
        // I allow the control to grow within flex containers
        flex: 1,
        // I set a minimum width to keep the label readable
        minWidth: 120,
      }}
      size="small"
    >
      {/* Label connected to the select via labelId */}
      <InputLabel id="sort-label">Sort By</InputLabel>
      <Select
        labelId="sort-label"
        id="sort-select"
        // I display the current sort option from props
        value={sortOption}
        // I call the handler when the user selects a different option
        onChange={handleChange}
        // I provide the label for proper Material-UI positioning
        label="Sort By"
        inputProps={{
          "aria-label": "Sort movies",
        }}
      >
        {/* I provide all available sort options as menu items */}
        {/* Each MenuItem's value corresponds to SORT_OPTIONS constants */}
        <MenuItem value={SORT_OPTIONS.NONE}>None</MenuItem>
        <MenuItem value={SORT_OPTIONS.POPULARITY}>Popularity</MenuItem>
        <MenuItem value={SORT_OPTIONS.RATING}>Rating</MenuItem>
        <MenuItem value={SORT_OPTIONS.RELEASE_DATE}>Release Date</MenuItem>
      </Select>
    </FormControl>
  );
}
