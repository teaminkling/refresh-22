import Work from "../../../data/core/Work";
import {WORKS_WITH_ARTIST_INDEX, WORKS_WITH_ID_INDEX, WORKS_WITH_WEEK_INDEX} from "../constants/kv";
import {ACTIVE_YEAR} from "../constants/setup";
import {createJsonResponse, createNotFoundResponse} from "../utils/http";
import {sanitize} from "../utils/io";

/**
 * Handlers for works endpoints.
 */

/**
 * Using search terms, retrieve the works.
 *
 * Full index retrieval is possible and acceptable as egress is not billed. It is just slow for
 * the user so the web client does not use it.
 *
 * Sorting and direct member searching is not possible through this endpoint. It is expected to
 * be done on the frontend as repeated changes of the sort and search would waste backend calls.
 *
 * Params pattern: ?year=<year>&week=<week>&artist=<artist>
 *
 * @param {URLSearchParams} params the search parameters
 * @param {Body} _body the unused body
 * @param {KVNamespace} kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const getWorks = async (
  params: URLSearchParams, _body: Body, kv: KVNamespace,
): Promise<Response> => {
  // Escape search terms (remove slashes).

  const year: string | null = sanitize(params.get("year"));
  const week: string | null = sanitize(params.get("week"));
  const artist: string | null = sanitize(params.get("artist"));

  // If the artist is present, that cancels the most results, so use that as search. Otherwise
  // use the week. If neither are present, we will squash the results down.

  const results: Work[] = [];
  if (artist) {
    const works_with_artist_index: Record<string, Work[]> = JSON.parse(
      (await kv.get(`${WORKS_WITH_ARTIST_INDEX}`)) || "{}",
    );

    (works_with_artist_index[artist] || []).forEach((work: Work) => {
      results.push(work);
    });
  } else {
    const works_with_week_index: Record<string, Work[]> = JSON.parse(
      (await kv.get(`${WORKS_WITH_WEEK_INDEX}`)) || "{}",
    );

    if (week) {
      // Use the active year if the year is not specified.

      (works_with_week_index[`${year || ACTIVE_YEAR}/${week}`] || []).forEach((work: Work) => {
        results.push(work);
      });
    } else {
      // The order of this output will be

      Object.keys(works_with_week_index).forEach(
        (key: string) => {
          works_with_week_index[key].forEach((work: Work) => results.push(work));
        }
      );
    }
  }

  return createJsonResponse();
};

/**
 * Retrieve a single post by ID.
 *
 * @param {URLSearchParams} params the search parameters
 * @param {Body} _body the unused body
 * @param {KVNamespace} kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const getWork = async (
  params: URLSearchParams, _body: Body, kv: KVNamespace,
): Promise<Response> => {
  const id: string | null = sanitize(params.get("id"));
  if (!id) {
    return createNotFoundResponse();
  }

  const works_with_id_index: Record<string, Work> = JSON.parse(
    (await kv.get(WORKS_WITH_ID_INDEX)) || "{}"
  );

  const work: Work | undefined | null = works_with_id_index[id];
  if (!work) {
    return createNotFoundResponse();
  }

  return createJsonResponse(JSON.stringify(work));
};

/**
 * Update a post in the database.
 *
 * Uses a rate limit of 2 edits per minute. We are not concerned about race conditions.
 *
 * @param {URLSearchParams} _params the unused search parameters
 * @param {Body} _body the body
 * @param {KVNamespace} _kv the key-value store
 * @returns {Promise<Response>} the response
 */
export const putWork = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  // Validate all data and ensure it is escaped for HTML.

  // Ensure the old work actually exists. Only update it if it does.

  // Edit the Discord post for this work (can fail without 500).

  return createJsonResponse();
};

/**
 * Add a work to the database.
 *
 * Uses a rate limit of 2 posts a minute.
 *
 * @param {URLSearchParams} _params
 * @param {Body} _body
 * @param {KVNamespace} _kv
 * @returns {Promise<Response>}
 */
export const postWork = async (
  _params: URLSearchParams, body: Request, _kv: KVNamespace,
): Promise<Response> => {
  // Parse the given JSON. Any JSON that is missing information or has too much will be
  // normalised. If the value is not found, an explicit "null" is placed down.

  // const unsafeJson: Record<string, never> = await body.json();
  // const safeJson: Record<string, unknown> = {};
  //
  // Object.keys(WorkKeys).forEach((key: string) => {
  //   safeJson[key] = unsafeJson[key] || null;
  // });
  //
  // // Now individually validate all of the inputs.
  //
  // const yearInvalid: boolean = safeJson.year !== ACTIVE_YEAR;
  //
  // // We will check out of range values for week numbers later.
  //
  // const weekNumbersInvalid: boolean = (
  //   !safeJson.weekNumbers || typeof safeJson.weekNumbers !== "object" || !safeJson[0]
  // );
  //
  // // TODO: confirm that the artist is the POSTing user.
  //
  // const artistInvalid: boolean = (
  //   !safeJson.artist || typeof safeJson.artist !== "string" || safeJson.artist.length > 128
  // );
  //
  // // Single character titles are allowed.
  //
  // const titleInvalid: boolean = (
  //   !safeJson.title || typeof safeJson.title !== "string" || safeJson.title.length > 128
  // );
  //
  // const mediumInvalid: boolean = (
  //   !safeJson.medium || typeof safeJson.medium !== "string" || safeJson.medium.length > 128
  // );
  //
  // const descriptionInvalid: boolean = (
  //   !safeJson.description
  //   || typeof safeJson.description !== "string"
  //   || safeJson.description.length > 2048
  // );
  //
  // // We will check individual URLs later.
  //
  // const urlsInvalid: boolean = (
  //   !safeJson.urls
  //   || typeof safeJson.urls
  // );
  //
  // // Since the types are valid, we can now consider the type a Work. Also, ensure the JSON is
  // still // valid before setting the value.  const work: Work =
  // JSON.parse(JSON.stringify(safeJson));  // All of the string types need to be validated for XSS
  // injection when spat back out to the // frontend (especially the description). Also validate
  // lengths.  // Escape the who  // Validate all data and ensure it is escaped for HTML.  //
  // Determine the ID for this post but otherwise create it.  // Post to Discord.

  return createJsonResponse(
    `{"response": "${body.body}"}`,
  );
};

// TODO: Rate limit: 8 uploads a minute.

export const postUpload = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace,
): Promise<Response> => {
  //

  return createJsonResponse();
};
