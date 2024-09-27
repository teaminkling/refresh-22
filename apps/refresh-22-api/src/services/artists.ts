import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Artist from "../../../data/core/Artist";
import {ARTISTS} from "../constants/kv";
import Environment from "../types/environment";
import {createJsonResponse} from "../utils/http";

export const getArtists = async (env: Environment): Promise<Response> => {
  const artists: Record<string, Artist> = JSON.parse(
    (await env.REFRESH_KV.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  return createJsonResponse(JSON.stringify(artists), env.ALLOWED_ORIGIN);
};
