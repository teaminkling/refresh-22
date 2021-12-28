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

/**
 * Determine the short ID for a new work.
 *
 * @param {string} artistId the artist ID
 * @param {string[]} urls the URLs in the work
 */
export const determineShortId = async (artistId: string, urls: string[]): Promise<string> => {
  // Concatenate the key.

  const key: ArrayBuffer = new TextEncoder().encode(artistId + urls.join(", "));

  // Return the SHA256 hash of that key as a Base64 string.

  const hash: ArrayBuffer = await crypto.subtle.digest({name: "SHA-256"}, key);

  // The first three replaces are standard, but the last ones are specific to our application.

  return btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(hash)))
  ).replaceAll(
    /\+/g, "-"
  ).replaceAll(
    /\//g, "_"
  ).replaceAll(
    /=+$/g, ""
  ).replaceAll(
    /[^a-zA-Z0-9]/g, ""
  ).slice(
    0, 8
  ).toLowerCase();
};
