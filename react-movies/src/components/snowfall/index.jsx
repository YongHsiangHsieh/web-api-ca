/**
 * Snowfall Animation Component
 *
 * Creates a beautiful snowfall effect across the entire viewport.
 * Uses pure CSS animations for optimal performance.
 *
 * Features:
 * - Multiple snowflakes with varying sizes and speeds
 * - Blue tint with glow effect for visibility
 * - Non-interactive (clicks pass through)
 * - GPU-accelerated CSS animations
 * - Positioned behind all content
 *
 * @component
 */

import React from "react";
import Box from "@mui/material/Box";

/**
 * Individual snowflake configuration.
 * Each snowflake has different size, position, delay, and duration for variety.
 * Sizes are larger (10-20px) for better visibility.
 */
const snowflakes = [
  { id: 1, left: "3%", delay: "0s", duration: "12s", size: 14 },
  { id: 2, left: "8%", delay: "2s", duration: "14s", size: 10 },
  { id: 3, left: "13%", delay: "4s", duration: "10s", size: 18 },
  { id: 4, left: "18%", delay: "1s", duration: "13s", size: 12 },
  { id: 5, left: "23%", delay: "3s", duration: "11s", size: 16 },
  { id: 6, left: "28%", delay: "5s", duration: "15s", size: 10 },
  { id: 7, left: "33%", delay: "0.5s", duration: "12s", size: 14 },
  { id: 8, left: "38%", delay: "2.5s", duration: "13s", size: 8 },
  { id: 9, left: "43%", delay: "4.5s", duration: "11s", size: 16 },
  { id: 10, left: "48%", delay: "1.5s", duration: "14s", size: 12 },
  { id: 11, left: "53%", delay: "3.5s", duration: "16s", size: 18 },
  { id: 12, left: "58%", delay: "6s", duration: "12s", size: 10 },
  { id: 13, left: "63%", delay: "7s", duration: "13s", size: 14 },
  { id: 14, left: "68%", delay: "5.5s", duration: "11s", size: 12 },
  { id: 15, left: "73%", delay: "8s", duration: "15s", size: 16 },
  { id: 16, left: "78%", delay: "1s", duration: "12s", size: 10 },
  { id: 17, left: "83%", delay: "3s", duration: "14s", size: 18 },
  { id: 18, left: "88%", delay: "6.5s", duration: "11s", size: 14 },
  { id: 19, left: "93%", delay: "4s", duration: "13s", size: 12 },
  { id: 20, left: "97%", delay: "2s", duration: "15s", size: 16 },
  // Extra snowflakes for denser effect
  { id: 21, left: "5%", delay: "7.5s", duration: "14s", size: 10 },
  { id: 22, left: "25%", delay: "9s", duration: "12s", size: 14 },
  { id: 23, left: "45%", delay: "8.5s", duration: "13s", size: 12 },
  { id: 24, left: "65%", delay: "10s", duration: "11s", size: 16 },
  { id: 25, left: "85%", delay: "9.5s", duration: "14s", size: 10 },
];

/**
 * Renders a snowfall animation with multiple falling snowflakes.
 * Snowflakes have a blue tint and glow effect for better visibility.
 *
 * @returns {JSX.Element} A container with animated snowflakes
 */
const Snowfall = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Allow clicks to pass through
        zIndex: 9999, // Above content so snowflakes are visible
        overflow: "hidden",
        // Define the falling animation
        "@keyframes fall": {
          "0%": {
            transform: "translateY(-10vh) rotate(0deg)",
            opacity: 0,
          },
          "10%": {
            opacity: 1,
          },
          "90%": {
            opacity: 1,
          },
          "100%": {
            transform: "translateY(100vh) rotate(360deg)",
            opacity: 0,
          },
        },
      }}
    >
      {snowflakes.map((flake) => (
        <Box
          key={flake.id}
          sx={{
            position: "absolute",
            left: flake.left,
            top: "-20px",
            width: flake.size,
            height: flake.size,
            // Blue-white gradient for icy look
            background: "radial-gradient(circle, #ffffff 0%, #b3e5fc 50%, #81d4fa 100%)",
            borderRadius: "50%",
            opacity: 0.9,
            // Glow effect for visibility on any background
            boxShadow: `
              0 0 ${flake.size / 2}px #b3e5fc,
              0 0 ${flake.size}px #81d4fa,
              0 0 ${flake.size * 1.5}px rgba(129, 212, 250, 0.5)
            `,
            animation: `fall ${flake.duration} linear ${flake.delay} infinite`,
          }}
        />
      ))}
    </Box>
  );
};

export default Snowfall;
