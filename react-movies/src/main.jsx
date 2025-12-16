import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import { ROUTES } from "./constants/routes";
import theme from "./theme";

/**
 * Application entry point that sets up the entire Moodvy movie application.
 *
 * I configure and initialize all the essential providers, context managers, and routing
 * infrastructure that the application needs to function. This includes React Query for
 * data fetching and caching, Material-UI theming for consistent styling, React Router for
 * navigation, and a custom MoviesContext for managing user movie collections.
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
 * 5. SiteHeader - Global header component visible on all pages
 * 6. MoviesContextProvider - Makes user movie collections available everywhere
 * 7. Routes - Defines all application routes and their components
 * 8. ReactQueryDevtools - Development tool for debugging React Query (only in dev)
 *
 * @returns {React.ReactElement} The complete application component with all providers and routes
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <SiteHeader />
          <MoviesContextProvider>
            {/* I define all application routes here. Each route maps a path to a page component.
                Routes are organized by feature (movies, reviews, actors, search) for clarity. */}
            <Routes>
              <Route path={ROUTES.MOVIES.MY_LIST} element={<MyListPage />} />
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
              <Route
                path={ROUTES.REVIEWS.FORM}
                element={<AddMovieReviewPage />}
              />
              {/* I redirect any unmatched routes to the home page to prevent 404 errors */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
            </Routes>
          </MoviesContextProvider>
        </BrowserRouter>
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
