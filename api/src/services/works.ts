import {ValidationError} from "joi";
import {ACTIVE_YEAR, EDITORS, LAST_ACTIVE_WEEK} from "../../../data/constants/setup";
import Work from "../../../data/core/Work";
import {
  WORKS_WITH_ARTIST_INDEX,
  WORKS_WITH_ID_INDEX,
  WORKS_WITH_WEEK_INDEX,
  WORKS_WITHOUT_INDEX
} from "../constants/kv";
import {createBadRequestResponse, createJsonResponse, createNotFoundResponse} from "../utils/http";
import {determineShortId, sanitize} from "../utils/io";
import {placeWork} from "../utils/kv";

/**
 * Handlers for works endpoints.
 */

/**
 * Using search terms, retrieve the works.
 *
 * Full index retrieval is possible and acceptable as egress is not billed. It is just slow for
 * the user so the web client does not use it.
 *
 * Unpublished works are not included in the output.
 *
 * Sorting and direct member searching is not possible through this endpoint. It is expected to
 * be done on the frontend as repeated changes of the sort and search would waste backend calls.
 *
 * Params pattern: `?year=<year>&week=<week>&artistId=<artist>`
 *
 * @param {URLSearchParams} params the search parameters
 * @param {KVNamespace} kv the main key-value store
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const getWorks = async (
  params: URLSearchParams, kv: KVNamespace, origin?: string, identifier?: string,
): Promise<Response> => {
  // Escape search terms (remove slashes).

  const year: string | null = sanitize(params.get("year")) || ACTIVE_YEAR.toString();
  const week: string | null = sanitize(params.get("week"));
  const artistId: string | null = sanitize(params.get("artistId"));

  // If the artist is present, that cancels the most results, so use that as search. Otherwise
  // use the week. If neither are present, use all posts in the list.

  let results: Work[] = [];
  if (artistId) {
    const works_with_artist_index: Record<string, Work> = JSON.parse(
      (await kv.get(`${WORKS_WITH_ARTIST_INDEX}/${artistId}`)) || "[]",
    );

    Object.values(works_with_artist_index).forEach((work: Work) => results.push(work));
  } else if (week) {
    const works_with_week_index: Record<string, Work> = JSON.parse(
      (await kv.get(`${WORKS_WITH_WEEK_INDEX}/${year}/${week}`)) || "[]",
    );

    Object.values(works_with_week_index).forEach((work: Work) => results.push(work));
  } else {
    const works_without_index: Work[] = JSON.parse(
      (await kv.get(`${WORKS_WITHOUT_INDEX}`)) || "[]"
    );

    works_without_index.forEach((work: Work) => results.push(work));
  }

  // The output currently has all works, not just published ones. Check the auth now. If it's
  // not a staff user, remove things from the output. No need to check for ownership: if the
  // requesting user called this, their posts should be in local storage already.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!isStaff) {
    results = results.filter((result: Work) => result.isApproved);
  }

  return createJsonResponse(JSON.stringify({data: results}), origin);
};

/**
 * Retrieve a single post by ID.
 *
 * There is no authentication check.
 *
 * @param {URLSearchParams} params the search parameters
 * @param {Body} _body the unused body
 * @param {KVNamespace} kv the key-value store
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @returns {Promise<Response>} the response
 */
export const getWork = async (
  params: URLSearchParams, _body: Body, kv: KVNamespace, origin?: string
): Promise<Response> => {
  const id: string | null = sanitize(params.get("id"));
  if (!id) {
    return createNotFoundResponse(origin);
  }

  const work: Work | undefined | null = JSON.parse(
    (await kv.get(`${WORKS_WITH_ID_INDEX}/${id}`)) || "{}"
  );

  if (!work) {
    return createNotFoundResponse(origin);
  }

  return createJsonResponse(JSON.stringify({data: work}), origin);
};

/**
 * Perform the work for the {@link putWork} function.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {Work} work the work
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
const updateWorkIndices = async (
  kv: KVNamespace, work: Work, origin?: string, identifier?: string,
): Promise<Response> => {
  // Try to retrieve an existing work. Note we are using the definitely consistent Redis DB.

  const rawBackendWork: string | null = await kv.get(
    `${WORKS_WITH_ID_INDEX}/${work.id}`
  );

  const backendWork: Work | null = rawBackendWork ? JSON.parse(rawBackendWork) : null;

  // Verify poster is either the same as the one in the work or is a staff member.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!isStaff || work.artistId !== identifier) {
    return createNotFoundResponse(origin);
  }

  // Determine the work ID.

  let effectiveId: string = work.id;
  if (!backendWork) {
    // Work doesn't exist. Determine what the ID should be, ignoring what the user put. If the
    // client is valid, the ID will be some kind of random string.

    const newId: string = await determineShortId(work.artistId, work.urls);

    // This isn't very robust, but we don't ever expect anything to ever collide.

    if (await kv.get(`${WORKS_WITH_ID_INDEX}/${newId}`)) {
      throw new Error("Collision error! This requires developer intervention.");
    }

    effectiveId = newId;
  }

  // Important: all our validations are for nothing if we don't make sure we re-set this ID.

  work.id = effectiveId;

  await placeWork(kv, work);

  return createJsonResponse("{}", origin);
};

/**
 * Create or update a post in the database.
 *
 * The ID provided by the user is used to find an existing post. If it doesn't exist, the ID is
 * ignored and generated by the backend.
 *
 * This is an idempotent endpoint whether or not a post already exists. It uses a rate limit of 2
 * edits per minute. We are not concerned about race conditions.
 *
 * @param {Request} request the request
 * @param {KVNamespace} kv the main key-value store
 * @param {string | undefined} origin the allowed origin for the CORS headers
 * @param {string | undefined} identifier the identifier of the calling user
 * @returns {Promise<Response>} the response
 */
export const putWork = async (
  request: Request, kv: KVNamespace, origin?: string, identifier?: string,
): Promise<Response> => {
  // Ensure user is authenticated at all before doing any other CPU computation.

  if (!identifier) {
    return createNotFoundResponse(origin,);
  }

  // TODO: Remove temporary measure that prevents use of this endpoint.

  const isStaff: boolean = identifier ? EDITORS.includes(identifier) : false;
  if (!identifier || !isStaff) {
    return createNotFoundResponse(origin);
  }

  // Validate all data and ensure it is escaped for HTML.

  // TODO

  const input: Work = await request.json();

  // Before doing expensive work, ensure that there is at least one week and it appears within
  // the range of acceptable weeks in the active year.

  if (!input.weekNumbers || input.weekNumbers.map(
    (weekNumber: number) => weekNumber <= 0 || weekNumber > LAST_ACTIVE_WEEK)
  ) {
    return createBadRequestResponse(
      new ValidationError(
        "Week numbers must have at least one valid value, and all values must be valid.",
        null,
        null,
      ),
      origin,
    );
  }

  // Generate the thumbnail for this post if it's not explicitly provided.

  if (!input.thumbnailUrl) {
    // TODO
  }

  // Acquire a distributed lock and perform work. Only one user can add a work at the same time.

  const response = await updateWorkIndices(kv, input, origin, identifier);

  // Edit the Discord post for this work (can fail without 500).

  console.log("shut up, sonar");

  // TODO

  return response;
};

// TODO: Rate limit: 8 uploads a minute.

export const postUpload = async (
  _params: URLSearchParams, _body: Body, _kv: KVNamespace, origin?: string
): Promise<Response> => {

  // TODO

  return createJsonResponse(origin);
};
