import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import img from "../../images/film-poster-placeholder.png";
import { Link } from "react-router";
import { getMovieRoute } from "../../constants/routes";
import { getMoviePosterUrl } from "../../utils/movie";

/**
 * MovieCard Component
 *
 * This component renders a comprehensive movie card displaying key information about a film,
 * including its poster, title, release date, rating, and interactive action buttons. I designed
 * this as the primary movie display component for grid layouts throughout the application.
 *
 * Design Philosophy:
 * I structured the card to show the most important information at a glance while providing
 * interactive elements for deeper engagement. The vertical layout prioritizes the poster image
 * (the most visually recognizable element) while ensuring essential metadata is visible without
 * requiring interaction.
 *
 * Favorite Indicator:
 * I display a prominent "Favorite" chip in the top-right corner when a movie is in the user's
 * favorites list. This visual indicator helps users quickly identify their favorited movies
 * when browsing large collections, providing immediate context about their relationship with
 * each film.
 *
 * Interactive Feedback:
 * I implement a vertical lift animation on hover that raises the card 8px and increases its
 * shadow. This pronounced effect (more than the compact card's 4px) signals that this is a
 * primary content card with more information available.
 *
 * Flexible Actions System:
 * I use a render prop pattern for the action parameter, allowing parent components to inject
 * different action buttons (add to favorites, add to must watch, remove, etc.) based on the
 * context. This makes the card highly reusable across different pages without duplication.
 *
 * Text Overflow Handling:
 * I clamp the movie title to 2 lines with ellipsis truncation and set a minimum height to
 * maintain consistent card heights. This prevents layout shifts when displaying movies with
 * varying title lengths in grid layouts.
 *
 * Image Fallback Strategy:
 * I use a placeholder image when a movie's poster is unavailable, ensuring the UI remains
 * visually consistent even when TMDB data is incomplete. This graceful degradation maintains
 * the card's structure and prevents broken image icons.
 *
 * Responsive Considerations:
 * I adjust button heights across breakpoints (44px on mobile, 36px on desktop) to ensure
 * adequate touch targets on mobile devices while maintaining a more compact appearance on
 * larger screens.
 *
 * Accessibility:
 * I include descriptive aria-labels on interactive elements and ensure proper semantic HTML
 * structure with heading elements for movie titles, making the cards accessible to screen
 * reader users.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object from TMDB API
 * @param {number} props.movie.id - Unique movie identifier
 * @param {string} props.movie.title - Movie title displayed in the header
 * @param {string|null} props.movie.poster_path - Path to movie poster (may be null)
 * @param {string} [props.movie.release_date] - Release date in YYYY-MM-DD format
 * @param {number} [props.movie.vote_average] - Average rating (0-10)
 * @param {Function} props.action - Render prop function that receives the movie object and
 *                                  returns action button components (add to favorites, etc.)
 *
 * @returns {React.ReactElement} A Material-UI Card displaying movie information with actions
 *
 * @example
 * import MovieCard from './components/movieCard';
 * import AddToFavoritesIcon from './components/cardIcons/addToFavorites';
 *
 * <MovieCard
 *   movie={{
 *     id: 550,
 *     title: "Fight Club",
 *     poster_path: "/path/to/poster.jpg",
 *     release_date: "1999-10-15",
 *     vote_average: 8.4
 *   }}
 *   action={(movie) => <AddToFavoritesIcon movie={movie} />}
 * />
 */

/**
 * Renders a full-featured movie card with poster, metadata, favorite indicator, and actions.
 *
 * I access the MoviesContext to check if the current movie is in the user's favorites list,
 * which determines whether to display the favorite chip. The card uses flexbox to ensure
 * content fills the available height and the action buttons stay at the bottom.
 *
 * @function MovieCard
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie data object with metadata
 * @param {Function} props.action - Render prop that returns action button components
 *
 * @returns {React.ReactElement} A Material-UI Card with full movie information and interactions
 */
export default function MovieCard({ movie, action }) {
  // I check if this movie is in the user's favorites to show the indicator chip
  const { favorites } = useContext(MoviesContext);

  const isFavorite = favorites.find((id) => id === movie.id);

  return (
    <Card
      sx={{
        height: "100%", // I fill container height for grid alignment
        display: "flex",
        flexDirection: "column", // I stack content vertically
        position: "relative", // I enable absolute positioning for favorite chip
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)", // I lift card on hover for feedback
          boxShadow: 6, // I increase shadow for depth perception
        },
      }}
    >
      {/* Favorite Indicator - I show this chip only for favorited movies */}
      {isFavorite && (
        <Chip
          icon={<FavoriteIcon />}
          label="Favorite"
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1, // I ensure chip appears above poster
            fontWeight: 600,
          }}
        />
      )}

      {/* Movie Title - I clamp to 2 lines and set min height for consistency */}
      <CardHeader
        title={
          <Typography
            variant="h6"
            component="h3"
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2, // I limit to 2 lines for long titles
              WebkitBoxOrient: "vertical",
              minHeight: "3em", // I set min height to prevent layout shift
            }}
          >
            {movie.title}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      {/* Movie Poster - I use a fixed height for consistent card sizing */}
      <CardMedia
        sx={{
          height: 400, // I set fixed height for uniform card appearance
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        image={getMoviePosterUrl(movie.poster_path) || img} // I fallback to placeholder
        title={movie.title}
      />

      {/* Movie Metadata - I display release date and rating with icons */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {movie.release_date || "N/A"}{" "}
                {/* I show N/A if date is missing */}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarRateIcon fontSize="small" sx={{ color: "custom.rating" }} />
              <Typography variant="body2" fontWeight={600}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}{" "}
                {/* I format rating to 1 decimal */}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Action Buttons - I render custom actions and a "More Info" button */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        {action(movie)}{" "}
        {/* I call the render prop to inject custom action buttons */}
        <Link
          to={getMovieRoute(movie.id)}
          style={{ marginLeft: "auto", textDecoration: "none" }}
        >
          {/* I increase button height on mobile for better touch targets */}
          <Button
            variant="contained"
            size="small"
            aria-label={`View more information about ${movie.title}`}
            sx={{ minHeight: { xs: 44, sm: 36 } }}
          >
            More Info
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
