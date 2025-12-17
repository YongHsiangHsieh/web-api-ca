import React from "react";
import { useSearchParams } from "react-router";
import { useSearch } from "../hooks/useSearch";
import PageHeader from "../components/pageHeader";
import MovieCard from "../components/movieCard";
import CastCard from "../components/castCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

/**
 * Page component that displays search results for both movies and people.
 *
 * I retrieve the search query from the URL search parameters (the `q` parameter) and use it
 * to fetch matching movies and actors from the TMDB API. I handle several different states:
 * - Loading and error states are managed by the SearchState component
 * - If no query was entered, I display a message prompting the user to enter a search term
 * - If the query returns no results, I display a helpful "no results" message
 * - If results are found, I display movies and people in separate sections with appropriate grid layouts
 *
 * Each movie result includes an "Add to Favorites" action button, while people results display
 * cast cards that link to actor details pages.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying search results for movies and people,
 *                               with appropriate messages for empty queries and no results
 *
 * @example
 * // Used in routing configuration at path: /search?q=inception
 * import SearchResultsPage from './pages/searchResultsPage';
 * // The component automatically reads the 'q' parameter from the URL
 */
const SearchResultsPage = () => {
  // I extract the search query from the URL search parameters. If no 'q' parameter exists,
  // I default to an empty string, which will trigger the "enter a search query" message.
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // I fetch search results for both movies and people using the useSearch hook, which
  // handles the API calls and manages loading/error states through React Query.
  const { movies, people, SearchState } = useSearch(query);

  // I check if there's a loading or error state to display. The SearchState component
  // renders skeleton loaders while fetching or an error message if the fetch fails.
  // If either state exists, I return that component and exit early.
  const stateComponent = SearchState();
  if (stateComponent) return stateComponent;

  // I check if the user submitted an empty query and display a helpful prompt.
  if (!query) {
    return (
      <Grid container>
        <Grid size={12}>
          <PageHeader title="Search Results" />
        </Grid>
        <Grid size={12}>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Please enter a search query
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  // I check if the search returned any results. If neither movies nor people matched
  // the query, I display a helpful "no results" message with suggestions to try different keywords.
  const hasResults = movies.length > 0 || people.length > 0;
  if (!hasResults) {
    return (
      <Grid container>
        <Grid size={12}>
          <PageHeader title={`Search Results for "${query}"`} />
        </Grid>
        <Grid size={12}>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              No results found for "{query}"
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "rgba(255, 255, 255, 0.5)" }}>
              Try searching with different keywords
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  // I display search results in two separate sections if they exist. I render movies
  // in a responsive grid (3-4 columns on desktop, 2 on tablet, 1 on mobile) with an
  // "Add to Favorites" action for each movie. I render people in a tighter grid layout
  // (2-3 columns on desktop, 1-2 on tablet, 1 on mobile) using CastCard components.
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader title={`Search Results for "${query}"`} />
      </Grid>

      {movies.length > 0 && (
        <Grid size={12} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ mb: 2, color: "white" }}
          >
            🎬 Movies ({movies.length})
          </Typography>
          <Grid container spacing={2}>
            {movies.map((movie) => (
              <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MovieCard
                  movie={movie}
                  action={(movie) => <AddToFavoritesIcon movie={movie} />}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      {people.length > 0 && (
        <Grid size={12} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            sx={{ mb: 2, color: "white" }}
          >
            🎭 People ({people.length})
          </Typography>
          <Grid container spacing={2}>
            {people.map((person) => (
              <Grid key={person.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <CastCard actor={person} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default SearchResultsPage;
