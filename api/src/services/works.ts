import {createJsonResponse} from "../utils/http";

/**
 * Internal and external handlers for week endpoints.
 */

/**
 * Using search terms, retrieve the works.
 *
 * Full index retrieval is possible and acceptable as egress is not billed. It is just slow for
 * the user so the web client does not use it.
 *
 * @param {URLSearchParams} _params the search parameters
 * @param {Body} _body the unused body
 * @param {KVNamespace} _kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const getWorks = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  return createJsonResponse();
};

/**
 * Retrieve a single post by ID.
 *
 * @param {URLSearchParams} _params the search parameters
 * @param {Body} _body the unused body
 * @param {KVNamespace} _kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const getWork = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  // Validate ID and escape it.

  // Determine if escaped ID is in the KV store.

  return createJsonResponse();
};

// TODO: Rate limit: 2 edits a minute.

/**
 * Update a post.
 *
 * @param {URLSearchParams} _params
 * @param {Body} _body
 * @param {KVNamespace} _kv
 * @returns {Promise<Response>}
 */
export const putWork = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  // Validate all data and ensure it is escaped for HTML.

  // Ensure the old work actually exists. Only update it if it does.

  // Edit the Discord post for this work (can fail without 500).

  return createJsonResponse();
};

// TOOD: Rate limit: 2 works a minute.

export const postWork = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  // Validate all data and ensure it is escaped for HTML.

  // Determine the ID for this post but otherwise create it.

  // Post to Discord.

  return createJsonResponse();
};

// TODO: Rate limit: 8 uploads a minute.

export const postUpload = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  //

  return createJsonResponse();
};
