import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarRate from "@mui/icons-material/StarRate";
import { Link } from "react-router";
import { getMovieRoute } from "../../constants/routes";
import { getMoviePosterUrl } from "../../utils/movie";
import img from "../../images/film-poster-placeholder.png";

/**
 * CompactMovieCard Component
 *
 * This component renders a streamlined, space-efficient movie card optimized for horizontal
 * scrolling displays. I designed this as a simplified version of the main MovieCard component,
 * specifically for use in recommendation lists, similar movies sections, and actor filmographies
 * where screen real estate is limited.
 *
 * Design Philosophy:
 * I created this compact variant to balance information density with usability. The card shows
 * only the essential information (poster, title, rating) to help users make quick decisions
 * about which movies to explore further, without overwhelming them with details.
 *
 * Size Optimization:
 * I set a fixed width of 150px to ensure consistent card sizing in horizontal scrolling
 * containers. This width provides enough space for poster visibility while allowing multiple
 * cards to be visible simultaneously, encouraging horizontal exploration.
 *
 * Image Handling:
 * I implement a fallback mechanism using a placeholder image when a movie's poster is unavailable.
 * This ensures the UI remains visually consistent even when TMDB data is incomplete.
 *
 * Text Overflow Strategy:
 * I use CSS line clamping to limit movie titles to 2 lines with ellipsis truncation. I also
 * set a minimum height to ensure all cards maintain uniform dimensions regardless of title
 * length, which creates a cleaner, more professional appearance in scrolling lists.
 *
 * Interactive Feedback:
 * I implement a vertical lift animation on hover (translateY) rather than scaling, which I find
 * works better in compact horizontal layouts where scaling might cause overlap with adjacent cards.
 *
 * Accessibility:
 * I wrap the entire card in a Link component, making it fully clickable. This creates a larger
 * interaction target, which is beneficial for users with motor impairments or touch screen devices.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object from TMDB API
 * @param {number} props.movie.id - Unique movie identifier used for navigation routing
 * @param {string} props.movie.title - Movie title displayed below the poster
 * @param {string|null} props.movie.poster_path - Path to movie poster image (may be null)
 * @param {number} props.movie.vote_average - Average rating score (0-10) from TMDB
 *
 * @returns {React.ReactElement} A compact, clickable movie card optimized for horizontal scrolling
 *
 * @example
 * import CompactMovieCard from './components/compactMovieCard';
 *
 * <CompactMovieCard
 *   movie={{
 *     id: 550,
 *     title: "Fight Club",
 *     poster_path: "/path/to/poster.jpg",
 *     vote_average: 8.4
 *   }}
 * />
 */
/**
 * Renders a compact movie card with poster, title, and rating information.
 *
 * I wrap the entire card in a Link component to enable navigation to the movie details page.
 * The Link styling includes flexShrink: 0 to prevent the card from collapsing in flex
 * containers, which is essential for maintaining consistent card sizes in horizontal scrolling.
 *
 * @function CompactMovieCard
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie data object
 * @param {number} props.movie.id - Used to generate the route to the movie's detail page
 * @param {string} props.movie.title - Displayed below the poster with 2-line clamping
 * @param {string|null} props.movie.poster_path - Used to fetch poster URL, falls back to placeholder
 * @param {number} props.movie.vote_average - Displayed with star icon, formatted to 1 decimal place
 *
 * @returns {React.ReactElement} A Material-UI Card wrapped in a React Router Link
 */
const CompactMovieCard = ({ movie }) => {
  return (
    <Link
      to={getMovieRoute(movie.id)}
      style={{
        textDecoration: "none",
        minWidth: 150, // I ensure minimum width for layout consistency
        flexShrink: 0, // I prevent card from shrinking in flex containers
      }}
    >
      <Card
        sx={{
          width: 150, // I fix the width for uniform card sizing
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)", // I lift the card upward for hover feedback
            boxShadow: 4, // I increase shadow for depth perception
          },
        }}
      >
        {/* Movie Poster - I use the full height for maximum poster visibility */}
        <CardMedia
          component="img"
          height="225"
          image={getMoviePosterUrl(movie.poster_path) || img} // I fallback to placeholder if no poster
          alt={movie.title}
          sx={{
            objectFit: "cover", // I ensure poster fills the space without distortion
          }}
        />
        {/* Movie Information - I show only essential details (title and rating) */}
        <CardContent sx={{ p: 1.5 }}>
          {/* Movie Title - I limit to 2 lines to maintain card uniformity */}
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2, // I clamp to 2 lines for longer titles
              WebkitBoxOrient: "vertical",
              minHeight: "2.4em", // I set min height to prevent layout shift
              mb: 0.5,
            }}
          >
            {movie.title}
          </Typography>
          {/* Rating Display - I show star icon with formatted rating value */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarRate sx={{ fontSize: 16, color: "custom.rating" }} />
            <Typography variant="caption" color="text.secondary">
              {movie.vote_average.toFixed(1)}{" "}
              {/* I format to 1 decimal for readability */}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompactMovieCard;
