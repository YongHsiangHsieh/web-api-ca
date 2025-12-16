/**
 * Template Movie Page Component
 *
 * This is a reusable template component that provides a consistent layout for individual
 * movie detail pages. It displays a movie poster gallery in a sidebar and renders children
 * components (like MovieDetails) in the main content area.
 *
 * Key Design Decisions:
 *
 * 1. Template Pattern
 *    - I created this as a reusable layout template for movie detail pages
 *    - The children prop makes it flexible - different pages can pass different content
 *    - Ensures consistent layout across all movie detail views
 *    - Handles the common elements (header, poster gallery) while delegating specifics to children
 *
 * 2. Two-Column Layout
 *    - Left sidebar: Movie poster gallery (xs=12, sm=4, md=3)
 *    - Right content: Children components (xs=12, sm=8, md=9)
 *    - On mobile (xs), it stacks vertically for better viewing
 *    - On tablet/desktop, side-by-side layout utilizes screen space efficiently
 *
 * 3. Sticky Sidebar
 *    - On desktop (md and up), I make the sidebar sticky with position: sticky
 *    - top: 80 keeps it below the fixed AppBar
 *    - maxHeight prevents it from extending beyond viewport
 *    - On mobile, it's relative positioning so it scrolls normally
 *    - This keeps posters visible while scrolling through movie details
 *
 * 4. Image Gallery
 *    - I fetch posters using React Query with the movie ID
 *    - ImageList displays them in a vertical scrollable column
 *    - gap: 12 provides breathing room between posters
 *    - maxHeight with overflow allows internal scrolling
 *    - This lets users browse multiple posters without cluttering the page
 *
 * 5. Hover Effects
 *    - I add subtle scale and shadow effects on poster hover
 *    - transform: scale(1.02) provides gentle zoom
 *    - boxShadow increases from 2 to 4 for depth
 *    - Transitions make the effects smooth and polished
 *
 * 6. Loading Skeleton
 *    - I provide a detailed skeleton that matches the final layout
 *    - Shows 3 rectangular skeletons for posters in sidebar
 *    - Shows text and content skeletons in main area
 *    - Responsive sizing matches the actual layout
 *    - Prevents layout shift when content loads
 *
 * 7. Error Handling
 *    - If image fetching fails, I display a centered error message
 *    - Uses error.message for specific error details
 *    - Red color (error variant) clearly indicates something went wrong
 *
 * 8. Responsive Spacing
 *    - Padding and spacing scale down on mobile (xs: 2, md: 3)
 *    - This maximizes content space on small screens
 *    - Provides comfortable spacing on larger screens
 *
 * 9. Lazy Loading
 *    - I use loading="lazy" on images for better performance
 *    - Images only load as user scrolls to them
 *    - Reduces initial page load time
 *
 * 10. Alt Text
 *     - I provide descriptive alt text for accessibility
 *     - Includes movie title for context
 *     - Helps screen readers and when images fail to load
 *
 * Data Flow:
 * - Receives movie object and children components as props
 * - Fetches poster images using React Query
 * - Renders PageHeader with movie details
 * - Displays poster gallery in sidebar
 * - Renders children in main content area
 *
 * @component
 * @example
 * // Used in MovieDetailsPage
 * <TemplateMoviePage movie={movie}>
 *   <MovieDetails movie={movie} />
 * </TemplateMoviePage>
 *
 * @example
 * // Could be used with different content
 * <TemplateMoviePage movie={movie}>
 *   <CustomMovieContent movie={movie} />
 * </TemplateMoviePage>
 */

import { useQuery } from "@tanstack/react-query";
import PageHeader from "../pageHeader";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import { getMovieImages } from "../../api/tmdb-api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { getMoviePosterUrl } from "../../utils/movie";

/**
 * Renders a two-column layout for movie detail pages with poster gallery and content area.
 *
 * I built this as a flexible template that handles the common layout elements (header,
 * poster gallery) while allowing pages to pass custom content as children. The layout
 * is responsive and includes loading/error states for the image gallery.
 *
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object containing movie details
 * @param {number} props.movie.id - Movie ID used to fetch images
 * @param {string} props.movie.title - Movie title for alt text and display
 * @param {React.ReactNode} props.children - Child components to render in main content area
 * @returns {JSX.Element} A two-column page layout with poster gallery and content area
 */
const TemplateMoviePage = ({ movie, children }) => {
  // I use React Query to fetch movie poster images from TMDB
  // The query key includes the movie ID so images are cached per movie
  const { data, error, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.IMAGES(movie.id),
    queryFn: getMovieImages,
  });

  // While loading, I show a skeleton UI that matches the final layout structure
  if (isPending) {
    return (
      <Box>
        <PageHeader movie={movie} />
        <Grid container spacing={3} sx={{ p: 3 }}>
          {/* Sidebar skeleton for poster gallery */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              {/* Title skeleton */}
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              {/* Three poster skeletons to indicate multiple images */}
              <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={400} />
            </Paper>
          </Grid>
          {/* Main content skeleton */}
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            <Paper elevation={1} sx={{ p: 3 }}>
              {/* Header skeleton */}
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
              {/* Text content skeletons with varying widths for realistic appearance */}
              <Skeleton variant="text" width="100%" height={30} />
              <Skeleton variant="text" width="95%" height={30} />
              <Skeleton variant="text" width="90%" height={30} />
              {/* Large content block skeleton */}
              <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // If there's an error fetching images, I display a centered error message
  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error.message}
        </Typography>
      </Box>
    );
  }

  // I extract the posters array from the data object
  const images = data.posters;

  return (
    <Box>
      {/* Page header with movie title, tagline, and navigation */}
      <PageHeader movie={movie} />

      {/* Main two-column layout */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ p: { xs: 2, md: 3 } }}>
        {/* Left sidebar: Image gallery */}
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              // I make the sidebar sticky on desktop so posters remain visible while scrolling
              // On mobile, it's relative so it scrolls normally with the page
              position: { xs: "relative", md: "sticky" },
              top: { md: 80 }, // Keep it below the fixed AppBar
              // I limit height on desktop to prevent extending beyond viewport
              maxHeight: { xs: "auto", md: "calc(100vh - 100px)" },
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {/* I add a film emoji to make the section title more engaging */}
              🎬 Movie Posters
            </Typography>
            <ImageList
              sx={{
                // I make the image list scrollable with a max height
                maxHeight: "calc(100vh - 180px)",
                overflowY: "auto",
              }}
              cols={1} // Single column for vertical scrolling
              gap={12} // Spacing between images
            >
              {/* I map over each poster image to create an ImageListItem */}
              {images.map((image) => (
                <ImageListItem
                  key={image.file_path}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                    // I add smooth transitions for hover effects
                    transition: "transform 0.2s, box-shadow 0.2s",
                    // I add subtle zoom and shadow increase on hover for interactivity
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <img
                    src={getMoviePosterUrl(image.file_path)}
                    // I provide descriptive alt text for accessibility
                    alt={`${movie.title} poster`}
                    // I use lazy loading to improve performance - images load as user scrolls
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        </Grid>

        {/* Right side: Main content area */}
        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            {/* I render whatever children components are passed in
                This makes the template flexible for different content types */}
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TemplateMoviePage;
