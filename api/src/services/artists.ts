import {ACTIVE_YEAR, EDITORS} from "../../../data/constants/setup";
import Artist from "../../../data/core/Artist";
import {ARTISTS} from "../constants/kv";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Return the artists.
 *
 * Note that this is not deterministically sorted.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} the response
 */
export const getArtists = async (kv: KVNamespace, origin?: string): Promise<Response> => {
  const artists: Record<string, Artist> = JSON.parse(
    (await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  return createJsonResponse(JSON.stringify(Object.values(artists)), origin);
};

/**
 * Edit the username and/or social media information for any given artist by (current) name.
 *
 * This is an idempotent call. We are not concerned about race conditions, though in this case
 * they can certainly happen. The rate limit is set to 8 changes per 30 minutes, which is the
 * most aggressive rate limit in the codebase.
 *
 * @param {Request} request the request
 * @param {KVNamespace} kv the main key-value store
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putArtist = async (
  request: Request, kv: KVNamespace, origin?: string, identifier?: string,
): Promise<Response> => {
  // Validate type and length and escape the correct request variables.

  // TODO

  const input: Artist = await request.json();

  // Only allow the owner of the artist object or a staff member perform mutations on the object.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!identifier || !isStaff && identifier !== input.discordId) {
    return createNotFoundResponse(origin);
  }

  // Retrieve the artist.

  const rawBackendArtist: string | null = await kv.get(`${ARTISTS}/${input.discordId}`);
  const backendArtist: Artist | undefined = (
    rawBackendArtist ? JSON.parse(rawBackendArtist) : undefined
  );

  // Determine if the username has been changed.

  const isUsernameChanged: boolean = (
    backendArtist ? input.name !== backendArtist.name : true
  );

  // If the username has changed from last time and is unique, update it.

  if (isUsernameChanged && backendArtist) {
    return createBadRequestResponse("New username is taken.", origin);
  }

  // Update the aggregate list. May result in race condition.

  const aggregateArtists: Record<string, Artist> = JSON.parse(
    await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`) || "{}"
  );

  aggregateArtists[input.discordId] = input;

  await kv.put(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(aggregateArtists));

  // Also put it in a guaranteed consistent call.

  await kv.put(`${ARTISTS}/${identifier}`, JSON.stringify(input));

  return createJsonResponse("{}", origin);
};
