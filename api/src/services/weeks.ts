/**
 * Internal and external handlers for week endpoints.
 */

import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Week from "../../../data/core/Week";
import {WEEKS} from "../constants/kv";
import {validateIsStaff} from "../utils/auth";
import {createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Return the weeks information, redacting if the user signed in is not an authenticated user.
 *
 * Note that this may not be sorted.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const getWeeks = async (
  kv: KVNamespace, authKv: KVNamespace, identifier: string | null,
): Promise<Response> => {
  const weeks: Record<string, Week> = JSON.parse(
    (await kv.get(`${WEEKS}/${ACTIVE_YEAR}`)) || "{}"
  );

  let values: Week[] = Object.values(weeks);

  const isStaff: boolean = identifier ? await validateIsStaff(identifier, authKv) : false;
  if (!isStaff) {
    values = values.filter((week: Week) => week.isPublished);
  }

  return createJsonResponse(JSON.stringify(values));
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

  const input: Record<number, Week> = await request.json();

  // Update the weeks directly.

  await kv.put(`${WEEKS}/${ACTIVE_YEAR}`, JSON.stringify(input));

  return createJsonResponse();
};
