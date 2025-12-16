import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MovieReviews from "../movieReviews";
import { useMovieCredits } from "../../hooks/useMovieCredits";
import { useMovieRecommendations } from "../../hooks/useMovieRecommendations";
import { useMovieSimilar } from "../../hooks/useMovieSimilar";
import CastCard from "../castCard";
import CompactMovieCard from "../compactMovieCard";
import HorizontalScrollContainer from "../horizontalScrollContainer";
import {
  getMovieCredits,
  getMovieRecommendations,
  getMovieSimilar,
} from "../../api/tmdb-api";
import { sortMoviesByPopularity } from "../../utils/movie";

/**
 * MovieDetails Component
 *
 * This component renders comprehensive details about a specific movie, including its overview,
 * cast, genres, production information, statistics, recommendations, and reviews. I designed
 * this as the main content component for the movie details page, organizing all movie-related
 * information into logical, easy-to-scan sections.
 *
 * Content Organization Strategy:
 * I structure the content in order of typical user interest:
 * 1. Overview - The movie's plot summary (most wanted information)
 * 2. Cast - Key actors and their roles (highly relevant for decision-making)
 * 3. Genres & Countries - Classification and origin information
 * 4. Details - Technical specifications (runtime, revenue, ratings, release date)
 * 5. Recommendations & Similar - Discovery features for continued browsing
 * 6. Reviews - Community feedback (accessible via FAB)
 *
 * Data Loading Pattern:
 * I use custom hooks (useMovieCredits, useMovieRecommendations, useMovieSimilar) to fetch
 * related data from TMDB. Each hook provides loading states and skeleton components, ensuring
 * users see meaningful feedback while data loads rather than blank spaces.
 *
 * Popularity Sorting Logic:
 * I sort both recommendations and similar movies by popularity to prioritize the most
 * well-known films first. This matches the pattern I use for actor filmographies, creating
 * a consistent user experience across the application.
 *
 * Content Limiting Strategy:
 * I limit cast, recommendations, and similar movies to 10 items each. This prevents UI
 * overwhelm while still providing sufficient options for exploration. Users can view full
 * cast lists or more recommendations by navigating to dedicated pages if implemented.
 *
 * Reviews Drawer Design:
 * I implement reviews in a slide-down drawer rather than inline content because reviews can
 * be lengthy and numerous. The drawer keeps the main page focused while making reviews easily
 * accessible via a prominent FAB (Floating Action Button) in the bottom-right corner.
 *
 * Responsive Considerations:
 * I use horizontal scrolling containers for cast and movie lists, which work well on both
 * mobile (touch swipe) and desktop (mouse wheel). This approach avoids complex grid layouts
 * that would require different configurations for various screen sizes.
 *
 * Conditional Rendering:
 * I display the production countries section only when data is available, keeping the UI
 * clean and avoiding empty sections. I also provide fallback messages when cast, recommendations,
 * or similar movies are unavailable.
 *
 * Visual Hierarchy:
 * I use dividers between major sections to create visual separation and help users quickly
 * navigate through the content. Section headings use emojis (🎭, 💡, 🎬) to add personality
 * and improve scannability.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The complete movie object from TMDB API
 * @param {number} props.movie.id - Movie identifier used to fetch related data
 * @param {string} props.movie.overview - Movie plot summary/description
 * @param {Array<Object>} props.movie.genres - Array of genre objects with name properties
 * @param {Array<Object>} [props.movie.production_countries] - Array of country objects
 * @param {number} props.movie.runtime - Movie duration in minutes
 * @param {number} props.movie.revenue - Total box office revenue
 * @param {number} props.movie.vote_average - Average rating (0-10)
 * @param {number} props.movie.vote_count - Number of votes/ratings
 * @param {string} props.movie.release_date - Release date in YYYY-MM-DD format
 *
 * @returns {React.ReactElement} A comprehensive movie details page with multiple sections
 *
 * @example
 * import MovieDetails from './components/movieDetails';
 *
 * <MovieDetails
 *   movie={{
 *     id: 550,
 *     overview: "A ticking-time-bomb insomniac...",
 *     genres: [{ id: 18, name: "Drama" }],
 *     production_countries: [{ iso_3166_1: "US", name: "United States" }],
 *     runtime: 139,
 *     revenue: 100853753,
 *     vote_average: 8.4,
 *     vote_count: 26280,
 *     release_date: "1999-10-15"
 *   }}
 * />
 */

/**
 * Renders the complete movie details page with all related information and data.
 *
 * I use multiple custom hooks to fetch related data (cast, recommendations, similar movies)
 * in parallel, which improves performance. Each hook manages its own loading state and
 * provides skeleton components for smooth loading experiences.
 *
 * @function MovieDetails
 * @param {Object} props - Component props
 * @param {Object} props.movie - Complete movie data object from TMDB
 *
 * @returns {React.ReactElement} A comprehensive movie details layout with multiple sections
 */
const MovieDetails = ({ movie }) => {
  // I manage drawer state locally since it's specific to this component
  const [drawerOpen, setDrawerOpen] = useState(false);

  // I fetch cast data using a custom hook that handles loading and error states
  const {
    cast,
    isLoading: castLoading,
    MovieCreditsState,
  } = useMovieCredits(movie.id, getMovieCredits);

  // I fetch recommendations using TMDB's algorithm-based suggestions
  const {
    movies: recommendations,
    isLoading: recommendationsLoading,
    RecommendationsState,
  } = useMovieRecommendations(movie.id, getMovieRecommendations);

  // I fetch similar movies based on genre, theme, and other characteristics
  const {
    movies: similar,
    isLoading: similarLoading,
    SimilarMoviesState,
  } = useMovieSimilar(movie.id, getMovieSimilar);

  // I sort by popularity to show most well-known films first (consistent with actor pages)
  const sortedRecommendations = sortMoviesByPopularity(recommendations);
  const sortedSimilar = sortMoviesByPopularity(similar);

  return (
    <Box>
      {/* Overview Section - I display the plot summary first as it's typically most sought after */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          Overview
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {movie.overview}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Cast Section - I show top 10 cast members in a horizontal scrolling list */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          🎭 Cast
        </Typography>

        {castLoading ? (
          <MovieCreditsState />
        ) : cast.length > 0 ? (
          <HorizontalScrollContainer>
            {/* I limit to 10 actors to prevent UI overwhelm */}
            {cast.slice(0, 10).map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </HorizontalScrollContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No cast information available
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Genres Section - I display genre chips for quick categorization */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Genres
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {movie.genres.map((g) => (
            <Chip
              key={g.name}
              label={g.name}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Production Countries - I only show this section if data exists */}
      {movie.production_countries?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <PublicIcon
              sx={{ fontSize: 20, mr: 1, verticalAlign: "text-bottom" }}
            />
            Production Countries
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {movie.production_countries.map((country) => (
              <Chip
                key={country.iso_3166_1 ?? country.name}
                label={country.name}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Movie Stats - I display key metadata with icons for visual clarity */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Details
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
          <Stack spacing={2}>
            {/* Runtime */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon color="action" />
              <Typography variant="body2" fontWeight={500}>
                Runtime:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.runtime} minutes
              </Typography>
            </Box>

            {/* Revenue - I format large numbers with locale-specific separators */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MonetizationIcon sx={{ color: "custom.revenue" }} />
              <Typography variant="body2" fontWeight={500}>
                Revenue:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${movie.revenue.toLocaleString()}
              </Typography>
            </Box>

            {/* Rating - I show both average and vote count for context */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarRate sx={{ color: "custom.rating" }} />
              <Typography variant="body2" fontWeight={500}>
                Rating:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.vote_average.toFixed(1)} (
                {movie.vote_count.toLocaleString()} votes)
              </Typography>
            </Box>

            {/* Release Date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon color="action" />
              <Typography variant="body2" fontWeight={500}>
                Release Date:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.release_date}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Recommendations Section - I show TMDB's algorithmic recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          💡 You Might Also Like
        </Typography>

        {recommendationsLoading ? (
          <RecommendationsState />
        ) : recommendations.length > 0 ? (
          <HorizontalScrollContainer>
            {/* I limit to 10 recommendations to keep the section focused */}
            {sortedRecommendations.slice(0, 10).map((recommendedMovie) => (
              <CompactMovieCard
                key={recommendedMovie.id}
                movie={recommendedMovie}
              />
            ))}
          </HorizontalScrollContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No recommendations available
          </Typography>
        )}
      </Box>

      {/* Similar Movies Section - I show genre/theme-based similar films */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          🎬 Similar Movies
        </Typography>

        {similarLoading ? (
          <SimilarMoviesState />
        ) : similar.length > 0 ? (
          <HorizontalScrollContainer>
            {/* I limit to 10 similar movies to maintain performance */}
            {sortedSimilar.slice(0, 10).map((similarMovie) => (
              <CompactMovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </HorizontalScrollContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No similar movies found
          </Typography>
        )}
      </Box>

      {/* Reviews FAB - I use a floating button for easy access without cluttering the page */}
      <Fab
        color="primary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          textTransform: "none",
        }}
      >
        <RateReviewIcon sx={{ mr: 1 }} />
        Reviews
      </Fab>

      {/* Reviews Drawer - I display reviews in a drawer to keep the main content focused */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            maxHeight: "80vh", // I limit height to keep close button accessible
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
        }}
      >
        <MovieReviews movie={movie} />
      </Drawer>
    </Box>
  );
};

export default MovieDetails;
