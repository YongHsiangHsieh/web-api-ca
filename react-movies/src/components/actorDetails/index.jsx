import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CakeIcon from "@mui/icons-material/Cake";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import { getActorProfileUrl, sortMoviesByPopularity } from "../../utils/movie";
import CompactMovieCard from "../compactMovieCard";
import HorizontalScrollContainer from "../horizontalScrollContainer";

/**
 * ActorDetails Component
 *
 * This component displays comprehensive information about an actor/person, including their
 * profile image, biography, and filmography. I designed this as a dedicated detail page view
 * that presents all relevant information in an organized, visually appealing layout.
 *
 * Layout Structure:
 * I organize the component into two main sections:
 * 1. Profile Section - Displays the actor's photo and biographical information (name, birthdate, birthplace, department)
 * 2. Filmography Section - Shows a horizontally scrollable list of movies the actor is known for
 *
 * Responsive Design:
 * I use Material-UI's responsive breakpoints (xs, sm, md) to adapt the layout across different
 * screen sizes. On mobile, the profile photo stacks above the biography. On larger screens, they
 * display side-by-side for a more efficient use of space.
 *
 * Movie Sorting Logic:
 * I sort the filmography by popularity to highlight the actor's most famous roles first, helping
 * users quickly find the movies they're most interested in.
 *
 * @component
 * @returns {React.ReactElement} A detailed actor profile page component
 *
 * @example
 * import ActorDetails from './components/actorDetails';
 *
 * <ActorDetails
 *   person={personData}
 *   movies={filmography}
 *   FilmographyState={SkeletonComponent}
 * />
 */

/**
 * Renders the actor/person details page with profile information and filmography.
 *
 * @function ActorDetails
 * @param {Object} props - Component props
 * @param {Object} props.person - The person/actor data object from TMDB API
 * @param {string} props.person.name - The actor's full name
 * @param {string} props.person.profile_path - Path to the actor's profile image from TMDB CDN
 * @param {string} [props.person.biography] - The actor's biography text (may be empty string)
 * @param {string} [props.person.birthday] - Birth date in ISO format (YYYY-MM-DD)
 * @param {string} [props.person.place_of_birth] - The actor's birthplace location
 * @param {string} [props.person.known_for_department] - Primary department (e.g., "Acting", "Directing")
 *
 * @param {Array<Object>} props.movies - Array of movie objects representing the actor's filmography
 * @param {number} props.movies[].id - Unique movie identifier
 * @param {string} props.movies[].title - Movie title
 * @param {number} [props.movies[].popularity] - Popularity score used for sorting
 *
 * @param {React.ComponentType} props.FilmographyState - A component to display while filmography
 *                                                       is loading (typically a skeleton/loading state).
 *                                                       I use this to show a fallback UI when
 *                                                       no movies are available yet.
 *
 * @returns {React.ReactElement} A Material-UI Paper-based layout containing the actor profile
 *                               and filmography sections
 */
const ActorDetails = ({ person, movies, FilmographyState }) => {
  // Sort movies by popularity to show most famous roles first
  const sortedMovies = sortMoviesByPopularity(movies);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      {/* Actor Profile Section - Displays photo, name, and biographical information */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Profile Photo Container - I center it on mobile and align left on desktop */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              component="img"
              src={getActorProfileUrl(person.profile_path)}
              alt={person.name}
              sx={{
                width: { xs: 200, sm: 250, md: 300 },
                height: { xs: 300, sm: 375, md: 450 },
                borderRadius: 2,
                objectFit: "cover",
                boxShadow: 3,
              }}
            />
          </Box>

          {/* Biography & Details Section - I organize biographical information with icons for visual hierarchy */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {person.name}
            </Typography>

            {/* Quick Info Chips - I display key biographical data with icons for quick scanning */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              {person.known_for_department && (
                <Chip
                  icon={<PersonIcon />}
                  label={person.known_for_department}
                  color="primary"
                  size="small"
                />
              )}
              {person.birthday && (
                <Chip
                  icon={<CakeIcon />}
                  label={new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  size="small"
                />
              )}
              {person.place_of_birth && (
                <Chip
                  icon={<PlaceIcon />}
                  label={person.place_of_birth}
                  size="small"
                />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Biography Section - I conditionally render the biography or display a fallback message */}
            {person.biography && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Biography
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                    textAlign: "justify",
                    whiteSpace: "pre-line",
                  }}
                >
                  {person.biography}
                </Typography>
              </>
            )}

            {!person.biography && (
              <Typography variant="body2" color="text.secondary">
                No biography available.
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Filmography Section - I display the actor's most notable movies in a horizontally scrollable list */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Known For
        </Typography>

        {/* I limit filmography to top 20 movies to avoid overwhelming the UI while showing relevant content */}
        {sortedMovies.length > 0 ? (
          <HorizontalScrollContainer>
            {sortedMovies.slice(0, 20).map((movie) => (
              <Box key={movie.id} sx={{ minWidth: 150, flexShrink: 0 }}>
                <CompactMovieCard movie={movie} />
              </Box>
            ))}
          </HorizontalScrollContainer>
        ) : (
          <FilmographyState />
        )}

        {sortedMovies.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No filmography available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ActorDetails;
