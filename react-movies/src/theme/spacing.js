/**
 * Spacing System
 * Standardized spacing values for consistent layouts
 * Based on 8px grid system (8, 16, 24, 32, 40, 48, 64, etc.)
 */

// Base spacing unit (8px)
const baseSpacing = 8;

/**
 * Spacing function - multiplies base unit
 * Usage: spacing(2) returns 16px, spacing(3) returns 24px
 */
export const spacing = (multiplier) => `${baseSpacing * multiplier}px`;

/**
 * Common spacing values for quick reference
 */
export const spacingValues = {
  xs: baseSpacing * 0.5, // 4px
  sm: baseSpacing, // 8px
  md: baseSpacing * 2, // 16px
  lg: baseSpacing * 3, // 24px
  xl: baseSpacing * 4, // 32px
  xxl: baseSpacing * 6, // 48px
  xxxl: baseSpacing * 8, // 64px
};

/**
 * Container max widths for different breakpoints
 */
export const containerMaxWidth = {
  xs: "100%",
  sm: "600px",
  md: "960px",
  lg: "1280px",
  xl: "1920px",
};

/**
 * Border radius values
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: "50%",
};

/**
 * Common layout values
 */
export const layout = {
  headerHeight: 64,
  sidebarWidth: 240,
  footerHeight: 80,
  cardMaxWidth: 345,
  contentMaxWidth: 1200,
};

