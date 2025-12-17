import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import MyListPage from "./pages/myListPage";
import MovieReviewPage from "./pages/movieReviewPage";
import PopularMoviesPage from "./pages/popularMoviesPage";
import TopRatedMoviesPage from "./pages/topRatedMoviesPage";
import NowPlayingMoviesPage from "./pages/nowPlayingMoviesPage";
import ActorDetailsPage from "./pages/actorDetailsPage";
import SearchResultsPage from "./pages/searchResultsPage";
import SiteHeader from "./components/siteHeader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MoviesContextProvider from "./contexts/moviesContext";
import AuthContextProvider from "./contexts/authContext";
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import ProtectedRoute from "./components/protectedRoute";
import FestiveBanner from "./components/festiveBanner";
import Snowfall from "./components/snowfall";
import { ROUTES } from "./constants/routes";
import theme from "./theme";

/**
 * Application entry point that sets up the entire Moodvy movie application.
 *
 * I configure and initialize all the essential providers, context managers, and routing
 * infrastructure that the application needs to function. This includes React Query for
 * data fetching and caching, Material-UI theming for consistent styling, React Router for
 * navigation, a custom MoviesContext for managing user movie collections, and AuthContext
 * for user authentication.
 */

/**
 * React Query configuration for managing API calls and caching.
 *
 * I create a QueryClient with custom default options optimized for the application:
 * - staleTime (360000ms = 6 hours): Cached data is considered fresh for 6 hours
 * - refetchInterval (360000ms = 6 hours): Automatically refresh data every 6 hours
 * - refetchOnWindowFocus: false: Don't refetch when user returns to the window (prevents unnecessary API calls)
 *
 * These settings balance between keeping data fresh and minimizing API calls to reduce load.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Main application component that orchestrates all providers and routing.
 *
 * I wrap the application in multiple providers:
 * 1. QueryClientProvider - Enables React Query functionality throughout the app
 * 2. ThemeProvider - Applies Material-UI theme for consistent styling
 * 3. CssBaseline - Normalizes CSS across browsers
 * 4. BrowserRouter - Enables React Router functionality
 * 5. AuthContextProvider - Makes authentication state available everywhere
 * 6. SiteHeader - Global header component visible on all pages
 * 7. MoviesContextProvider - Makes user movie collections available everywhere
 * 8. Routes - Defines all application routes and their components
 * 9. ReactQueryDevtools - Development tool for debugging React Query (only in dev)
 *
 * Provider Order Notes:
 * - AuthContextProvider is inside BrowserRouter so it can use navigation
 * - AuthContextProvider wraps SiteHeader so header can access auth state
 * - MoviesContextProvider is inside so it can potentially use auth state in future
 *
 * Protected Routes:
 * - /movies/my-list (MyListPage) - requires authentication
 * - /reviews/form (AddMovieReviewPage) - requires authentication
 *
 * @returns {React.ReactElement} The complete application component with all providers and routes
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* 🎄 Holiday snowfall animation - visible above content */}
        <Snowfall />
        {/* 🎄 Winter atmosphere - subtle dark gradient background */}
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
        <BrowserRouter>
          <AuthContextProvider>
            <SiteHeader />
            {/* 🎄 Holiday banner - appears below header on all pages */}
            <FestiveBanner />
            <MoviesContextProvider>
              {/* I define all application routes here. Each route maps a path to a page component.
                  Routes are organized by feature (auth, movies, reviews, actors, search) for clarity. */}
              <Routes>
                {/* Authentication Routes - Public */}
                <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.AUTH.SIGNUP} element={<SignupPage />} />

                {/* Protected Routes - Require Authentication */}
                <Route
                  path={ROUTES.MOVIES.MY_LIST}
                  element={
                    <ProtectedRoute>
                      <MyListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.REVIEWS.FORM}
                  element={
                    <ProtectedRoute>
                      <AddMovieReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* Public Routes - No Authentication Required */}
                <Route
                  path={ROUTES.MOVIES.UPCOMING}
                  element={<UpcomingMoviesPage />}
                />
                <Route
                  path={ROUTES.MOVIES.POPULAR}
                  element={<PopularMoviesPage />}
                />
                <Route
                  path={ROUTES.MOVIES.TOP_RATED}
                  element={<TopRatedMoviesPage />}
                />
                <Route
                  path={ROUTES.MOVIES.NOW_PLAYING}
                  element={<NowPlayingMoviesPage />}
                />
                <Route path={ROUTES.REVIEWS.VIEW} element={<MovieReviewPage />} />
                <Route path={ROUTES.MOVIES.DETAILS} element={<MoviePage />} />
                <Route
                  path={ROUTES.ACTORS.DETAILS}
                  element={<ActorDetailsPage />}
                />
                <Route
                  path={ROUTES.SEARCH.RESULTS}
                  element={<SearchResultsPage />}
                />
                <Route path={ROUTES.HOME} element={<HomePage />} />

                {/* I redirect any unmatched routes to the home page to prevent 404 errors */}
                <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
              </Routes>
            </MoviesContextProvider>
          </AuthContextProvider>
        </BrowserRouter>
        </Box>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

/**
 * Renders the React application to the DOM.
 *
 * I find the root HTML element by its ID and create a React root using the createRoot API
 * (the modern React 18+ rendering approach). Then I render the App component into that root,
 * which initializes the entire application with all providers and routing.
 */
const rootElement = createRoot(document.getElementById("root"));
rootElement.render(<App />);
