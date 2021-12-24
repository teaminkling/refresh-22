import {createJsonResponse} from "../utils/http";

/**
 * Internal and external handlers for artist endpoints.
 */

export const getArtists = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

export const getArtist = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};

export const putArtist = (_params: URLSearchParams, _body: Body): Response => {
  return createJsonResponse();
};
