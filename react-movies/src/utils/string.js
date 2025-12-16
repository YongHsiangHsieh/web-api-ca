import truncate from "lodash/truncate";

/**
 * String manipulation utilities for common formatting and text processing tasks.
 *
 * I provide helper functions for formatting strings in ways that are commonly needed throughout
 * the application, such as truncating long text for display, capitalizing text, and converting
 * strings to title case. These utilities help ensure consistent text formatting across the UI.
 */

/**
 * Truncates a string to a maximum length with intelligent word-boundary breaking.
 *
 * I use lodash's truncate function with a custom separator pattern to intelligently break
 * text at word boundaries rather than in the middle of words. The separator pattern breaks
 * on spaces and preserves preceding commas and periods, ensuring that truncated text reads
 * naturally and maintains proper punctuation.
 *
 * @param {string} string - The string to truncate
 * @param {number} [maxLength=400] - The maximum length of the resulting string. Defaults to 400
 *                                   characters, which is a reasonable length for movie synopses
 *
 * @returns {string} The truncated string with an ellipsis (...) appended if truncation occurred.
 *                   If the original string is shorter than maxLength, it is returned unchanged.
 *
 * @example
 * const synopsis = "This is a very long movie synopsis...";
 * excerpt(synopsis, 100); // "This is a very long movie synopsis..."
 * excerpt(synopsis); // Uses default 400 character limit
 */
export function excerpt(string, maxLength = 400) {
  return truncate(string, {
    length: maxLength,
    separator: /,?\.* +/, // I separate by spaces, preserving preceding commas and periods for natural breaks
  });
}

/**
 * Capitalizes the first letter of a string.
 *
 * I convert the first character to uppercase and preserve the rest of the string unchanged.
 * I handle edge cases by checking if the string is empty before accessing characters.
 *
 * @param {string} string - The string to capitalize
 *
 * @returns {string} The string with the first letter capitalized, or an empty string if input is falsy
 *
 * @example
 * capitalizeFirst("hello"); // "Hello"
 * capitalizeFirst("world"); // "World"
 * capitalizeFirst(""); // ""
 */
export function capitalizeFirst(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts a string to title case (capitalizing the first letter of each word).
 *
 * I lowercase the entire string first, then split it into words by spaces, capitalize each
 * word individually using the capitalizeFirst function, and rejoin them with spaces. This
 * ensures consistent title case formatting regardless of the input case. I handle edge cases
 * by checking if the string is empty before processing.
 *
 * @param {string} string - The string to convert to title case
 *
 * @returns {string} The string with the first letter of each word capitalized, or an empty
 *                   string if input is falsy
 *
 * @example
 * toTitleCase("hello world"); // "Hello World"
 * toTitleCase("HELLO WORLD"); // "Hello World"
 * toTitleCase("hELLo wORLD"); // "Hello World"
 * toTitleCase(""); // ""
 */
export function toTitleCase(string) {
  if (!string) return "";
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}
