/**
 * Page Header Component
 *
 * This is a unified, flexible header component that serves two distinct purposes:
 * 1. Simple title headers for list pages (Upcoming Movies, Top Rated, etc.)
 * 2. Rich movie detail headers with taglines and homepage links
 *
 * Key Design Decisions:
 *
 * 1. Dual-Purpose Design
 *    - I designed this as a single component that adapts based on the props provided
 *    - If a movie object is passed, it renders a rich detail header
 *    - If only a title string is passed, it renders a simple list page header
 *    - This reduces code duplication and maintains UI consistency
 *
 * 2. Browser Navigation Integration
 *    - I include back/forward buttons that use the browser's navigation history
 *    - This feels natural to users because it matches browser behavior
 *    - Can be disabled with showNavigation prop for special cases
 *
 * 3. External Homepage Link
 *    - For movies with official websites, I show a clickable home icon
 *    - I use target="_blank" to open in a new tab (preserves user's session)
 *    - I include rel="noopener noreferrer" for security best practices
 *
 * 4. Adaptive Styling
 *    - Movie detail headers get a gradient background for visual distinction
 *    - Simple headers use the standard paper background
 *    - Typography sizes adapt based on header type and screen size
 *
 * 5. Responsive Typography
 *    - Titles scale down on mobile (xs breakpoint) to prevent overflow
 *    - Taglines are hidden on extra small screens to save space
 *    - This ensures readability across all device sizes
 *
 * 6. Accessibility Features
 *    - All IconButtons have descriptive aria-labels
 *    - Tooltips provide context for interactive elements
 *    - Minimum touch target sizes (44-48px) for mobile usability
 *    - Semantic HTML with proper heading hierarchy (h1)
 *
 * 7. Visual Hierarchy
 *    - Movie title is prominent with h4/h5 typography
 *    - Tagline is secondary (italic, muted color)
 *    - Navigation buttons are symmetrically positioned at edges
 *    - Center-aligned title creates balanced composition
 *
 * @component
 * @example
 * // Simple list page header
 * <PageHeader title="Upcoming Movies" />
 *
 * @example
 * // Movie detail header with full information
 * <PageHeader
 *   movie={{
 *     title: "Inception",
 *     tagline: "Your mind is the scene of the crime",
 *     homepage: "https://www.inceptionmovie.com"
 *   }}
 * />
 *
 * @example
 * // Header without navigation buttons
 * <PageHeader title="Search Results" showNavigation={false} />
 */

import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";

/**
 * Renders a flexible page header that adapts to different content types.
 *
 * I built this to handle both simple page titles and rich movie detail headers
 * within a single component. The component automatically adapts its appearance
 * and functionality based on which props are provided.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Simple title text for list pages (e.g., "Upcoming Movies")
 * @param {Object} [props.movie] - Movie object for detail pages
 * @param {string} props.movie.title - The movie's title
 * @param {string} [props.movie.homepage] - URL to the movie's official website
 * @param {string} [props.movie.tagline] - The movie's tagline/slogan
 * @param {boolean} [props.showNavigation=true] - Whether to show browser back/forward buttons
 * @returns {JSX.Element} A responsive header with title, optional tagline, and navigation
 */
const PageHeader = ({ title, movie, showNavigation = true }) => {
  // I use React Router's navigate function to handle browser history navigation
  const navigate = useNavigate();

  // I determine which title to display based on whether a movie object was provided
  // This allows the component to work in both simple and detailed header modes
  const displayTitle = movie ? movie.title : title;

  // I track whether we have movie details to conditionally apply movie-specific styling
  const hasMovieDetails = Boolean(movie);

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        // I remove bottom margin for movie details to allow seamless connection with content below
        mb: hasMovieDetails ? 0 : 3,
        // I apply a subtle gradient background for movie headers to distinguish them visually
        // Simple headers get the standard paper background
        background: (theme) =>
          hasMovieDetails
            ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
            : theme.palette.background.paper,
      }}
    >
      {/* I only render navigation buttons if showNavigation is true */}
      {showNavigation && (
        <Tooltip title="Go back">
          <IconButton
            aria-label="Go back to previous page"
            // I navigate backwards in browser history (-1)
            onClick={() => navigate(-1)}
            sx={{
              mr: { xs: 1, md: 2 },
              // I ensure minimum touch target size of 48px for accessibility
              minWidth: 48,
              minHeight: 48,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Main content area with title and optional tagline */}
      <Box sx={{ flexGrow: 1, textAlign: "center" }}>
        <Typography
          // I use larger heading for movie details (h4) vs list pages (h5)
          variant={hasMovieDetails ? "h4" : "h5"}
          component="h1"
          fontWeight={700}
          sx={{
            // I only add bottom margin if there's a tagline to separate from
            mb: hasMovieDetails && movie.tagline ? 1 : 0,
            // I scale down font sizes on mobile to prevent text overflow
            fontSize: {
              xs: hasMovieDetails ? "1.5rem" : "1.25rem",
              md: undefined,
            },
          }}
        >
          {displayTitle}
          {/* I conditionally render the homepage link icon if the movie has an official website */}
          {hasMovieDetails && movie.homepage && (
            <Tooltip title="Visit official homepage">
              <IconButton
                component="a"
                href={movie.homepage}
                target="_blank"
                // I use noopener noreferrer for security when opening external links
                // This prevents the new page from accessing window.opener
                rel="noopener noreferrer"
                aria-label={`Visit ${movie.title} official website`}
                sx={{
                  ml: 1,
                  // I use slightly smaller minimum size (44px) since this is inline with text
                  minWidth: 44,
                  minHeight: 44,
                }}
                size="small"
              >
                <HomeIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>

        {/* I display the movie tagline if available, styled as secondary text */}
        {hasMovieDetails && movie.tagline && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            fontStyle="italic"
            sx={{
              // I scale down tagline font on mobile
              fontSize: { xs: "0.875rem", md: "1rem" },
              // I hide tagline on extra small screens to save vertical space
              display: { xs: "none", sm: "block" },
            }}
          >
            "{movie.tagline}"
          </Typography>
        )}
      </Box>

      {/* Forward navigation button, mirroring the back button */}
      {showNavigation && (
        <Tooltip title="Go forward">
          <IconButton
            aria-label="Go forward to next page"
            // I navigate forward in browser history (+1)
            onClick={() => navigate(+1)}
            sx={{
              ml: { xs: 1, md: 2 },
              minWidth: 48,
              minHeight: 48,
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

export default PageHeader;
