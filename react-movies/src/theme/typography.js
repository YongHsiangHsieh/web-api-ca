/**
 * Typography Configuration
 * Defines font families, sizes, weights, and responsive typography
 */

export const typography = {
  // Font families
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),

  // Font sizes and styles for different heading levels
  h1: {
    fontSize: "2.5rem", // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01562em",
  },

  h2: {
    fontSize: "2rem", // 32px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.00833em",
  },

  h3: {
    fontSize: "1.75rem", // 28px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0em",
  },

  h4: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "0.00735em",
  },

  h5: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0em",
  },

  h6: {
    fontSize: "1rem", // 16px
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: "0.0075em",
  },

  // Body text styles
  body1: {
    fontSize: "1rem", // 16px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
  },

  body2: {
    fontSize: "0.875rem", // 14px
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  },

  // Subtitle styles
  subtitle1: {
    fontSize: "1rem", // 16px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: "0.00938em",
  },

  subtitle2: {
    fontSize: "0.875rem", // 14px
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: "0.00714em",
  },

  // Button text
  button: {
    fontSize: "0.875rem", // 14px
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
  },

  // Caption and overline
  caption: {
    fontSize: "0.75rem", // 12px
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },

  overline: {
    fontSize: "0.75rem", // 12px
    fontWeight: 600,
    lineHeight: 2.66,
    letterSpacing: "0.08333em",
    textTransform: "uppercase",
  },
};

