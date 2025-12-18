/**
 * Movie Card Skeleton Component
 *
 * This component renders a skeleton placeholder that matches the structure and dimensions
 * of a real MovieCard. It's displayed while movie data is loading to provide visual
 * feedback and maintain layout stability.
 *
 * Key Design Decisions:
 *
 * 1. Structure Matching
 *    - I replicate the exact structure of the real MovieCard component
 *    - Includes CardHeader (title), poster area, CardContent (metadata), and CardActions (buttons)
 *    - This ensures the skeleton looks like it's actually loading the real content
 *
 * 2. Skeleton Variants
 *    - Text variant: For title and text labels (animated shimmer effect)
 *    - Rectangular variant: For the poster image (400px height matches real posters)
 *    - Circular variant: For icon placeholders (rating stars, action icons)
 *    - Rounded variant: For button placeholders
 *    - Each variant type provides the appropriate visual hint for what's loading
 *
 * 3. Dimensions and Spacing
 *    - Title: 80% width to look like realistic text length
 *    - Poster: 400px height matches the real movie poster dimensions
 *    - Icons: 20px circles for small icons, 40px for action buttons
 *    - I use the same padding and spacing as the real card for perfect alignment
 *
 * 4. Metadata Section
 *    - I show two Grid items (matching rating and genres layout)
 *    - Each has a circular icon placeholder + text placeholder
 *    - This mirrors the visual structure of the real metadata display
 *
 * 5. Action Buttons
 *    - Two circular skeletons for icon buttons (favorites, must-watch)
 *    - One rounded rectangle for the "More Info" button on the right
 *    - marginLeft: auto pushes the button to the right, matching real layout
 *
 * 6. Visual Polish
 *    - bgcolor: "action.hover" for the poster gives it a distinct appearance
 *    - Consistent gaps and spacing match the real card
 *    - flexGrow: 1 on content ensures proper vertical stretching
 *
 * 7. No Props Needed
 *    - This is a pure presentational component with no configuration
 *    - All movie cards look the same while loading
 *    - Simplifies usage - just drop it in wherever a loading card is needed
 *
 * Layout Flow:
 * - Header (title skeleton)
 * - Poster (large rectangular skeleton)
 * - Content (two metadata items with icon + text)
 * - Actions (two icon buttons + one text button)
 *
 * @component
 * @example
 * // Used within MovieListSkeleton or standalone
 * <MovieCardSkeleton />
 *
 * @example
 * // Typical usage with loading state
 * {isPending ? <MovieCardSkeleton /> : <MovieCard movie={movie} />}
 */

import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

/**
 * Renders a skeleton placeholder that mimics the MovieCard component structure.
 *
 * I built this to match the exact layout of a real MovieCard so users get an
 * accurate preview of what's loading. The skeleton includes placeholders for
 * the title, poster image, metadata (rating, genres), and action buttons.
 *
 * @returns {JSX.Element} A Card with skeleton placeholders matching MovieCard layout
 */
const MovieCardSkeleton = () => {
  return (
    <Card
      sx={{
        // I use full height and flexbox to match the real card's stretching behavior
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title skeleton in the header */}
      <CardHeader
        title={
          // I make the title 80% width to look like realistic text length
          // 32px height matches the actual title typography
          <Skeleton variant="text" width="80%" height={32} />
        }
        sx={{ pb: 1 }}
      />

      {/* Poster image skeleton - large rectangular area */}
      <Skeleton
        variant="rectangular"
        // I use 400px height to match the real movie poster dimensions
        height={400}
        // I use action.hover background color to distinguish it from other skeletons
        sx={{ bgcolor: "action.hover" }}
      />

      {/* Metadata section skeleton */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        {/* I use the same Grid layout as the real card (2 columns) */}
        <Grid container spacing={2}>
          {/* Left metadata item (rating) */}
          <Grid size={{ xs: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* Small circular skeleton for the icon (star, calendar, etc.) */}
              <Skeleton variant="circular" width={20} height={20} />
              {/* Text skeleton for the label */}
              <Skeleton variant="text" width={80} />
            </Box>
          </Grid>
          {/* Right metadata item (genre/other info) */}
          <Grid size={{ xs: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Skeleton variant="circular" width={20} height={20} />
              {/* Shorter text for variety */}
              <Skeleton variant="text" width={40} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Action buttons skeleton */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        {/* Two circular skeletons for icon buttons (favorites, must-watch) */}
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        {/* "More Info" button skeleton pushed to the right */}
        <Box sx={{ marginLeft: "auto" }}>
          {/* Rounded rectangle for button with typical button dimensions */}
          <Skeleton variant="rounded" width={100} height={36} />
        </Box>
      </CardActions>
    </Card>
  );
};

export default MovieCardSkeleton;
