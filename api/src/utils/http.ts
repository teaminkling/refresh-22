/**
 * Utils related to HTTP.
 */

/**
 * Create a JSON response with the given body.
 *
 * @param {BodyInit} body the body
 * @returns {Response} the JSON response
 */
export const createJsonResponse = (body?: BodyInit): Response => {
  return new Response(body || "{}", {
    headers: {"Content-Type": "application/json"},
  });
};
