/**
 * Movie-specific utility functions for formatting, filtering, and manipulating movie data.
 *
 * I provide helper functions that handle common movie-related tasks such as standardizing
 * genre data formats, formatting runtime and currency values, constructing image URLs from
 * TMDB paths, extracting release years, and sorting movies by various criteria. These utilities
 * help normalize TMDB API responses and ensure consistent data formatting throughout the application.
 */

/**
 * Maps genre objects to genre IDs for consistent filtering compatibility.
 *
 * I solve a data inconsistency issue from the TMDB API. When fetching movie lists, the API
 * returns `genre_ids` (an array of numbers), but when fetching movie details, it returns `genres`
 * (an array of objects with id and name). I normalize this by converting the genres array to
 * genre_ids so that filtering logic works consistently regardless of which endpoint was used.
 *
 * @param {Object} movie - Movie object that may have either a `genres` array or `genre_ids` array
 *
 * @returns {Object} The movie object with a `genre_ids` property. If the movie already has
 *                   genre_ids, it is returned unchanged. If it has a genres array, genre_ids
 *                   is created from the genre IDs. If it has neither, the original movie is returned.
 *
 * @example
 * // From movie details endpoint (has genres array)
 * const movie = { id: 1, title: "Movie", genres: [{id: 28, name: "Action"}, {id: 12, name: "Adventure"}] };
 * mapMovieGenres(movie); // { id: 1, title: "Movie", genres: [...], genre_ids: [28, 12] }
 *
 * // From movie list endpoint (already has genre_ids)
 * const movie = { id: 1, title: "Movie", genre_ids: [28, 12] };
 * mapMovieGenres(movie); // { id: 1, title: "Movie", genre_ids: [28, 12] } (unchanged)
 */
export function mapMovieGenres(movie) {
  if (!movie) return movie;

  // I check if the movie already has genre_ids and return it unchanged if so
  if (movie.genre_ids) return movie;

  // I convert the genres array (from movie details) to genre_ids array
  if (movie.genres && Array.isArray(movie.genres)) {
    return {
      ...movie,
      genre_ids: movie.genres.map((g) => g.id),
    };
  }

  return movie;
}

/**
 * Formats movie runtime from minutes to a human-readable hours and minutes format.
 *
 * I convert minutes into a readable format like "2h 30m" or "90m". I handle edge cases where
 * runtime might be 0 or missing by returning "N/A", and I adjust the output format based on
 * whether the movie has hours only, minutes only, or both.
 *
 * @param {number} minutes - Runtime in minutes
 *
 * @returns {string} Formatted runtime string such as "2h 30m", "2h", "30m", or "N/A" if minutes is falsy
 *
 * @example
 * formatRuntime(150); // "2h 30m"
 * formatRuntime(120); // "2h"
 * formatRuntime(90); // "1h 30m"
 * formatRuntime(45); // "45m"
 * formatRuntime(0); // "N/A"
 */
export function formatRuntime(minutes) {
  if (!minutes) return "N/A";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // I return different formats based on what components are present
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
}

/**
 * Formats currency amounts using the browser's locale and a specified currency code.
 *
 * I use the Intl.NumberFormat API to format numbers as currency, which respects the user's
 * locale and ensures consistent formatting across different browsers. I round to the nearest
 * whole number (no decimal places) for cleaner movie budget/revenue display.
 *
 * @param {number} amount - The amount to format
 * @param {string} [currency="USD"] - ISO 4217 currency code (e.g., "USD", "EUR", "GBP")
 *
 * @returns {string} Formatted currency string (e.g., "$150,000,000") or "N/A" if amount is 0 or falsy
 *
 * @example
 * formatCurrency(150000000); // "$150,000,000"
 * formatCurrency(50000000, "EUR"); // "€50,000,000"
 * formatCurrency(0); // "N/A"
 * formatCurrency(null); // "N/A"
 */
export function formatCurrency(amount, currency = "USD") {
  if (!amount || amount === 0) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Constructs the full URL for a movie poster image from TMDB.
 *
 * I build the complete image URL by combining the TMDB image base URL with the poster path
 * and size parameter. The size parameter controls the resolution of the downloaded image,
 * allowing optimization for different contexts (thumbnails vs full-screen display).
 *
 * @param {string} posterPath - The poster path from TMDB API (e.g., "/path/to/poster.jpg")
 * @param {string} [size="w500"] - TMDB image size identifier. Common sizes are:
 *                                 "w92", "w154", "w185", "w342", "w500", "w780", "original"
 *
 * @returns {string|null} The full poster image URL or null if posterPath is not provided
 *
 * @example
 * getMoviePosterUrl("/kXfqcdQKsToCoj18UQYauwHSYiS.jpg");
 * // "https://image.tmdb.org/t/p/w500/kXfqcdQKsToCoj18UQYauwHSYiS.jpg"
 *
 * getMoviePosterUrl("/kXfqcdQKsToCoj18UQYauwHSYiS.jpg", "w780");
 * // "https://image.tmdb.org/t/p/w780/kXfqcdQKsToCoj18UQYauwHSYiS.jpg"
 */
export function getMoviePosterUrl(posterPath, size = "w500") {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}/${posterPath}`;
}

/**
 * Constructs the full URL for an actor profile image from TMDB.
 *
 * I build the complete profile image URL by combining the TMDB image base URL with the profile
 * path and size parameter. Similar to getMoviePosterUrl, this allows optimization for different
 * display contexts.
 *
 * @param {string} profilePath - The profile image path from TMDB API (e.g., "/path/to/profile.jpg")
 * @param {string} [size="w185"] - TMDB image size identifier. The default w185 is suitable for cast card displays
 *
 * @returns {string|null} The full profile image URL or null if profilePath is not provided
 *
 * @example
 * getActorProfileUrl("/AKPAUO7NGQWQDUPE7ZE47ZBYHYA.jpg");
 * // "https://image.tmdb.org/t/p/w185/AKPAUO7NGQWQDUPE7ZE47ZBYHYA.jpg"
 */
export function getActorProfileUrl(profilePath, size = "w185") {
  if (!profilePath) return null;
  return `https://image.tmdb.org/t/p/${size}${profilePath}`;
}

/**
 * Extracts the release year from a release date string.
 *
 * I parse the release date string (which comes from TMDB in YYYY-MM-DD format) and extract
 * just the year portion by splitting on the dash and taking the first element.
 *
 * @param {string} releaseDate - Release date in YYYY-MM-DD format (e.g., "2024-11-01")
 *
 * @returns {string} The release year as a string (e.g., "2024") or "N/A" if releaseDate is not provided
 *
 * @example
 * getMovieYear("2024-11-01"); // "2024"
 * getMovieYear("1999-03-31"); // "1999"
 * getMovieYear(""); // "N/A"
 */
export function getMovieYear(releaseDate) {
  if (!releaseDate) return "N/A";
  return releaseDate.split("-")[0];
}

/**
 * Sorts an array of movies by popularity in descending order (highest first).
 *
 * I create a new sorted array without modifying the original, and I provide a default value
 * of 0 for the popularity field in case it's missing, ensuring the function works even with
 * incomplete data.
 *
 * @param {Array} movies - Array of movie objects to sort
 *
 * @returns {Array} A new array of movies sorted by popularity (highest first), or an empty
 *                  array if the input is not an array
 *
 * @example
 * const movies = [
 *   { id: 1, title: "Movie A", popularity: 50 },
 *   { id: 2, title: "Movie B", popularity: 100 },
 *   { id: 3, title: "Movie C", popularity: 75 }
 * ];
 * sortMoviesByPopularity(movies);
 * // [{ id: 2, ... }, { id: 3, ... }, { id: 1, ... }]
 */
export function sortMoviesByPopularity(movies) {
  if (!Array.isArray(movies)) return [];
  return [...movies].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

/**
 * Sorts an array of movies by release date in descending order (newest first).
 *
 * I convert release_date strings to Date objects for proper chronological comparison, and I
 * provide a fallback value of 0 (which converts to epoch start) if release_date is missing,
 * ensuring incomplete data doesn't cause sorting errors.
 *
 * @param {Array} movies - Array of movie objects to sort
 *
 * @returns {Array} A new array of movies sorted by release date (newest first), or an empty
 *                  array if the input is not an array
 *
 * @example
 * const movies = [
 *   { id: 1, title: "Movie A", release_date: "2020-01-01" },
 *   { id: 2, title: "Movie B", release_date: "2024-01-01" },
 *   { id: 3, title: "Movie C", release_date: "2022-01-01" }
 * ];
 * sortMoviesByReleaseDate(movies);
 * // [{ id: 2, release_date: "2024-01-01" }, { id: 3, release_date: "2022-01-01" }, ...]
 */
export function sortMoviesByReleaseDate(movies) {
  if (!Array.isArray(movies)) return [];
  return [...movies].sort((a, b) => {
    const dateA = new Date(a.release_date || 0);
    const dateB = new Date(b.release_date || 0);
    return dateB - dateA;
  });
}

/**
 * Sorts an array of movies by TMDB rating in descending order (highest first).
 *
 * I compare vote_average values to sort movies, with higher-rated movies appearing first.
 * I provide a default value of 0 for missing ratings to ensure the function works with
 * incomplete data.
 *
 * @param {Array} movies - Array of movie objects to sort
 *
 * @returns {Array} A new array of movies sorted by rating (highest first), or an empty
 *                  array if the input is not an array
 *
 * @example
 * const movies = [
 *   { id: 1, title: "Movie A", vote_average: 7.5 },
 *   { id: 2, title: "Movie B", vote_average: 9.2 },
 *   { id: 3, title: "Movie C", vote_average: 8.1 }
 * ];
 * sortMoviesByRating(movies);
 * // [{ id: 2, vote_average: 9.2 }, { id: 3, vote_average: 8.1 }, { id: 1, vote_average: 7.5 }]
 */
export function sortMoviesByRating(movies) {
  if (!Array.isArray(movies)) return [];
  return [...movies].sort(
    (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
  );
}
