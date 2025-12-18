/**
 * Site Header Component
 *
 * This is the main navigation header for the entire application. It provides
 * site-wide navigation with responsive behavior that adapts to different screen sizes.
 *
 * Key Design Decisions:
 *
 * 1. Responsive Navigation
 *    - On desktop (md breakpoint and up): I show all navigation links as buttons in the toolbar
 *    - On mobile (below md breakpoint): I collapse navigation into a hamburger menu
 *    - I use MUI's useMediaQuery to detect screen size and adapt the UI accordingly
 *    - This provides optimal UX for both desktop and mobile users
 *
 * 2. Fixed Positioning
 *    - I use position="fixed" so the header stays visible while scrolling
 *    - The Offset component adds spacing below to prevent content from being hidden
 *    - This keeps navigation always accessible without taking up scroll space
 *
 * 3. Visual Design
 *    - Gradient background from primary to primary.dark for visual interest
 *    - Film emoji (🎬) adds personality and reinforces the movie theme
 *    - Tagline "Discover Your Next Favorite Movie" communicates the app's purpose
 *    - Tagline is hidden on mobile to save horizontal space
 *
 * 4. Navigation Architecture
 *    - I define all menu options in a single array for easy maintenance
 *    - Each option has a label (display text) and path (route)
 *    - Same array is used for both mobile menu and desktop buttons
 *    - This ensures consistency and reduces code duplication
 *
 * 5. Mobile Menu Behavior
 *    - Hamburger icon button opens a dropdown menu
 *    - Menu is anchored to the top-right for natural positioning
 *    - keepMounted prop keeps menu in DOM for better performance on re-opens
 *    - Clicking any menu item closes the menu and navigates
 *
 * 6. Authentication UI
 *    - When not logged in: Show Login and Sign Up buttons
 *    - When logged in: Show username with dropdown containing Logout option
 *    - Auth state is read from AuthContext
 *    - Logout is immediate (no confirmation dialog)
 *
 * 7. Accessibility Features
 *    - All interactive elements have aria-labels for screen readers
 *    - Hamburger menu has proper ARIA attributes (controls, haspopup, expanded)
 *    - Minimum touch target sizes (48px) for mobile usability
 *    - Semantic HTML with h1 for the site title
 *
 * 8. Navigation Flow
 *    - I use React Router's navigate function for client-side routing
 *    - No page reloads - smooth SPA navigation experience
 *    - Routes are imported from constants for consistency
 *
 * @component
 * @example
 * // Used in the main App layout to provide site-wide navigation
 * <SiteHeader />
 */

import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ROUTES } from "../../constants/routes";
import { AuthContext } from "../../contexts/authContext";

/**
 * Offset component to add spacing below the fixed AppBar.
 *
 * I create this styled component using MUI's theme.mixins.toolbar, which provides
 * the exact height of the AppBar. This ensures content below the header starts
 * at the right position and isn't hidden behind the fixed header.
 *
 * @constant
 */
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

/**
 * Renders the main site header with responsive navigation.
 *
 * I built this as a fixed header that adapts between desktop (button links) and
 * mobile (hamburger menu) layouts. The header provides access to all main sections
 * of the application and stays visible while scrolling for easy navigation.
 *
 * @returns {JSX.Element} A responsive AppBar with navigation links/menu
 */
const SiteHeader = () => {
  // I track the anchor element for the mobile menu to position it correctly
  // When null, the menu is closed; when set, the menu opens anchored to this element
  const [anchorEl, setAnchorEl] = useState(null);

  // I track the anchor element for the user dropdown menu separately
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // I convert anchorEl to a boolean to easily check if the menu is open
  const open = Boolean(anchorEl);

  // I check if user dropdown is open
  const userMenuOpen = Boolean(userMenuAnchor);

  // I access the theme to use with media queries
  const theme = useTheme();

  // I check if the screen is mobile-sized (below md breakpoint)
  // This determines whether to show the hamburger menu or desktop buttons
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // I use navigate for client-side routing without page reloads
  const navigate = useNavigate();

  // I access auth state from context
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  /**
   * Navigation menu options.
   *
   * I define all navigation items in a single array so I can map over them
   * for both mobile and desktop views. This keeps the navigation consistent
   * and makes it easy to add or modify menu items in one place.
   *
   * @constant
   * @type {Array<{label: string, path: string}>}
   */
  const menuOptions = [
    { label: "Home", path: ROUTES.HOME },
    { label: "My List", path: ROUTES.MOVIES.MY_LIST },
    { label: "Upcoming", path: ROUTES.MOVIES.UPCOMING },
    { label: "Popular", path: ROUTES.MOVIES.POPULAR },
    { label: "Top Rated", path: ROUTES.MOVIES.TOP_RATED },
    { label: "In Theaters", path: ROUTES.MOVIES.NOW_PLAYING },
  ];

  /**
   * Handles navigation when a menu option is selected.
   *
   * I close the mobile menu (if open) and navigate to the selected page.
   * This works for both mobile menu items and desktop buttons since both
   * call this same function.
   *
   * @param {string} pageURL - The route path to navigate to
   */
  const handleMenuSelect = (pageURL) => {
    // I close the menu by clearing the anchor element
    setAnchorEl(null);
    // I navigate to the selected page
    navigate(pageURL);
  };

  /**
   * Handles opening the mobile hamburger menu.
   *
   * I set the anchor element to the button that was clicked, which tells
   * MUI's Menu component where to position itself on the screen.
   *
   * @param {Event} event - Click event from the hamburger icon button
   */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles opening the user dropdown menu.
   *
   * @param {Event} event - Click event from the username button
   */
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  /**
   * Handles closing the user dropdown menu.
   */
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  /**
   * Handles user logout.
   *
   * I call the logout function from AuthContext and close the menu.
   * The logout is immediate without confirmation as per user preference.
   */
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    // Navigate to home after logout
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        elevation={2}
        sx={{
          // I apply a gradient background for visual interest and polish
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Toolbar>
          {/* Site branding with logo emoji and name */}
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, letterSpacing: 1 }}
          >
            {/* I use a film emoji to reinforce the movie theme */}
            🎬 Moodvy
          </Typography>
          {/* Tagline that describes the app's purpose */}
          <Typography
            variant="body2"
            sx={{
              ml: 3,
              // I hide the tagline on mobile to save horizontal space
              display: { xs: "none", md: "block" },
              opacity: 0.9,
            }}
          >
            Discover Your Next Favorite Movie
          </Typography>
          {/* Spacer to push navigation to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Conditional rendering: mobile menu or desktop buttons */}
          {isMobile ? (
            <>
              {/* Mobile hamburger menu button */}
              <IconButton
                aria-label="Open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                // I dynamically set aria-expanded based on menu open state
                aria-expanded={open ? "true" : "false"}
                onClick={handleMenu}
                color="inherit"
                size="large"
                // I ensure minimum 48px touch target for mobile accessibility
                sx={{ minWidth: 48, minHeight: 48 }}
              >
                <MenuIcon />
              </IconButton>

              {/* Mobile dropdown menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                // I anchor the menu to top-right for natural positioning near the hamburger icon
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                // I keep the menu in the DOM even when closed for better performance
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {/* I map over menu options to create menu items */}
                {menuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}

                {/* Divider to separate navigation from auth actions */}
                <Divider sx={{ my: 1 }} />

                {/* Auth actions in mobile menu */}
                {isAuthenticated ? (
                  <>
                    {/* Show username (non-clickable, just for display) */}
                    <MenuItem disabled sx={{ opacity: 0.7 }}>
                      👤 {user?.username}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleMenuSelect(ROUTES.AUTH.LOGIN)}>
                      Login
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuSelect(ROUTES.AUTH.SIGNUP)}>
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              {/* Desktop navigation buttons */}
              {/* I map over the same menu options to create button links */}
              {menuOptions.map((opt) => (
                <Button
                  key={opt.label}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                  aria-label={`Navigate to ${opt.label}`}
                  // I ensure minimum 48px height and add horizontal padding for comfortable clicking
                  sx={{ minHeight: 48, px: 2 }}
                >
                  {opt.label}
                </Button>
              ))}

              {/* Auth section - conditionally render based on auth state */}
              <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    {/* Username button with dropdown */}
                    <Button
                      color="inherit"
                      onClick={handleUserMenuOpen}
                      aria-label="User menu"
                      aria-controls="user-menu"
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen ? "true" : "false"}
                      sx={{
                        minHeight: 48,
                        px: 2,
                        textTransform: "none", // Keep username as-is, no uppercase
                        fontWeight: 600,
                      }}
                    >
                      👤 {user?.username}
                    </Button>

                    {/* User dropdown menu */}
                    <Menu
                      id="user-menu"
                      anchorEl={userMenuAnchor}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={userMenuOpen}
                      onClose={handleUserMenuClose}
                    >
                      <MenuItem onClick={handleLogout}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    {/* Login button - outlined style */}
                    <Button
                      variant="outlined"
                      onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                      aria-label="Navigate to Login"
                      sx={{
                        minHeight: 40,
                        color: "white",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Login
                    </Button>

                    {/* Sign Up button - contained style for emphasis */}
                    <Button
                      variant="contained"
                      onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
                      aria-label="Navigate to Sign Up"
                      sx={{
                        minHeight: 40,
                        backgroundColor: "white",
                        color: "primary.main",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      {/* Offset div to prevent content from being hidden behind the fixed header */}
      <Offset />
    </>
  );
};

export default SiteHeader;
