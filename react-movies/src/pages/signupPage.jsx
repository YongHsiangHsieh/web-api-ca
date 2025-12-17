/**
 * Signup Page Component
 *
 * This page provides a clean, centered signup form for user registration.
 * It includes a password strength indicator to help users create secure passwords.
 *
 * Key Design Decisions:
 *
 * 1. Centered Card Layout
 *    - I use the same layout as the login page for consistency
 *    - Paper component with max-width for a clean, focused form
 *    - Matches the app's design language
 *
 * 2. Password Strength Indicator
 *    - I provide real-time feedback on password strength as user types
 *    - Uses LinearProgress bar with color-coded strength levels
 *    - Helps users understand what makes a strong password
 *    - Matches backend validation requirements
 *
 * 3. Strength Calculation
 *    - Too Short: Less than 8 characters
 *    - Weak: 8+ chars but missing multiple requirements
 *    - Medium: Has some requirements (letter + digit OR letter + special)
 *    - Strong: Has all requirements (letter + digit + special char)
 *
 * 4. No Auto-Login
 *    - After successful signup, I redirect to login page
 *    - This is more consistent and avoids potential issues
 *    - User sees a success message and can then log in
 *
 * 5. Error Handling
 *    - I display backend errors (like "username already taken")
 *    - Errors appear below the form fields
 *    - Errors are cleared when user starts a new signup attempt
 *
 * @component
 * @example
 * // Used in routing configuration
 * <Route path="/signup" element={<SignupPage />} />
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
import LinearProgress from "@mui/material/LinearProgress";

/**
 * Calculates password strength based on various criteria.
 *
 * I check for the same requirements as the backend:
 * - Minimum 8 characters
 * - At least one letter (a-z, A-Z)
 * - At least one digit (0-9)
 * - At least one special character (@$!%*#?&)
 *
 * @param {string} password - The password to evaluate
 * @returns {Object} Strength info with value (0-100), label, and color
 */
const calculatePasswordStrength = (password) => {
  if (!password) {
    return { value: 0, label: "", color: "error" };
  }

  // I check each requirement individually
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[@$!%*#?&]/.test(password);

  // I count how many requirements are met
  const requirementsMet = [hasMinLength, hasLetter, hasDigit, hasSpecial].filter(Boolean).length;

  // I determine strength level based on requirements
  if (!hasMinLength) {
    return { 
      value: 25, 
      label: "Too short (min 8 characters)", 
      color: "error" 
    };
  }

  if (requirementsMet === 2) {
    return { 
      value: 50, 
      label: "Weak", 
      color: "warning" 
    };
  }

  if (requirementsMet === 3) {
    return { 
      value: 75, 
      label: "Medium", 
      color: "info" 
    };
  }

  if (requirementsMet === 4) {
    return { 
      value: 100, 
      label: "Strong", 
      color: "success" 
    };
  }

  // Default case (shouldn't reach here, but just in case)
  return { 
    value: 25, 
    label: "Weak", 
    color: "error" 
  };
};

/**
 * Renders the signup page with a centered form and password strength indicator.
 *
 * I built this page to provide a user-friendly registration experience. The form
 * collects username and password, shows real-time password strength feedback,
 * and redirects to login on success. Error messages from the backend are displayed
 * clearly to help users understand what went wrong.
 *
 * @returns {JSX.Element} A centered signup form with password strength indicator
 */
const SignupPage = () => {
  // I access the auth context for signup function, loading state, and errors
  const { signupUser, loading, error } = useContext(AuthContext);

  // I use navigate to redirect after successful signup
  const navigate = useNavigate();

  // I manage form field values with local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // I track signup success to show a success message
  const [signupSuccess, setSignupSuccess] = useState(false);

  // I calculate password strength whenever password changes
  const passwordStrength = calculatePasswordStrength(password);

  /**
   * Handles form submission.
   *
   * I prevent the default form behavior, call the signupUser function from context,
   * and redirect to login on success. The context handles setting error state if
   * signup fails.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // I call the context's signup function which handles API call and state updates
    const success = await signupUser(username, password);

    if (success) {
      // I show success message briefly, then redirect to login
      setSignupSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 1500); // Wait 1.5 seconds so user can see success message
    }
    // If signup fails, the context sets the error state
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
            🎬 Sign Up
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your Moodvy account
          </Typography>
        </Box>

        {/* Success Message */}
        {signupSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Account created successfully! Redirecting to login...
          </Alert>
        )}

        {/* Signup Form */}
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
              disabled={loading || signupSuccess}
              helperText="3-20 characters, letters, numbers, and underscores only"
              inputProps={{
                "aria-label": "Enter your desired username",
              }}
            />

            {/* Password Field */}
            <Box>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading || signupSuccess}
                inputProps={{
                  "aria-label": "Enter your password",
                }}
              />

              {/* Password Strength Indicator */}
              {password && (
                <Box sx={{ mt: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.value}
                    color={passwordStrength.color}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "grey.200",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={`${passwordStrength.color}.main`}
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
              )}

              {/* Password Requirements Hint */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Must include: 8+ characters, letter, number, and special character (@$!%*#?&)
              </Typography>
            </Box>

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
              disabled={loading || signupSuccess || !username || !password || passwordStrength.value < 100}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? (
                // I show a spinner inside the button while loading
                <CircularProgress size={24} color="inherit" />
              ) : signupSuccess ? (
                "Redirecting..."
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Link to Login */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to={ROUTES.AUTH.LOGIN}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default SignupPage;
