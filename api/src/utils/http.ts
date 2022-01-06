/**
 * Utils related to HTTP.
 */

import {ValidationError} from "joi";

/**
 * @param {string} origin the single allowed origin, if it is known
 * @returns {Headers} the CORS headers
 */
export const generateCorsHeaders = (origin?: string) => {
  return new Headers({
    "Access-Control-Allow-Origin": origin || "https://refresh.fiveclawd.com",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  });
};

export const createGenericResponse = (
  body?: BodyInit, origin?: string, status?: number,
) => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of generateCorsHeaders(origin).entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    body || "{}", {headers: newHeaders, status: status},
  );
};

export const createJsonResponse = async (body?: BodyInit, origin?: string): Promise<Response> => {
  return createGenericResponse(body, origin);
};

export const createNotFoundResponse = async (origin?: string): Promise<Response> => {
  return createGenericResponse(JSON.stringify({
    "message": "Not Found",
    "details": null,
    "_original": [],
  }), origin, 404);
};

/**
 * Create a 400 response.
 *
 * Warning: do **not** add variables into the message! They should be generic deliberately.
 *
 * @param {string} error an error response
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} a 400 response with a message
 */
export const createBadRequestResponse = async (
  error: ValidationError, origin?: string
): Promise<Response> => {
  return createGenericResponse(JSON.stringify(
    {
      "message": error.message,
      "details": error.details,
      "_original": error._original,
    }
  ), origin, 400);
};

/**
 * Create a 403 response.
 *
 * @param {string} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} a 403 response
 */
export const createForbiddenResponse = async (
  origin?: string
): Promise<Response> => {
  return createGenericResponse(JSON.stringify({
    "message": "Forbidden",
    "details": null,
    "_original": [],
  }), origin, 403);
};
