import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router";
import { getActorRoute } from "../../constants/routes";
import { getActorProfileUrl } from "../../utils/movie";

/**
 * CastCard Component
 *
 * This component renders a compact, interactive card displaying a cast member's profile photo,
 * name, and character role. I designed this as a clickable card that navigates to the actor's
 * detailed profile page when clicked, providing users with an intuitive way to explore cast
 * information.
 *
 * Layout Design:
 * I structure the card with a circular profile photo at the top (using Material-UI's Avatar)
 * and the actor's information below. I chose this vertical layout because it's space-efficient
 * and works well in horizontal scrolling lists of cast members.
 *
 * Image Handling Strategy:
 * I implement a fallback mechanism for profile photos. When an actor's profile image is available,
 * I display it in an Avatar component. If the image is missing, I show a placeholder with a
 * PersonIcon, ensuring the UI remains consistent even when data is incomplete.
 *
 * Text Overflow Management:
 * I use CSS line clamping and ellipsis to handle long actor names and character names gracefully.
 * Actor names can display up to 2 lines before truncating, while character names are limited to
 * a single line. This ensures cards maintain uniform heights and prevent layout shifts.
 *
 * Interactive Feedback:
 * I implement a hover animation that scales the card by 5% and increases its shadow. This provides
 * immediate visual feedback that the card is clickable, improving the overall user experience and
 * discoverability of the navigation feature.
 *
 * Accessibility:
 * I wrap the entire card in a Link component, making the entire card clickable (not just a small
 * "more info" button). This creates a larger click target, which is beneficial for users with
 * motor impairments or those using touch screens.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.actor - The actor/cast member object from TMDB API
 * @param {number} props.actor.id - The unique identifier of the actor
 * @param {string} props.actor.name - The actor's full name
 * @param {string|null} props.actor.profile_path - Path to the actor's profile image (may be null)
 * @param {string} [props.actor.character] - The character name played by the actor (optional)
 *
 * @returns {React.ReactElement} A clickable card component displaying cast member information
 *
 * @example
 * import CastCard from './components/castCard';
 *
 * <CastCard
 *   actor={{
 *     id: 287,
 *     name: "Brad Pitt",
 *     profile_path: "/path/to/image.jpg",
 *     character: "Tyler Durden"
 *   }}
 * />
 */

/**
 * Renders a clickable cast member card with profile photo and role information.
 *
 * I retrieve the profile image URL using a utility function that handles TMDB's image CDN
 * configuration. The entire card is wrapped in a Link component for navigation, allowing
 * users to click anywhere on the card to view the actor's full profile.
 *
 * @function CastCard
 * @param {Object} props - Component props
 * @param {Object} props.actor - Actor object containing profile and role information
 * @param {number} props.actor.id - Used to generate the navigation route to the actor's page
 * @param {string} props.actor.name - Displayed as the primary text in the card
 * @param {string|null} props.actor.profile_path - Used to fetch the profile image URL
 * @param {string} [props.actor.character] - The role name, displayed as secondary text
 *
 * @returns {React.ReactElement} A Material-UI Card wrapped in a React Router Link
 */
const CastCard = ({ actor }) => {
  // I get the full profile image URL, which returns null if no image is available
  const profileImageUrl = getActorProfileUrl(actor.profile_path);

  return (
    <Link to={getActorRoute(actor.id)} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          minWidth: 140,
          maxWidth: 140,
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)", // I scale up slightly for interactive feedback
            boxShadow: 4, // I increase shadow to create depth on hover
          },
        }}
      >
        {/* Actor Photo Section - I center the avatar and apply consistent spacing */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
            pb: 1,
          }}
        >
          {/* I conditionally render either the actor's photo or a placeholder icon */}
          {profileImageUrl ? (
            <Avatar
              src={profileImageUrl}
              alt={actor.name}
              sx={{
                width: 100,
                height: 100,
                border: "2px solid",
                borderColor: "primary.main", // I use primary color border when image exists
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "action.hover",
                border: "2px solid",
                borderColor: "divider", // I use divider color for placeholder
              }}
            >
              <PersonIcon sx={{ fontSize: 60, color: "action.active" }} />
            </Avatar>
          )}
        </Box>

        {/* Actor Info Section - I display name and character with overflow handling */}
        <CardContent sx={{ pt: 1, pb: 2, px: 1.5 }}>
          {/* Actor Name - I allow 2 lines before truncating with ellipsis */}
          <Typography
            variant="body2"
            fontWeight={600}
            align="center"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2, // I limit to 2 lines for consistency
              WebkitBoxOrient: "vertical",
              minHeight: "2.4em", // I set min height to maintain card uniformity
              mb: 0.5,
            }}
          >
            {actor.name}
          </Typography>
          {/* Character Name - I display on single line with ellipsis if too long */}
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap", // I keep character name on one line
            }}
          >
            {actor.character || "Unknown Role"}{" "}
            {/* I provide fallback for missing character */}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CastCard;
