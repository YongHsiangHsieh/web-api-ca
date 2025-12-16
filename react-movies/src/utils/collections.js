/**
 * Generic collection management utilities for managing arrays of IDs.
 *
 * I provide reusable functions that work with any collection of IDs (favorites, must-watch lists, etc.).
 * This eliminates code duplication by centralizing common collection operations like adding, removing,
 * and checking membership, while avoiding duplicate entries in the collection.
 */

/**
 * Creates a set of collection handler functions for managing an array of IDs.
 *
 * I return an object containing methods to manipulate a collection of IDs. These handlers
 * encapsulate common operations like adding items (with duplicate prevention), removing items,
 * checking if an item exists, retrieving all items, and clearing the collection. Each handler
 * takes an item object and extracts its ID for the collection operation.
 *
 * @param {Array} collection - The current collection array containing item IDs
 * @param {Function} setCollection - The React state setter function for updating the collection
 *
 * @returns {Object} An object containing the following handler methods:
 *   - {Function} add - Adds an item to the collection (prevents duplicates)
 *   - {Function} remove - Removes an item from the collection by its ID
 *   - {Function} has - Checks if an item exists in the collection
 *   - {Function} getAll - Returns all IDs currently in the collection
 *   - {Function} clear - Clears the entire collection
 *
 * @example
 * // Basic usage in a component
 * const [favorites, setFavorites] = useState([]);
 * const favoriteHandlers = createCollectionHandlers(favorites, setFavorites);
 *
 * // Add a movie to favorites
 * favoriteHandlers.add({ id: 550, title: 'Fight Club' });
 *
 * // Check if movie is favorited
 * if (favoriteHandlers.has({ id: 550 })) {
 *   console.log('Movie is in favorites');
 * }
 *
 * // Remove from favorites
 * favoriteHandlers.remove({ id: 550 });
 */
export const createCollectionHandlers = (collection, setCollection) => {
  return {
    /**
     * Adds an item to the collection if it's not already present.
     *
     * I check if the item ID already exists in the collection before adding it. If it does,
     * I return the current collection unchanged, preventing duplicates. If it doesn't exist,
     * I add the item ID to the end of the collection array. This is useful for favorites
     * or must-watch lists where duplicate entries should not occur.
     *
     * @param {Object} item - The item to add (must have an 'id' property)
     * @returns {void} Updates the collection state
     */
    add: (item) => {
      setCollection((prev) => {
        if (prev.includes(item.id)) {
          return prev;
        }
        return [...prev, item.id];
      });
    },

    /**
     * Removes an item from the collection by its ID.
     *
     * I filter out the item with the matching ID from the collection array, removing it
     * completely. If the item doesn't exist, the collection remains unchanged.
     *
     * @param {Object} item - The item to remove (must have an 'id' property)
     * @returns {void} Updates the collection state
     */
    remove: (item) => {
      setCollection((prev) => prev.filter((id) => id !== item.id));
    },

    /**
     * Checks whether an item exists in the collection.
     *
     * I search for the item ID in the collection array and return true if it's present,
     * false otherwise. This is useful for determining whether to show "add" or "remove"
     * buttons in the UI.
     *
     * @param {Object} item - The item to check for (must have an 'id' property)
     * @returns {boolean} True if the item is in the collection, false otherwise
     */
    has: (item) => {
      return collection.includes(item.id);
    },

    /**
     * Gets all item IDs currently in the collection.
     *
     * I return the entire collection array, allowing callers to iterate over or inspect
     * all items in the collection.
     *
     * @returns {Array} The array of all item IDs in the collection
     */
    getAll: () => {
      return collection;
    },

    /**
     * Clears all items from the collection.
     *
     * I empty the collection by setting it to an empty array. This is useful for reset
     * operations or when a user wants to clear their entire list.
     *
     * @returns {void} Updates the collection state to an empty array
     */
    clear: () => {
      setCollection([]);
    },
  };
};
