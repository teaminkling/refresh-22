import {createJsonResponse} from "../utils/http";

/**
 * Internal and external handlers for week endpoints.
 */

/**
 * Return the meta-information.
 *
 * @param {URLSearchParams} _params the unused params
 * @param {Body} _body the unused body
 * @param {KVNamespace} kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const getMeta = async (
  _params: URLSearchParams, _body: Body, kv: KVNamespace
): Promise<Response> => {
  const meta: string | null = await kv.get("meta/2022");

  // Assume trustworthy data and simply return the payload.

  return createJsonResponse(meta || undefined);
};

/**
 * Edit information for all weeks at the same time.
 *
 * This is an idempotent call and is not rate limited as it is authenticated to staff users only.
 *
 * @param {URLSearchParams} _params
 * @param {Body} _body
 * @param {KVNamespace} _kv
 * @returns {Response}
 */
export const putWeeks = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace
): Promise<Response> => {
  // Validate type and length and then escape the correct request variables.

  // Ensure that any weeks with a post associated with it doesn't have their order changed.

  // Update the meta directly.

  return createJsonResponse();
};

// TODO: Rate limit: 8 changes per 30 minutes (most aggressive in codebase).

/**
 * Edit the username and/or social media information for any given artist by (current) name.
 *
 * This is an idempotent call.
 *
 * @param {URLSearchParams} _params
 * @param {Body} _body
 * @param {KVNamespace} _kv
 * @returns {Promise<>Response>}
 */
export const putArtist = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace
): Promise<Response> => {
  // Validate type and length and escape the correct request variables.

  // Determine if the username has been changed.

  // Determine if the new username is already taken.

  // If the username has changed from last time and is unique, update (4 writes):

  // 1. The week to work index so the username present in the payloads is swapped.
  // 2. The artist to work index such that the new username is a key to the existing payload.
  // 3. The artist to work index such that the old key no longer has a payload.
  // 4. The ID to work index such that the username present in the payloads is swapped.

  // Update the socials for this user if they have changed (skip a write if they haven't).

  return createJsonResponse();
};
