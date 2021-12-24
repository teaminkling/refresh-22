import {createJsonResponse} from "../utils/http";

/**
 * Internal and external handlers for week endpoints.
 */

export const getPosts = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

export const getPost = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

/**
 * Edit an existing post.
 *
 * @param {URLSearchParams} params the params
 * @param {Body} body the body
 * @returns {Response}
 */
export const putPost = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

/**
 * Create a post.
 *
 * @param {URLSearchParams} params the params
 * @param {Body} body the body
 * @returns {Response} the response
 */
export const postPost = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

/**
 * Retrieve a one-time upload URL from Backblaze B2 via S3 API.
 *
 * @param {URLSearchParams} params the params
 * @returns {Response} the response
 */
export const postUpload = (_params: URLSearchParams): Response => {
  return createJsonResponse();
};
