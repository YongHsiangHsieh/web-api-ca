/**
 * Movie Reviews Component
 *
 * This component displays all available reviews for a movie in a structured, tabular format.
 * I designed this as a comprehensive reviews section that handles loading states, empty states,
 * and displays review excerpts with links to read the full content.
 *
 * Key Design Decisions:
 *
 * 1. Table Layout
 *    - I chose a table structure because reviews have multiple distinct pieces of information
 *      (author, content, action) that benefit from columnar organization
 *    - The table provides clear visual separation and is easy to scan
 *    - I use MUI's Table components for consistency with Material Design
 *
 * 2. Review Excerpts
 *    - I truncate review content to 200 characters to keep the table compact
 *    - This gives users enough context to decide if they want to read more
 *    - Full reviews are accessed through a "Read Full Review" button
 *
 * 3. Loading Skeleton
 *    - I provide a detailed skeleton that matches the final table structure
 *    - The skeleton shows 3 placeholder rows to indicate content is loading
 *    - Header skeleton includes the icon and title area for visual continuity
 *
 * 4. Empty State
 *    - I display a centered, friendly message when no reviews are available
 *    - Uses a Paper component to visually separate it from the rest of the page
 *    - This is less jarring than showing an empty table
 *
 * 5. Author Display
 *    - I use Chip components for author names to make them stand out visually
 *    - Chips provide a consistent, badge-like appearance that draws the eye
 *    - The outlined variant keeps them from being too heavy visually
 *
 * 6. Row Hover Effect
 *    - I add a hover background to table rows for better interactivity
 *    - This gives visual feedback and makes the table feel more responsive
 *
 * 7. Review Navigation
 *    - I pass both the review and movie data through React Router's Link state
 *    - This allows the review detail page to have all the context it needs
 *    - I use the getReviewRoute helper to ensure consistent URL structure
 *
 * Data Flow:
 * - Uses React Query to fetch reviews from TMDB API
 * - Handles three states: pending (loading), error, and success
 * - Displays review count in the header for quick reference
 *
 * @component
 * @example
 * // Used in movie detail pages or drawers
 * <MovieReviews movie={movieObject} />
 */

import { useQuery } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link } from "react-router";
import { getMovieReviews } from "../../api/tmdb-api";
import { excerpt } from "../../utils/string";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getReviewRoute } from "../../constants/routes";

/**
 * Renders a comprehensive table of movie reviews with loading and empty states.
 *
 * I fetch the reviews using React Query, which gives me automatic caching and
 * loading state management. The component adapts its display based on whether
 * data is loading, has an error, or has been successfully fetched.
 *
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object containing at minimum id and title
 * @param {number} props.movie.id - Movie ID used to fetch reviews from TMDB
 * @param {string} props.movie.title - Movie title displayed in header and passed to review pages
 * @returns {JSX.Element} A reviews table with header, or loading/error/empty state
 */
export default function MovieReviews({ movie }) {
  // I use React Query to fetch the movie reviews from TMDB API
  // The query key includes the movie ID so reviews are cached separately per movie
  // React Query automatically handles loading, error, and success states
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.REVIEWS(movie.id),
    queryFn: getMovieReviews,
  });

  // While loading, I show a skeleton UI that mirrors the final table structure
  // This gives users a preview of what's coming and maintains layout stability
  if (isPending) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header skeleton with icon and text placeholders */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          {/* Circular skeleton for the icon */}
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ flex: 1 }}>
            {/* I show two text skeletons to match the title and subtitle structure */}
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                {/* I add skeleton placeholders in the header cells to maintain table structure */}
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton variant="text" width={80} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* I render 3 skeleton rows to give an indication of typical content volume */}
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  {/* Rounded skeleton for the author chip */}
                  <TableCell>
                    <Skeleton variant="rounded" width={100} height={32} />
                  </TableCell>
                  {/* Wide text skeleton for the excerpt */}
                  <TableCell>
                    <Skeleton variant="text" width="90%" />
                  </TableCell>
                  {/* Rounded skeleton for the button */}
                  <TableCell align="right">
                    <Skeleton variant="rounded" width={120} height={36} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // If there's an error fetching reviews, I display a centered error message
  // This is more user-friendly than showing nothing or crashing the app
  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        {/* I display the error message in red to clearly indicate something went wrong */}
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  // I extract the reviews array from the data object for easier reference
  const reviews = data.results;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header section with icon, title, and review count */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        {/* I use the RateReview icon to visually represent reviews */}
        <RateReviewIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Reviews
          </Typography>
          {/* I display the review count with proper pluralization for grammatical correctness */}
          <Typography variant="body2" color="text.secondary">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} for{" "}
            {movie.title}
          </Typography>
        </Box>
      </Box>

      {/* I check if there are no reviews and show a friendly empty state message */}
      {reviews.length === 0 ? (
        <Paper
          sx={{ p: 4, textAlign: "center", bgcolor: "background.default" }}
        >
          {/* Empty state message when no reviews are available */}
          <Typography color="text.secondary">
            No reviews available for this movie yet.
          </Typography>
        </Paper>
      ) : (
        // When reviews exist, I render them in a structured table format
        <TableContainer component={Paper} elevation={0}>
          {/* I set a minimum width to prevent the table from becoming too cramped */}
          <Table sx={{ minWidth: 550 }} aria-label="reviews table">
            <TableHead>
              <TableRow>
                {/* I make header cells bold to distinguish them from data cells */}
                <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Excerpt</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* I map over each review to create a table row */}
              {reviews.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    // I add a hover effect to make rows interactive and show they're clickable
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {/* Author cell with Chip component for visual distinction */}
                  <TableCell component="th" scope="row">
                    {/* I use a Chip to make the author name stand out as a distinct entity */}
                    <Chip
                      label={r.author}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  {/* Excerpt cell with truncated review content */}
                  <TableCell>
                    {/* I truncate the content to 200 characters to keep the table compact
                        while still providing enough context about the review */}
                    <Typography variant="body2" color="text.secondary">
                      {excerpt(r.content, 200)}
                    </Typography>
                  </TableCell>
                  {/* Action cell with link to full review */}
                  <TableCell align="right">
                    {/* I use React Router's Link to navigate to the full review page
                        I pass both review and movie data through state so the detail page
                        has all the information it needs without additional API calls */}
                    <Link
                      to={getReviewRoute(r.id)}
                      state={{
                        review: r,
                        movie: movie,
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      {/* I use an outlined button to keep the action subtle but clear */}
                      <Button size="small" variant="outlined">
                        Read Full Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
