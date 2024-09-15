import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Work from "../../../data/core/Work";
import {
  WORKS_WITH_ARTIST_INDEX,
  WORKS_WITH_ID_INDEX,
  WORKS_WITH_WEEK_INDEX,
  WORKS_WITHOUT_INDEX
} from "../constants/kv";
import Environment from "../types/environment";
import {createJsonResponse, createNotFoundResponse} from "../utils/http";
import {sanitize} from "../utils/io";

const workRetrievalPredicate = (isSeekingUnapproved: boolean, work: Work) => {
  if (work.isApproved) {
    // If they're not staff, the post is approved. If they're not seeking unapproved work,
    // they're seeking approved work. Unless the previous two conditions are met (are staff and
    // want unapproved) then the work must be approved, so the third condition can't be met.

    if (!isSeekingUnapproved) {
      // If undefined, this will coerce to true anyway.

      return !work.isSoftDeleted;
    }
  }

  return false;
};

export const getWorks = async (
  env: Environment, params: URLSearchParams,
): Promise<Response> => {
  // Escape search terms (remove slashes).

  const year: string | null = sanitize(params.get("year")) || ACTIVE_YEAR.toString();
  const week: string | null = sanitize(params.get("week"));
  const artistId: string | null = sanitize(params.get("artistId"));

  // Note the variable name doesn't match the GET name.

  const isSeekingUnapproved: boolean = (
    ["1", "true"].includes(sanitize(params.get("isUnapproved"))?.toLowerCase() || "???")
  );

  // If the artist is present, that cancels the most results, so use that as search. Otherwise,
  // use the week. If neither are present, use all posts in the list.

  const results: Record<string, Work> = {};
  if (artistId) {
    const works_with_artist_index: Record<string, Work> = JSON.parse(
      (await env.REFRESH_KV.get(`${WORKS_WITH_ARTIST_INDEX}/${artistId}`)) || "[]",
    );

    Object.values(works_with_artist_index).filter(
      (work: Work) => workRetrievalPredicate(isSeekingUnapproved, work)
    ).forEach((work: Work) => results[work.id] = work);
  } else if (week) {
    const works_with_week_index: Record<string, Work> = JSON.parse(
      (await env.REFRESH_KV.get(`${WORKS_WITH_WEEK_INDEX}/${year}/${week}`)) || "[]",
    );

    Object.values(works_with_week_index).filter(
      (work: Work) => workRetrievalPredicate(isSeekingUnapproved, work)
    ).forEach((work: Work) => results[work.id] = work);
  } else {
    const works_without_index: Work[] = JSON.parse(
      (await env.REFRESH_KV.get(`${WORKS_WITHOUT_INDEX}`)) || "[]"
    );

    works_without_index.filter(
      (work: Work) => workRetrievalPredicate(isSeekingUnapproved, work)
    ).forEach((work: Work) => results[work.id] = work);
  }

  return createJsonResponse(JSON.stringify(results), env.ALLOWED_ORIGIN);
};

export const getWork = async (
  env: Environment, params: URLSearchParams,
): Promise<Response> => {
  const id: string | null = sanitize(params.get("id"));
  if (!id || id === "undefined") {
    return createNotFoundResponse(env.ALLOWED_ORIGIN);
  }

  const work: Work = JSON.parse(
    (await env.REFRESH_KV.get(`${WORKS_WITH_ID_INDEX}/${id}`)) || "{}"
  );

  if (!work?.id || work.isSoftDeleted) {
    return createNotFoundResponse(env.ALLOWED_ORIGIN);
  }

  return createJsonResponse(JSON.stringify({[work.id]: work}), env.ALLOWED_ORIGIN);
};
