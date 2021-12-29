/**
 * Utils for dealing with the API.
 */

import Meta from "../data/composite/Meta";

/**
 * The domain used for the API calls.
 *
 * Will always fallback to production if the development environment variable is not set.
 */
const API_DOMAIN: string = (
  (process.env.NODE_ENV === "development")
    ? "http://localhost:8787/api" : "https://refresh.fiveclawd.com/api"
);

/**
 * Retrieve the meta-information from the backend.
 *
 * @param {string} token the access token
 * @returns {Promise<Meta>} the meta-information
 */
export const getMeta = async (token: string): Promise<Meta> => {
  const url = `${API_DOMAIN}/meta`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(response);

  return response.json();
};
