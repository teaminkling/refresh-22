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

  // CORS headers must be present on every successful request.

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
 * @returns {Promise<Response>} a 404 response
 */
export const createNotFoundResponse = async (): Promise<Response> => new Response(
  "{\"status\": \"Not Found.\"}", {
    status: 404, headers: {
      "Content-Type": "application/json"
    }
  }
);
