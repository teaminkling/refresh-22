/**
 * Constants related to HTTP.
 */

/**
 * CORS headers for every request.
 */
export const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
});
