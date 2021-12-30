import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Artist from "../../../data/core/Artist";
import {ARTISTS} from "../constants/kv";
import {validateIsStaff} from "../utils/auth";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Return the artists.
 *
 * Note that this is not deterministically sorted.
 *
 * @param {KVNamespace} kv the main key-value store
 * @returns {Promise<Response>} the response
 */
export const getArtists = async (
  kv: KVNamespace
): Promise<Response> => {
  const artists: Record<string, Artist> = JSON.parse(
    (await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  return createJsonResponse(JSON.stringify(Object.values(artists)));
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
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putArtist = async (
  request: Request,
  kv: KVNamespace,
  authKv: KVNamespace,
  identifier: string | null,
): Promise<Response> => {
  // Validate type and length and escape the correct request variables.

  // TODO

  const input: Artist = await request.json();

  // Only allow the owner of the artist object or a staff member perform mutations on the object.

  const isStaff: boolean = identifier ? await validateIsStaff(identifier, authKv) : false;
  if (!identifier || !isStaff || identifier !== input.discordId) {
    return createNotFoundResponse();
  }

  // Retrieve the aggregate object.

  const artists: Record<string, Artist> = JSON.parse(
    (await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  const backendArtist: Artist = artists[input.discordId];

  // Determine if the username has been changed.

  const isUsernameChanged: boolean = input.name !== backendArtist.name;

  // If the username has changed from last time and is unique, update it.

  if (isUsernameChanged && artists[input.name]) {
    return createBadRequestResponse("New username is taken.");
  } else if (isUsernameChanged) {
    backendArtist.name = input.name;
  }

  // Update the socials for this user.

  backendArtist.socials = input.socials;
  artists[input.discordId] = backendArtist;

  await kv.put(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(artists));

  // Also put it in a guaranteed consistent call.

  await kv.put(`${ARTISTS}/${identifier}`, JSON.stringify(artists));

  return createJsonResponse();
};
