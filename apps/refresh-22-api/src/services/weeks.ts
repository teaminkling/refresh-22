import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Week from "../../../data/core/Week";
import {WEEKS} from "../constants/kv";
import Environment from "../types/environment";
import {createJsonResponse} from "../utils/http";

export const getWeeks = async (
  env: Environment,
): Promise<Response> => {
  const weeks: Record<string, Week> = JSON.parse(
    (await env.REFRESH_KV.get(`${WEEKS}/${ACTIVE_YEAR}`)) || "{}"
  );

  const responseWeeks: Record<string, Week> = {};
  Object.keys(weeks).forEach((key: string) => {
    const week: Week = weeks[key];

    if (week.isPublished) {
      responseWeeks[key] = week;
    }
  });

  return createJsonResponse(JSON.stringify(responseWeeks), env.ALLOWED_ORIGIN);
};
