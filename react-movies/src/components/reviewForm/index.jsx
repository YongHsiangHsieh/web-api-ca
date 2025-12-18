/**
 * Review Form Component
 *
 * This component provides a complete form interface for users to write and submit
 * movie reviews. It handles form validation, rating selection, and success feedback.
 *
 * Key Design Decisions:
 *
 * 1. React Hook Form Integration
 *    - I use react-hook-form for form state management and validation
 *    - Controller components wrap MUI TextFields for seamless integration
 *    - This gives me built-in validation, error handling, and form reset capabilities
 *    - Reduces re-renders compared to controlled components with local state
 *
 * 2. Validation Rules
 *    - Author name is required (can't submit anonymous reviews)
 *    - Review text must be at least 10 characters (ensures meaningful content)
 *    - Both fields show inline error messages for immediate feedback
 *    - I use MUI's error prop and helperText for consistent error display
 *
 * 3. Rating System
 *    - I provide a 5-star rating scale (1 = Terrible, 5 = Excellent)
 *    - Default rating is 3 (Average) as a neutral starting point
 *    - Uses a select dropdown with star emoji for visual clarity
 *    - StarIcon provides additional visual reinforcement of the rating concept
 *
 * 4. Success Feedback
 *    - I show a Snackbar notification when review is successfully submitted
 *    - Auto-dismisses after 3 seconds for non-intrusive confirmation
 *    - Positioned at top-right to avoid blocking form content
 *    - After submission, I navigate user to their favorites list
 *
 * 5. Form Layout
 *    - Uses Stack component for consistent vertical spacing (3 theme units)
 *    - Fields are in logical order: author name, rating, then detailed review
 *    - Submit and Reset buttons are side-by-side for easy access
 *    - Multiline textarea for review gives ample space (8 rows minimum)
 *
 * 6. Reset Functionality
 *    - Reset button clears all fields and returns rating to default (3)
 *    - Uses react-hook-form's reset() method for proper state cleanup
 *    - Provides a quick way to start over without page refresh
 *
 * 7. Accessibility Features
 *    - All inputs have proper aria-labels for screen readers
 *    - Required fields marked with aria-required
 *    - Error messages are associated with their fields
 *    - AutoFocus on author field for keyboard users
 *
 * 8. Context Integration & Backend Sync
 *    - Submits review to MoviesContext for global state management
 *    - MoviesContext syncs the review to the backend database
 *    - Review persists across sessions and page refreshes
 *    - Author is automatically set to the logged-in user's username
 *
 * Data Flow:
 * - User fills form → Validation → Context stores review → Backend sync → Success message → Navigate to My List
 *
 * @component
 * @example
 * // Used on the add review page
 * <ReviewForm movie={movieObject} />
 */

import React, { useState, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";
import { useForm, Controller } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router";
import { ROUTES } from "../../constants/routes";

/**
 * Rating options for the review form.
 *
 * I define these as a constant array so they can be easily mapped to MenuItem components.
 * Each rating includes both a numeric value (for data) and a label with star emoji (for display).
 * The order is reversed (5 to 1) so "Excellent" appears first in the dropdown.
 *
 * @constant
 * @type {Array<{value: number, label: string}>}
 */
const ratings = [
  {
    value: 5,
    label: "Excellent ⭐⭐⭐⭐⭐",
  },
  {
    value: 4,
    label: "Good ⭐⭐⭐⭐",
  },
  {
    value: 3,
    label: "Average ⭐⭐⭐",
  },
  {
    value: 2,
    label: "Poor ⭐⭐",
  },
  {
    value: 1,
    label: "Terrible ⭐",
  },
];

/**
 * Renders a comprehensive review submission form with validation and feedback.
 *
 * I built this form to collect user reviews with proper validation and a great user experience.
 * The form uses react-hook-form for efficient state management and MUI components for
 * a polished, accessible interface. Upon successful submission, the review is stored in
 * the global context and the user receives confirmation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object to review
 * @param {number} props.movie.id - Movie ID used to associate the review
 * @param {string} props.movie.title - Movie title displayed in the form header
 * @returns {JSX.Element} A complete review form with validation and success notification
 */
const ReviewForm = ({ movie }) => {
  // I access the MoviesContext to use the addReview function for storing the review
  const context = useContext(MoviesContext);

  // I track the rating separately from react-hook-form for easier control
  // Default to 3 (Average) as a neutral starting point
  const [rating, setRating] = useState(3);

  // I control the success Snackbar visibility with this state
  const [open, setOpen] = useState(false);

  // I use navigate to redirect users after successful submission
  const navigate = useNavigate();

  // I define default values for all form fields to ensure clean initialization
  const defaultValues = {
    author: "",
    review: "",
    agree: false,
    rating: "3",
  };

  // I destructure react-hook-form utilities for form management
  // control: connects Controller components to the form
  // errors: contains validation error messages
  // handleSubmit: wraps submit handler with validation
  // reset: clears form back to defaults
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm(defaultValues);

  /**
   * Handles rating dropdown changes.
   *
   * I update the local rating state when the user selects a different rating.
   * This keeps the rating value in sync with the select component.
   *
   * @param {Event} event - Change event from the TextField select
   */
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  /**
   * Handles closing the success notification.
   *
   * I close the Snackbar and navigate to the favorites page after the user
   * has been notified of successful submission. This provides a smooth transition
   * back to their movie collection.
   *
   * @param {Event} event - Close event from the Snackbar
   */
  const handleSnackClose = (event) => {
    setOpen(false);
    navigate(ROUTES.MOVIES.MY_LIST);
  };

  /**
   * Handles form submission.
   *
   * I receive the validated form data, build the review object with proper
   * field names, then store it via context (which syncs to backend).
   * React-hook-form ensures this only runs if validation passes.
   *
   * Note: The 'author' field is for display only - the backend automatically
   * uses the authenticated user's username.
   *
   * @param {Object} formData - Validated form data
   * @param {string} formData.author - Name entered by user (for display)
   * @param {string} formData.review - The review text content
   */
  const onSubmit = async (formData) => {
    // I build the review object with field names expected by the backend
    const review = {
      rating: rating,
      content: formData.review,  // Map 'review' field to 'content' for backend
    };

    // I store the review via context (syncs to backend)
    await context.addReview(movie, review);

    // I show the success message
    setOpen(true);
  };

  return (
    <Box>
      {/* Header section with title and movie name */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {/* I add a writing emoji to make the form feel friendly and inviting */}
          ✍️ Write a Review
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {/* I personalize the subtitle with the movie title */}
          Share your thoughts about {movie.title}
        </Typography>
      </Box>

      {/* Success notification shown after submission */}
      <Snackbar
        // I position at top-right to avoid blocking form content
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
        // I auto-hide after 3 seconds for non-intrusive confirmation
        autoHideDuration={3000}
      >
        <MuiAlert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
          elevation={6}
        >
          {/* I add a celebration emoji to make success feel rewarding */}
          Thank you for submitting a review! 🎉
        </MuiAlert>
      </Snackbar>

      {/* Main form container with elevation for depth */}
      <Paper elevation={1} sx={{ p: 4 }}>
        {/* I use noValidate to prevent browser's default validation (using react-hook-form instead) */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* I use Stack for consistent vertical spacing between form fields */}
          <Stack spacing={3}>
            {/* Author Name Field */}
            <Box>
              {/* I use Controller to integrate react-hook-form with MUI TextField */}
              <Controller
                name="author"
                control={control}
                // I require the author name - no anonymous reviews
                rules={{ required: "Name is required" }}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    onChange={onChange}
                    value={value}
                    id="author"
                    label="Your Name"
                    name="author"
                    // I auto-focus this field so users can start typing immediately
                    autoFocus
                    // I show error styling if validation fails
                    error={!!errors.author}
                    // I display the validation error message as helper text
                    helperText={errors.author?.message}
                    inputProps={{
                      "aria-label": "Enter your name for the review",
                      "aria-required": "true",
                    }}
                  />
                )}
              />
            </Box>

            {/* Rating Selection Field */}
            <Box>
              <Controller
                control={control}
                name="rating"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    id="select-rating"
                    select
                    fullWidth
                    variant="outlined"
                    label="Rating"
                    value={rating}
                    onChange={handleRatingChange}
                    // I provide guidance on what the field is for
                    helperText="How would you rate this movie?"
                    InputProps={{
                      // I add a star icon to visually reinforce this is a rating field
                      startAdornment: (
                        <StarIcon sx={{ color: "custom.rating", mr: 1 }} />
                      ),
                    }}
                    inputProps={{
                      "aria-label": "Select movie rating",
                    }}
                  >
                    {/* I map over the ratings array to create menu options */}
                    {ratings.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            {/* Review Text Field */}
            <Box>
              <Controller
                name="review"
                control={control}
                rules={{
                  // I require review content - can't submit empty reviews
                  required: "Review cannot be empty.",
                  // I enforce minimum 10 characters to ensure meaningful content
                  minLength: {
                    value: 10,
                    message: "Review must be at least 10 characters",
                  },
                }}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="review"
                    value={value}
                    onChange={onChange}
                    label="Your Review"
                    id="review"
                    // I make it multiline for comfortable review writing
                    multiline
                    // I set minimum 8 rows to provide ample writing space
                    minRows={8}
                    error={!!errors.review}
                    // I show error message if validation fails, otherwise show helpful guidance
                    helperText={
                      errors.review?.message ||
                      "Share your detailed thoughts (minimum 10 characters)"
                    }
                    inputProps={{
                      "aria-label": "Write your detailed movie review",
                      "aria-required": "true",
                    }}
                  />
                )}
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Submit Review
              </Button>
              {/* Reset Button */}
              <Button
                type="reset"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => {
                  // I reset the form fields to their default empty values
                  reset({
                    author: "",
                    review: "",
                  });
                  // I also reset the rating back to the default (3 - Average)
                  setRating(3);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ReviewForm;
