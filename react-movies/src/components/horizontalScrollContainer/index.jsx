import React from "react";
import Box from "@mui/material/Box";

/**
 * HorizontalScrollContainer Component
 *
 * This component provides a reusable horizontal scrolling container with custom-styled
 * scrollbars. I designed this as a utility component to create consistent horizontal
 * scrolling experiences throughout the application for cast lists, movie recommendations,
 * similar movies, filmographies, and other content that benefits from horizontal browsing.
 *
 * Design Philosophy:
 * I created this component to solve the common problem of displaying multiple items in a
 * horizontal row without wrapping. Rather than creating pagination or limiting the number
 * of visible items, I let users naturally scroll horizontally to explore all content,
 * which feels more intuitive on both desktop (with mouse wheels) and mobile (with touch swipes).
 *
 * Custom Scrollbar Styling:
 * I customize the WebKit scrollbar to match the application's theme instead of using the
 * browser's default scrollbar. This creates a more polished, cohesive visual experience
 * that integrates seamlessly with Material-UI's design system. The scrollbar uses theme
 * colors that automatically adapt to light/dark modes.
 *
 * Scrollbar Interactivity:
 * I implement hover states on the scrollbar thumb to provide visual feedback when users
 * interact with it. This subtle enhancement helps users understand that the scrollbar is
 * interactive and encourages direct manipulation.
 *
 * Flexibility Through sx Prop:
 * I allow consumers to pass additional styles via the sx prop, which merges with (and can
 * override) the default styles. This gives developers flexibility to adjust spacing, colors,
 * or other properties for specific use cases while maintaining the core scrolling functionality.
 *
 * Gap and Padding Strategy:
 * I use a gap of 2 (16px in Material-UI's default spacing) between items to create breathing
 * room without requiring each child component to manage its own margins. I also add bottom
 * padding (pb: 2) to ensure the scrollbar doesn't overlap content and remains easily clickable.
 *
 * Browser Compatibility Note:
 * The scrollbar styling uses -webkit- prefixes, which work in Chrome, Safari, Edge, and other
 * WebKit-based browsers. Firefox and older browsers will fall back to their default scrollbar
 * styles, which is an acceptable graceful degradation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display in the horizontal scroll
 *                                           container (typically an array of cards or items)
 * @param {Object} [props.sx={}] - Optional Material-UI sx prop for additional custom styles.
 *                                  These styles will be merged with and can override the
 *                                  default container styles.
 *
 * @returns {React.ReactElement} A Material-UI Box configured as a horizontal scrolling container
 *                               with custom-styled scrollbars
 *
 * @example
 * import HorizontalScrollContainer from './components/horizontalScrollContainer';
 *
 * <HorizontalScrollContainer>
 *   {movies.map(movie => (
 *     <CompactMovieCard key={movie.id} movie={movie} />
 *   ))}
 * </HorizontalScrollContainer>
 *
 * @example
 * // With custom styles
 * <HorizontalScrollContainer sx={{ gap: 3, pb: 3 }}>
 *   {actors.map(actor => (
 *     <CastCard key={actor.id} actor={actor} />
 *   ))}
 * </HorizontalScrollContainer>
 */
/**
 * Renders a horizontal scrolling container with custom-styled scrollbars.
 *
 * I use Material-UI's Box component as the base and configure it with flexbox for horizontal
 * layout. The overflowX: "auto" property enables scrolling when content exceeds the container
 * width, while the custom scrollbar styles ensure it looks polished and theme-aware.
 *
 * @function HorizontalScrollContainer
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render in the scrolling container
 * @param {Object} [props.sx] - Optional additional styles that merge with defaults
 *
 * @returns {React.ReactElement} A Box component configured for horizontal scrolling
 */
const HorizontalScrollContainer = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex", // I use flexbox for horizontal item layout
        gap: 2, // I add spacing between items (16px)
        overflowX: "auto", // I enable horizontal scrolling when needed
        pb: 2, // I add bottom padding for scrollbar clearance
        // Custom scrollbar styling for WebKit browsers
        "&::-webkit-scrollbar": {
          height: 8, // I set a compact scrollbar height
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "action.hover", // I use theme color for track background
          borderRadius: 4, // I round the corners for polish
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "action.active", // I use theme color for the draggable thumb
          borderRadius: 4, // I match the track's rounded corners
          "&:hover": {
            backgroundColor: "action.selected", // I darken on hover for feedback
          },
        },
        ...sx, // I merge custom styles (can override defaults)
      }}
    >
      {children}
    </Box>
  );
};

export default HorizontalScrollContainer;
