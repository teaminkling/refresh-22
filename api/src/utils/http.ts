/**
 * Utils related to HTTP.
 */

import {CORS_HEADERS} from "../constants/http";

/**
 * Create a JSON response with the given body.
 *
 * @param {BodyInit | undefined} body the body
 * @returns {Promise<Response>} the JSON response
 */
export const createJsonResponse = async (body?: BodyInit): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of CORS_HEADERS.entries()) {
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
 * @returns {Promise<Response>} a 404 response
 */
export const createNotFoundResponse = async (): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of CORS_HEADERS.entries()) {
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
 * @returns {Promise<Response>} a 400 response with a message
 */
export const createBadRequestResponse = async (message: string): Promise<Response> => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of CORS_HEADERS.entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    `{"status": "${message}"}`, {status: 400, headers: newHeaders}
  );
};
