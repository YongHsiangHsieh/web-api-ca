/**
 * Color Palette Configuration
 * Defines all colors used throughout the application
 * Provides a cohesive, professional color scheme for the movie app
 */

export const palette = {
  // Primary color - Modern blue for main actions and branding
  primary: {
    main: "#1976d2", // Primary blue
    light: "#42a5f5", // Lighter blue for hover states
    dark: "#1565c0", // Darker blue for active states
    contrastText: "#ffffff", // White text on primary
  },

  // Secondary color - Complementary purple for accents
  secondary: {
    main: "#9c27b0", // Purple
    light: "#ba68c8", // Light purple
    dark: "#7b1fa2", // Dark purple
    contrastText: "#ffffff",
  },

  // Error color - For warnings and destructive actions
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#ffffff",
  },

  // Warning color - For alerts
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#ffffff",
  },

  // Info color - For informational messages
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#ffffff",
  },

  // Success color - For positive feedback
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },

  // Background colors
  background: {
    default: "#f5f5f5", // Light gray for page background
    paper: "#ffffff", // White for cards and surfaces
    dark: "#121212", // For potential dark mode
  },

  // Text colors
  text: {
    primary: "rgba(0, 0, 0, 0.87)", // Main text color
    secondary: "rgba(0, 0, 0, 0.6)", // Secondary text
    disabled: "rgba(0, 0, 0, 0.38)", // Disabled text
    hint: "rgba(0, 0, 0, 0.38)", // Hint text
  },

  // Custom colors for movie-specific elements
  custom: {
    favorite: "#e91e63", // Pink for favorites
    rating: "#ffd700", // Gold for star ratings
    upcoming: "#00bcd4", // Cyan for upcoming badge
    revenue: "#4caf50", // Green for revenue
    runtime: "#ff9800", // Orange for runtime
  },

  // Divider color
  divider: "rgba(0, 0, 0, 0.12)",

  // Action colors (for buttons, icons, etc.)
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.04)",
    selected: "rgba(0, 0, 0, 0.08)",
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
  },
};

