/**
 * Utils related to HTTP.
 */

/**
 * @param {string} origin the origin, if it is known
 * @returns {Headers} the CORS headers
 */
export const generateCorsHeaders = (origin?: string) => {
  return new Headers({
    "Access-Control-Allow-Origin": origin || "https://refresh.fiveclawd.com",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  });
};

/**
 * Create a JSON response with the given body.
 *
 * @param {BodyInit | undefined} body the body
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} the JSON response
 */
export const createJsonResponse = async (body?: BodyInit, origin?: string): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of generateCorsHeaders(origin).entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    body || "{}", {headers: newHeaders}
  );
};

/**
 * Create a 404 response.
 *
 * Sometimes this is returned instead of a different 400-class exception to make it harder to
 * perform a path traversal or brute force path enumeration attack.
 *
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} a 404 response
 */
export const createNotFoundResponse = async (origin?: string): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of generateCorsHeaders(origin).entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    "{\"status\": \"Not Found.\"}", {status: 404, headers: newHeaders}
  );
};

/**
 * Create a 400 response.
 *
 * Warning: do **not** add variables into the message! They should be generic deliberately.
 *
 * @param {string} message a trusted error message
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} a 400 response with a message
 */
export const createBadRequestResponse = async (
  message: string, origin?: string
): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of generateCorsHeaders(origin).entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    `{"status": "${message}"}`, {status: 400, headers: newHeaders}
  );
};
