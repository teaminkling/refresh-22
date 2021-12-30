import {Redis} from "ioredis";
import Redlock from "redlock";
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
 * @param {Redis} redisClient the Redis client
 * @param {Redlock} redlock the Redis distributed lock client
 * @param {KVNamespace} kv the main key-value store
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putArtist = async (
  request: Request,
  redisClient: Redis,
  redlock: Redlock,
  kv: KVNamespace,
  authKv: KVNamespace,
  identifier: string | null,
): Promise<Response> => {
  // Validate type and length and escape the correct request variables.

  // TODO

  const input: Artist = await request.json();

  // Only allow the owner of the artist object or a staff member perform mutations on the object.

  const isStaff: boolean = identifier ? await validateIsStaff(identifier, authKv) : false;
  if (!isStaff || identifier !== input.discordId) {
    return createNotFoundResponse();
  }

  // Retrieve the object.

  const response = redlock.using(["adding_artist"], 5000, async () => {
    const artists: Record<string, Artist> = JSON.parse(
      (await redisClient.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
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

    await redisClient.set(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(artists));

    return createJsonResponse();
  });

  // Write back to the KV store.

  redisClient.get(`${ARTISTS}/${ACTIVE_YEAR}`).then(
    async (rawArtists: string | null) => {
      if (rawArtists) {
        await kv.put(`${ARTISTS}/${ACTIVE_YEAR}`, rawArtists);
      }
    }
  );

  return response;
};
