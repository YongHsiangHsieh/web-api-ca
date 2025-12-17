/**
 * Festive Banner Component
 *
 * A simple holiday banner that displays a Merry Christmas message.
 * Adds a festive touch to the app during the holiday season.
 *
 * Features:
 * - Gradient background with festive colors
 * - Subtle shimmer animation on text
 * - Responsive and lightweight
 *
 * @component
 */

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Renders a festive holiday banner with a gradient background.
 *
 * @returns {JSX.Element} A festive banner component
 */
const FestiveBanner = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #c41e3a 0%, #1a472a 50%, #c41e3a 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s ease-in-out infinite",
        py: 1,
        px: 2,
        textAlign: "center",
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "white",
          fontWeight: 600,
          letterSpacing: 1,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        🎄 Merry Christmas & Happy 2026! 🎅
      </Typography>
    </Box>
  );
};

export default FestiveBanner;
