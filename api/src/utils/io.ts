/**
 * Utils related to I/O.
 */

/**
 * Remove slashes and slash escapes in any user input to prevent path traversal
 *
 * @param {string | null} text the text
 * @returns {string | null} the sanitised text
 */
export const sanitize = (text: string | null): string | null => {
  if (!text) {
    return null;
  }

  return text.replaceAll("/", "").replaceAll("%2f", "");
};
