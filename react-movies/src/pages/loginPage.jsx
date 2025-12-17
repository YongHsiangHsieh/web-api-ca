/**
 * Login Page Component
 *
 * This page provides a clean, centered login form for user authentication.
 * It integrates with the AuthContext to handle login state and errors.
 *
 * Key Design Decisions:
 *
 * 1. Centered Card Layout
 *    - I use a centered Paper component with max-width for a clean, focused form
 *    - The layout is responsive and looks good on both mobile and desktop
 *    - Matches the app's design language with consistent shadows and border radius
 *
 * 2. Simple State Management
 *    - I use useState for form fields instead of react-hook-form
 *    - For just 2 fields (username, password), this keeps the code simple
 *    - AuthContext handles the complex auth logic
 *
 * 3. Error Handling
 *    - I display errors from AuthContext in an Alert component
 *    - Errors appear below the form fields for clear visibility
 *    - Errors are cleared when user starts a new login attempt
 *
 * 4. Loading State
 *    - I show a CircularProgress spinner inside the button during login
 *    - Button is disabled while loading to prevent double-submissions
 *    - Provides clear feedback that the login is in progress
 *
 * 5. Navigation
 *    - On successful login, I redirect to the home page
 *    - Link to signup page for users who don't have an account
 *    - Uses React Router for client-side navigation
 *
 * 6. Accessibility
 *    - All inputs have proper labels and aria attributes
 *    - Form can be submitted with Enter key
 *    - Error messages are announced to screen readers
 *
 * @component
 * @example
 * // Used in routing configuration
 * <Route path="/login" element={<LoginPage />} />
 */

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/authContext";
import { ROUTES } from "../constants/routes";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Renders the login page with a centered form.
 *
 * I built this page to provide a simple, clean login experience. The form
 * collects username and password, validates through the AuthContext, and
 * redirects on success. Error messages from the backend are displayed
 * clearly to help users understand what went wrong.
 *
 * @returns {JSX.Element} A centered login form with error handling and loading state
 */
const LoginPage = () => {
  // I access the auth context for login function, loading state, and errors
  const { loginUser, loading, error } = useContext(AuthContext);

  // I use navigate to redirect after successful login
  const navigate = useNavigate();

  // I manage form field values with local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles form submission.
   *
   * I prevent the default form behavior, call the loginUser function from context,
   * and redirect to home on success. The context handles setting error state if
   * login fails.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // I call the context's login function which handles API call and state updates
    const success = await loginUser(username, password);

    if (success) {
      // I redirect to home page after successful login
      navigate(ROUTES.HOME);
    }
    // If login fails, the context sets the error state which we display below
  };

  return (
    <Box
      sx={{
        // I center the form both horizontally and vertically
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "80vh",
        pt: 8, // Padding top for spacing from header
        px: 2, // Horizontal padding for mobile
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          // I use the theme's border radius for consistency
          borderRadius: 3,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            gutterBottom
          >
            🎬 Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back to Moodvy
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            {/* Username Field */}
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
              inputProps={{
                "aria-label": "Enter your username",
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
              inputProps={{
                "aria-label": "Enter your password",
              }}
            />

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading || !username || !password}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? (
                // I show a spinner inside the button while loading
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Link to Signup */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to={ROUTES.AUTH.SIGNUP}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
