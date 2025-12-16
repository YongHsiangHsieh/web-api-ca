/**
 * Main Theme Configuration
 * Combines all theme settings into a single cohesive theme object
 * This is the single source of truth for all design decisions
 */

import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import { components } from "./components";

/**
 * Create the main application theme
 */
export const theme = createTheme({
  // Color palette
  palette: {
    mode: "light",
    ...palette,
  },

  // Typography settings
  typography,

  // Component style overrides
  components,

  // Spacing - MUI uses 8px as base unit by default
  spacing: 8,

  // Breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  // Shape configuration
  shape: {
    borderRadius: 8,
  },

  // Shadows - softer shadows for modern look
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 2px 8px rgba(0,0,0,0.1)",
    "0px 4px 12px rgba(0,0,0,0.1)",
    "0px 6px 16px rgba(0,0,0,0.1)",
    "0px 8px 20px rgba(0,0,0,0.12)",
    "0px 10px 24px rgba(0,0,0,0.12)",
    "0px 12px 28px rgba(0,0,0,0.15)",
    "0px 14px 32px rgba(0,0,0,0.15)",
    "0px 16px 36px rgba(0,0,0,0.15)",
    "0px 18px 40px rgba(0,0,0,0.18)",
    "0px 20px 44px rgba(0,0,0,0.18)",
    "0px 22px 48px rgba(0,0,0,0.2)",
    "0px 24px 52px rgba(0,0,0,0.2)",
    "0px 26px 56px rgba(0,0,0,0.2)",
    "0px 28px 60px rgba(0,0,0,0.22)",
    "0px 30px 64px rgba(0,0,0,0.22)",
    "0px 32px 68px rgba(0,0,0,0.24)",
    "0px 34px 72px rgba(0,0,0,0.24)",
    "0px 36px 76px rgba(0,0,0,0.24)",
    "0px 38px 80px rgba(0,0,0,0.26)",
    "0px 40px 84px rgba(0,0,0,0.26)",
    "0px 42px 88px rgba(0,0,0,0.28)",
    "0px 44px 92px rgba(0,0,0,0.28)",
    "0px 46px 96px rgba(0,0,0,0.3)",
  ],

  // Transitions - smooth animations throughout
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },

  // Z-index values
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default theme;

