import {ValidationError, ValidationResult} from "joi";
import {ACTIVE_YEAR, EDITORS} from "../../../data/constants/setup";
import Artist, {ARTIST_SCHEMA} from "../../../data/core/Artist";
import {ARTISTS} from "../constants/kv";
import Environment from "../types/environment";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Return the artists.
 *
 * Note that this is not deterministically sorted.
 *
 * @param {Environment} env the workers environment
 * @returns {Promise<Response>} the response
 */
export const getArtists = async (env: Environment): Promise<Response> => {
  const artists: Record<string, Artist> = JSON.parse(
    (await env.REFRESH_KV.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  return createJsonResponse(JSON.stringify(artists), env.ALLOWED_ORIGIN);
};

/**
 * Edit the username and/or social media information for any given artist by (current) name.
 *
 * This is an idempotent call. We are not concerned about race conditions, though in this case
 * they can certainly happen. The rate limit is set to 8 changes per 30 minutes, which is the
 * most aggressive rate limit in the codebase.
 *
 * @param {Environment} env the workers environment
 * @param {Request} request the request
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putArtist = async (
  env: Environment, request: Request, identifier?: string,
): Promise<Response> => {
  // Validate type and length and escape the correct request variables.

  const input: Artist = await request.json();
  const validation: ValidationResult = ARTIST_SCHEMA.validate(input);

  if (validation.error) {
    return createBadRequestResponse(validation.error, env.ALLOWED_ORIGIN);
  }

  // Only allow the owner of the artist object or a staff member perform mutations on the object.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!identifier || !isStaff && identifier !== input.discordId) {
    return createNotFoundResponse(env.ALLOWED_ORIGIN);
  }

  // Retrieve the artist.

  const rawBackendArtist: string | null = await env.REFRESH_KV.get(
    `${ARTISTS}/${input.discordId}`,
  );

  const backendArtist: Artist | undefined = (
    rawBackendArtist ? JSON.parse(rawBackendArtist) : undefined
  );

  // Determine if the username has been changed.

  const isUsernameChanged: boolean = (
    backendArtist ? input.name !== backendArtist.name : true
  );

  // If the username has changed from last time and is unique, update it.

  if (isUsernameChanged && backendArtist) {
    return createBadRequestResponse(
      new ValidationError("New username is taken!", null, null),
      env.ALLOWED_ORIGIN,
    );
  }

  // Update the aggregate list. May result in race condition.

  const aggregateArtists: Record<string, Artist> = JSON.parse(
    await env.REFRESH_KV.get(`${ARTISTS}/${ACTIVE_YEAR}`) || "{}"
  );

  aggregateArtists[input.discordId] = input;

  await env.REFRESH_KV.put(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(aggregateArtists));

  // Also put it in a guaranteed consistent call.

  await env.REFRESH_KV.put(`${ARTISTS}/${identifier}`, JSON.stringify(input));

  return createJsonResponse("{}", env.ALLOWED_ORIGIN);
};
