/**
 * Internal and external handlers for week endpoints.
 */

import Joi, {ValidationResult} from "joi";
import {ACTIVE_YEAR, EDITORS} from "../../../data/constants/setup";
import Week, {WEEK_SCHEMA} from "../../../data/core/Week";
import {WEEKS} from "../constants/kv";
import Environment from "../types/environment";
import {postOrEditDiscordWeek} from "../utils/discord";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";

/**
 * Return the weeks information, redacting if the user signed in is not an authenticated user.
 *
 * Note that this may not be sorted.
 *
 * @param {Environment} env the workers environment
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const getWeeks = async (
  env: Environment, identifier?: string,
): Promise<Response> => {
  const weeks: Record<string, Week> = JSON.parse(
    (await env.REFRESH_KV.get(`${WEEKS}/${ACTIVE_YEAR}`)) || "{}"
  );

  let responseWeeks: Record<string, Week> = {};

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!isStaff) {
    Object.keys(weeks).forEach((key: string) => {
      const week: Week = weeks[key];

      if (week.isPublished) {
        responseWeeks[key] = week;
      }
    });
  } else {
    responseWeeks = weeks;
  }

  return createJsonResponse(JSON.stringify(responseWeeks), env.ALLOWED_ORIGIN);
};

/**
 * Edit information for all weeks at the same time.
 *
 * The body is expected to receive a JSON object of the form `{"weeks": []}`.
 *
 * This is an idempotent call and is not rate limited as it is authenticated to staff users
 * only. We are not concerned about race conditions.
 *
 * @param {Environment} env the workers environment
 * @param {Request} request the request
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putWeeks = async (
  env: Environment, request: Request, identifier?: string,
): Promise<Response> => {
  // Don't let anybody but a staff member call this endpoint.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!isStaff) {
    return createNotFoundResponse(env.ALLOWED_ORIGIN);
  }

  // Validate type and length and then escape the correct request variables. This is such that a
  // hijacked account can't be used to perform more disastrous effects on the backend.

  const input: Record<number, Week> = await request.json();
  const validation: ValidationResult = Joi.array().items(WEEK_SCHEMA).validate(
    Object.values(input),
  );

  if (validation.error) {
    return createBadRequestResponse(validation.error, env.ALLOWED_ORIGIN);
  }

  // Make the post first to save a write.

  for (const week of Object.values(input).filter((_week: Week) => _week.isPublished)) {
    const discordMessageId: string | null = await postOrEditDiscordWeek(
      week, env.WEEKS_DISCORD_URL,
    );
    if (discordMessageId) {
      week.discordId = discordMessageId;

      input[week.week] = week;
    }
  }

  // Update the weeks directly.

  await env.REFRESH_KV.put(`${WEEKS}/${ACTIVE_YEAR}`, JSON.stringify(input));

  return createJsonResponse("{}", env.ALLOWED_ORIGIN);
};
