/**
 * Define HTTP entry points for this API worker.
 */

import {createRemoteJWKSet, FlattenedJWSInput, JWSHeaderParameters, jwtVerify} from "jose";
import {GetKeyFunction} from "jose/dist/types/types";
import {CORS_HEADERS} from "./constants/http";
import {getMeta, putArtist, putWeeks} from "./services/meta";
import {getWork, getWorks, postUpload, postWork, putWork} from "./services/works";
import {createNotFoundResponse} from "./utils/http";

/**
 * Handle an API request.
 *
 * @param {string} method the method name
 * @param {string} routine the routine name
 * @param {URLSearchParams} params the URL parameters
 * @param {Request} request the request
 * @param {KVNamespace} kv the main key-value store
 * @param {KVNamespace} authKv the auth key-value store
 * @param {string | null} identifier if provided, the recognised ID of the calling user
 * @returns {Promise<Response>} the response
 */
const handleRequest = (
  method: string,
  routine: string,
  params: URLSearchParams,
  request: Request,
  kv: KVNamespace,
  authKv: KVNamespace,
  identifier: string | null,
): Promise<Response> => {
  if (method === "get") {
    if (routine === "meta") {
      return getMeta(kv, authKv, identifier);
    } else if (routine === "works") {
      return getWorks(params, request, kv);
    } else if (routine === "work") {
      return getWork(params, request, kv);
    }
  } else if (method === "put") {
    if (routine === "weeks") {
      return putWeeks(request, kv, authKv, identifier);
    } else if (routine === "artist") {
      return putArtist(params, request, kv);
    } else if (routine === "work") {
      return putWork(params, request, kv);
    }
  } else if (method === "post") {
    if (routine === "work") {
      return postWork(params, request, kv);
    } else if (routine === "upload") {
      return postUpload(params, request, kv);
    }
  }

  return createNotFoundResponse();
};

/**
 * Handle a JWT and return an auth identifier.
 *
 * @param {string | null} jwt the JWT in condensed format, if applicable
 * @returns {string | null} if found, the auth identifier
 */
const handleJwt = async (jwt: string | null): Promise<string | null> => {
  if (jwt) {
    // Now that the JWT is decrypted, continue verifying it.

    const jwks: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = createRemoteJWKSet(
      new URL("https://refresh.au.auth0.com/.well-known/jwks.json")
    );

    const {payload} = await jwtVerify(jwt, jwks, {
      issuer: "https://refresh.au.auth0.com/", audience: "https://refresh.fiveclawd.com/api/"
    });

    // E.g., oauth2|discord|<id>

    const rawTokenParts: string[] | undefined = payload["sub"]?.split("|");
    const rawTokenLength: number | undefined = rawTokenParts?.length;

    // The end result should be a bunch of numbers only.

    if (rawTokenParts && rawTokenLength) {
      return rawTokenParts[rawTokenLength - 1] || null;
    }
  }

  return null;
};

/**
 * Define the following endpoints:
 *
 * - `GET /api/meta`
 *
 * In the active year (hardcoded), retrieve all artists and all weeks (and information). Artists
 * without any posts are not counted nor are weeks that haven't been published.
 *
 * If the user is authenticated and is staff, all of the posts are retrieved, not just the
 * redacted ones.
 *
 * - `PUT/POST /api/weeks?year=<year>`
 *
 * Update the weeks information all at once, including ordering information.
 *
 * This is a staff-only endpoint.
 *
 * - `PUT /api/artist?name=<name>`
 *
 * Edit the social media information for any given artist by name.
 *
 * - `GET /api/works?year=<year>&week=<week>&artist=<name>&sort=<sort>`
 *
 * Get works according to the search criteria.
 *
 * Internally, there are three indices: by ID, by week, and by artist. When neither the
 * week/year nor artist is provided, the weeks index is flattened (requires the theoretically
 * fewest KV reads) and the search is performed on the lowercase fields with spaces removed.
 *
 * - `GET /api/work?id=<id>`
 *
 * Retrieve a post directly.
 *
 * - `PUT /api/work?id=<id>`
 *
 * Idempotently edit a post by known ID.
 *
 * - `POST /api/work`
 *
 * Create a post.
 *
 * - `POST /api/upload`
 *
 * Retrieve a one-time upload URL.
 *
 * Notes:
 *
 * - Years supported by the system are so infrequently written, changes need to be done using a
 * code change.
 * - All PUT and POST requests are authenticated.
 * - Artist information is empty when they are first authenticated with Auth0. In these cases,
 *   the frontend must send a subsequent authenticated request to update their socials.
 */
const worker = {
  async fetch(request: Request, env: { REFRESH_KV: KVNamespace; AUTH_KV: KVNamespace }) {
    const method: string = request.method.toLowerCase();

    // Handle preflight request without handling JWT since it's not necessary.

    if (method === "options") {
      return new Response("{}", {headers: CORS_HEADERS});
    }

    // If there's a JWT, validate it.

    const jwt: string | null = (
      request.headers.get("Authorization")?.replace("Bearer ", "")?.trim()
    ) || null;

    const identifier: string | null = await handleJwt(jwt);

    // If it's a normal request, check the URL and handle normally.

    const url = new URL(request.url);
    const pathParts: string[] = url.pathname.split("/").filter(
      (part: string) => part && part !== "api"
    );

    return handleRequest(
      method, pathParts[0], url.searchParams, request, env.REFRESH_KV, env.AUTH_KV, identifier,
    );
  }
};

export default worker;
