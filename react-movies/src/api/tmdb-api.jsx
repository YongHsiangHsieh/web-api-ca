import {
  apiClient,
  extractIdFromQueryKey,
  extractSearchQueryFromQueryKey,
} from "./client";

/**
 * TMDB API Integration Module
 *
 * This module provides a collection of functions that interface with The Movie Database (TMDB) API.
 * I designed this module to centralize all API calls, making them easier to maintain, test, and update.
 *
 * Key Features:
 * - I use a centralized apiClient for consistent error handling and request configuration
 * - I extract parameters from React Query's queryKey using helper functions to maintain clean code
 * - I organize functions by resource type (movies, people, search) for logical grouping
 * - All functions return Promise-based responses from the apiClient
 *
 * @module tmdb-api
 * @requires ./client - Provides apiClient and utility functions for API calls
 */

/**
 * Fetches a curated list of discover movies for the homepage.
 *
 * I call the discover endpoint to get a broad selection of movies, which provides
 * better variety than a single category. I exclude adult content and videos to ensure
 * a family-friendly default listing.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of movies with their metadata (title, poster, rating, etc.)
 *
 * @example
 * const movies = await getMovies();
 * console.log(movies.results); // Array of movie objects
 */
export const getMovies = () => {
  return apiClient("/discover/movie", {
    params: {
      include_adult: false,
      include_video: false,
      page: 1,
    },
  });
};

/**
 * Fetches a list of upcoming movies.
 *
 * I retrieve movies that are scheduled for future theatrical release. This data is useful
 * for displaying "coming soon" sections to help users discover movies they can look forward to.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of upcoming movies with release dates and metadata
 *
 * @example
 * const upcoming = await getUpcomingMovies();
 * console.log(upcoming.results[0].release_date); // Future date
 */
export const getUpcomingMovies = () => {
  return apiClient("/movie/upcoming", {
    params: {
      page: 1,
    },
  });
};

/**
 * Fetches a list of currently popular movies.
 *
 * I retrieve movies that are trending and gaining popularity based on user activity.
 * This endpoint provides an up-to-date snapshot of what audiences are watching and
 * discussing across the globe.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of popular movies sorted by relevance
 *
 * @example
 * const popular = await getPopularMovies();
 * console.log(popular.results); // Most popular movies currently
 */
export const getPopularMovies = () => {
  return apiClient("/movie/popular", {
    params: {
      page: 1,
    },
  });
};

/**
 * Fetches a list of top-rated movies.
 *
 * I call the top_rated endpoint to retrieve movies with the highest user ratings.
 * I use this for displaying curated lists of critically acclaimed and well-received films
 * that users might want to prioritize watching.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of top-rated movies sorted by average rating (highest first)
 *
 * @example
 * const topRated = await getTopRatedMovies();
 * console.log(topRated.results[0].vote_average); // High rating value
 */
export const getTopRatedMovies = () => {
  return apiClient("/movie/top_rated", {
    params: {
      page: 1,
    },
  });
};

/**
 * Fetches a list of movies currently in theaters.
 *
 * I retrieve movies that are actively playing in cinemas right now. This is different from
 * upcoming movies because these are available for immediate viewing. I use this data to
 * show users what theatrical releases they can watch today.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of movies currently playing in cinemas
 *
 * @example
 * const nowPlaying = await getNowPlayingMovies();
 * console.log(nowPlaying.results); // Movies in theaters now
 */
export const getNowPlayingMovies = () => {
  return apiClient("/movie/now_playing", {
    params: {
      page: 1,
    },
  });
};

/**
 * Fetches trending movies for the current week.
 *
 * I call the trending endpoint to get movies that are currently gaining buzz and attention.
 * I use the "week" time window to show what's trending in the near term, which helps
 * users discover movies that are generating excitement right now.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated list
 *                             of trending movies from the past week
 *
 * @example
 * const trending = await getTrendingMovies();
 * console.log(trending.results); // Movies trending this week
 */
export const getTrendingMovies = () => {
  return apiClient("/trending/movie/week", {
    params: {
      page: 1,
    },
  });
};

/**
 * Fetches detailed information about a specific movie by its ID.
 *
 * I extract the movie ID from the React Query queryKey parameter to retrieve comprehensive
 * details about a single movie. This is used when displaying a movie's detail page with
 * all available information (genres, runtime, budget, revenue, plot summary, etc.).
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array where the first element is the movie ID.
 *                                 Format: [movieId] or ['movie', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing comprehensive
 *                             movie details including genres, runtime, budget, revenue, and more
 *
 * @example
 * const movie = await getMovie({ queryKey: [123] }); // Movie ID: 123
 * console.log(movie.title, movie.overview);
 */
export const getMovie = (args) => {
  const id = extractIdFromQueryKey(args.queryKey);
  return apiClient(`/movie/${id}`);
};

/**
 * Fetches all available movie genres.
 *
 * I retrieve the complete list of genres that TMDB uses to categorize movies. I cache
 * this data as it rarely changes, making it ideal for filtering and categorizing
 * movie collections in the application.
 *
 * @function
 * @returns {Promise<Object>} A promise resolving to the API response containing an array
 *                             of genre objects with id and name properties
 *
 * @example
 * const genreData = await getGenres();
 * console.log(genreData.genres); // [{ id: 28, name: "Action" }, ...]
 */
export const getGenres = () => {
  return apiClient("/genre/movie/list");
};

/**
 * Fetches poster and promotional images for a specific movie.
 *
 * I extract the movie ID from React Query's queryKey and retrieve all associated images.
 * I use this data to display movie posters, backdrops, and other promotional artwork
 * in the user interface.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the movie ID.
 *                                 Format: [movieId] or ['movieImages', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing arrays of
 *                             poster images, backdrops, and other promotional artwork
 *
 * @example
 * const images = await getMovieImages({ queryKey: [456] }); // Movie ID: 456
 * console.log(images.posters); // Array of poster objects
 */
export const getMovieImages = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/movie/${id}/images`);
};

/**
 * Fetches user reviews for a specific movie.
 *
 * I extract the movie ID from React Query's queryKey and retrieve all user-submitted
 * reviews. I use this to display community feedback and opinions about movies, helping
 * users make informed viewing decisions.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the movie ID.
 *                                 Format: [movieId] or ['reviews', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing an array
 *                             of review objects with author, content, and rating information
 *
 * @example
 * const reviews = await getMovieReviews({ queryKey: [789] }); // Movie ID: 789
 * console.log(reviews.results); // Array of review objects
 */
export const getMovieReviews = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/movie/${id}/reviews`);
};

/**
 * Fetches the cast and crew information for a specific movie.
 *
 * I extract the movie ID from React Query's queryKey to retrieve all credits associated
 * with a movie. This includes actors, directors, producers, cinematographers, and other
 * key crew members involved in the film's production.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the movie ID.
 *                                 Format: [movieId] or ['credits', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing cast and crew
 *                             arrays with names, roles, and profile images
 *
 * @example
 * const credits = await getMovieCredits({ queryKey: [101] }); // Movie ID: 101
 * console.log(credits.cast); // Array of cast members
 * console.log(credits.crew); // Array of crew members
 */
export const getMovieCredits = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/movie/${id}/credits`);
};

/**
 * Fetches movies recommended based on a specific movie.
 *
 * I extract the movie ID from React Query's queryKey to retrieve TMDB's algorithmic
 * recommendations. I use this feature to suggest similar movies that users might enjoy
 * based on the current movie they're viewing.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the movie ID.
 *                                 Format: [movieId] or ['recommendations', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing an array
 *                             of recommended movies with their basic information
 *
 * @example
 * const recommendations = await getMovieRecommendations({ queryKey: [202] }); // Movie ID: 202
 * console.log(recommendations.results); // Array of recommended movies
 */
export const getMovieRecommendations = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/movie/${id}/recommendations`);
};

/**
 * Fetches movies similar to a specific movie.
 *
 * I extract the movie ID from React Query's queryKey to retrieve movies that are similar
 * in genre, theme, or style. While recommendations are based on popularity, I use this
 * endpoint to find movies with similar characteristics that users might also enjoy.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the movie ID.
 *                                 Format: [movieId] or ['similar', movieId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing an array
 *                             of similar movies with their basic information
 *
 * @example
 * const similar = await getMovieSimilar({ queryKey: [303] }); // Movie ID: 303
 * console.log(similar.results); // Array of similar movies
 */
export const getMovieSimilar = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/movie/${id}/similar`);
};

/**
 * Fetches detailed information about a specific person (actor, director, etc.) by their ID.
 *
 * I extract the person ID from React Query's queryKey to retrieve comprehensive details
 * about an actor or crew member. This includes their biography, birth/death dates, profile
 * image, and other career information.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the person ID.
 *                                 Format: [personId] or ['person', personId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing person details
 *                             including biography, birth date, profile image, and more
 *
 * @example
 * const actor = await getPersonDetails({ queryKey: [500] }); // Person ID: 500
 * console.log(actor.name, actor.biography);
 */
export const getPersonDetails = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/person/${id}`);
};

/**
 * Fetches the filmography (movie credits) for a specific person.
 *
 * I extract the person ID from React Query's queryKey to retrieve all movies that a person
 * has appeared in or worked on. This is commonly called a filmography and includes their
 * role, character name, and other details about each film appearance.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the person ID.
 *                                 Format: [personId] or ['personCredits', personId]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing an array
 *                             of movie credits with character names and release dates
 *
 * @example
 * const filmography = await getPersonMovieCredits({ queryKey: [500] }); // Person ID: 500
 * console.log(filmography.cast); // Array of movies they appeared in
 */
export const getPersonMovieCredits = ({ queryKey }) => {
  const id = extractIdFromQueryKey(queryKey);
  return apiClient(`/person/${id}/movie_credits`);
};

/**
 * Searches for movies by a query string.
 *
 * I extract the search query from React Query's queryKey and use it to find matching movies.
 * I exclude adult content by default to maintain a family-friendly search experience. The results
 * are paginated with the first page always being returned.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the search query.
 *                                 Format: ['searchMovies', queryString] or ['movieSearch', queryString]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated array
 *                             of movies matching the search query with relevance ranking
 *
 * @example
 * const results = await searchMovies({ queryKey: ['movies', 'The Matrix'] });
 * console.log(results.results); // Array of matching movies
 */
export const searchMovies = ({ queryKey }) => {
  const query = extractSearchQueryFromQueryKey(queryKey);
  return apiClient("/search/movie", {
    params: {
      query: query,
      page: 1,
      include_adult: false,
    },
  });
};

/**
 * Searches for people (actors, directors, etc.) by a query string.
 *
 * I extract the search query from React Query's queryKey to find people in the TMDB database.
 * I exclude adult content and return paginated results with the most relevant matches first.
 * This is useful for finding actors, directors, and other crew members.
 *
 * @function
 * @param {Object} args - React Query arguments object
 * @param {Array} args.queryKey - React Query key array containing the search query.
 *                                 Format: ['searchPeople', queryString] or ['peopleSearch', queryString]
 *
 * @returns {Promise<Object>} A promise resolving to the API response containing a paginated array
 *                             of people matching the search query with relevance ranking
 *
 * @example
 * const results = await searchPeople({ queryKey: ['people', 'Tom Hanks'] });
 * console.log(results.results); // Array of matching actors/directors
 */
export const searchPeople = ({ queryKey }) => {
  const query = extractSearchQueryFromQueryKey(queryKey);
  return apiClient("/search/person", {
    params: {
      query: query,
      page: 1,
      include_adult: false,
    },
  });
};
