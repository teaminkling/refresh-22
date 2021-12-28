import Meta from "../../../data/composite/Meta";
import Artist from "../../../data/core/Artist";
import Week from "../../../data/core/Week";
import {META} from "../constants/kv";
import {ACTIVE_YEAR} from "../constants/setup";
import {validateIsStaff} from "../utils/auth";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Internal and external handlers for week endpoints.
 */

/**
 * Return the meta-information, redacting if the user signed in is not an authenticated user.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const getMeta = async (
  kv: KVNamespace, authKv: KVNamespace, identifier: string | null,
): Promise<Response> => {
  const rawMeta: string = (await kv.get(`${META}/${ACTIVE_YEAR}`)) || "{}";
  if (rawMeta === "{}") {
    throw new Error(
      "The meta variable has not been set up for the first time!"
    );
  }

  const output: Record<string, unknown> = {};

  const meta: Meta = JSON.parse(rawMeta);

  output["artists"] = meta.artists;

  // Redact unpublished weeks if not a staff member. Recall also that all artists on this list
  // have already definitely published at least one piece or were manually added.

  const isStaff: boolean = identifier ? await validateIsStaff(identifier, authKv) : false;
  if (isStaff) {
    output["weeks"] = meta.weeks;
  } else {
    const filteredEntries: [string, Week][] = Object.entries(meta.weeks).filter(
      ([_id, week]: [string, Week]) => week.isPublished
    );

    output["weeks"] = Object.fromEntries(filteredEntries);
  }

  return createJsonResponse(JSON.stringify(output) || undefined);
};

/**
 * Edit information for all weeks at the same time.
 *
 * The body is expected to receive a JSON object of the form `{"weeks": []}`.
 *
 * This is an idempotent call and is not rate limited as it is authenticated to staff users
 * only. We are not concerned about race conditions.
 *
 * @param {Request} request the request
 * @param {KVNamespace} kv the main key-value store
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putWeeks = async (
  request: Request, kv: KVNamespace, authKv: KVNamespace, identifier: string | null,
): Promise<Response> => {
  // Don't let anybody but a staff member call this endpoint.

  const isStaff: boolean = identifier ? await validateIsStaff(identifier, authKv) : false;
  if (!isStaff) {
    return createNotFoundResponse();
  }

  // Validate type and length and then escape the correct request variables. This is such that a
  // hijacked account can't be used to perform more disastrous effects on the backend.

  // TODO

  const input: Meta = await request.json();

  // Update the meta directly.

  const rawMeta: string = (await kv.get(`${META}/${ACTIVE_YEAR}`)) || "{}";
  if (rawMeta === "{}") {
    throw new Error(
      "The meta variable has not been set up for the first time!"
    );
  }

  const meta: Meta = JSON.parse(rawMeta);

  meta.weeks = input.weeks;

  await kv.put(`${META}/${ACTIVE_YEAR}`, JSON.stringify(meta));

  return createJsonResponse();
};

/**
 * Edit the username and/or social media information for any given artist by (current) name.
 *
 * This is an idempotent call. We are not concerned about race conditions, though in this case
 * they can certainly happen. The rate limit is set to 8 changes per 30 minutes, which is the
 * most aggressive rate limit in the codebase.
 *
 * @param {Request} request
 * @param {KVNamespace} kv
 * @param {KVNamespace} authKv
 * @param {string | null} identifier
 * @returns {Promise<Response>}
 */
export const putArtist = async (
  request: Request, kv: KVNamespace, authKv: KVNamespace, identifier: string | null,
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

  const rawMeta: string = (await kv.get(`${META}/${ACTIVE_YEAR}`)) || "{}";
  if (rawMeta === "{}") {
    throw new Error(
      "The meta variable has not been set up for the first time!"
    );
  }

  const meta: Meta = JSON.parse(rawMeta);
  const backendArtist: Artist = meta.artists[input.discordId];

  // Determine if the username has been changed.

  const isUsernameChanged: boolean = input.name !== backendArtist.name;

  // If the username has changed from last time and is unique, update it.

  if (isUsernameChanged && meta.artists[input.name]) {
    return createBadRequestResponse("New username is taken!");
  } else if (isUsernameChanged) {
    backendArtist.name = input.name;
  }

  // Update the socials for this user.

  backendArtist.socials = input.socials;
  meta.artists[input.discordId] = backendArtist;

  // Perform the actual write. Yeah, this is race condition central. Doesn't matter: this is not
  // meant to be frequently called and we're working for free here. If we wanted to improve
  // this, maybe we could use a mutex on Upstash/Redis or use a Durable Object, but we're
  // explicitly working for free here.

  await kv.put(`${META}/${ACTIVE_YEAR}`, JSON.stringify(meta));

  return createJsonResponse();
};
