/**
 * Define HTTP entry points for this API worker.
 */

import {createRemoteJWKSet, FlattenedJWSInput, JWSHeaderParameters, jwtVerify} from "jose";
import {GetKeyFunction} from "jose/dist/types/types";
import {CORS_HEADERS} from "./constants/http";
import {getArtists, putArtist} from "./services/artists";
import {getWeeks, putWeeks} from "./services/weeks";
import {getWork, getWorks, postUpload, putWork} from "./services/works";
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
const handleRequest = async (
  method: string,
  routine: string,
  params: URLSearchParams,
  request: Request,
  kv: KVNamespace,
  authKv: KVNamespace,
  identifier: string | null,
): Promise<Response> => {
  switch (`${method.toLowerCase()}/${routine.toLowerCase()}`) {
    case ("get/weeks"):
      return getWeeks(kv, authKv, identifier);
    case ("get/artists"):
      return getArtists(kv);
    case ("get/works"):
      return getWorks(params, kv, authKv, identifier);
    case ("get/work"):
      return getWork(params, request, kv);
    case ("put/weeks"):
      return putWeeks(request, kv, authKv, identifier);
    case ("put/artist"):
      return putArtist(request, kv, authKv, identifier);
    case ("put/work"):
      return putWork(request, kv, authKv, identifier);
    case ("post/upload"):
      return postUpload(params, request, kv);
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
 * The main Cloudflare Worker for this backend project.
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
