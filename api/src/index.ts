/**
 * Define HTTP entry points for this API worker.
 */

import IORedis from "ioredis";
import Redis from "ioredis";
import {createRemoteJWKSet, FlattenedJWSInput, JWSHeaderParameters, jwtVerify} from "jose";
import {GetKeyFunction} from "jose/dist/types/types";
import Redlock from "redlock";
import {CORS_HEADERS} from "./constants/http";
import {REDIS_URI} from "./constants/kv";
import {getMeta, putArtist, putWeeks} from "./services/meta";
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
  if (method === "get") {
    if (routine === "meta") {
      return getMeta(kv, authKv, identifier);
    } else if (routine === "works") {
      return getWorks(params, kv, authKv, identifier);
    } else if (routine === "work") {
      return getWork(params, request, kv);
    }
  } else if (method === "put") {
    if (routine === "weeks") {
      return putWeeks(request, kv, authKv, identifier);
    } else if (routine === "artist") {
      return putArtist(request, kv, authKv, identifier);
    } else if (routine === "work") {
      // A Redis client is needed since this endpoint is the only one that requires protection
      // from race conditions. The information from Redis is immediately read and copied back to
      // Cloudflare KV.

      const redisUri: string | null = await authKv.get(REDIS_URI);
      if (!redisUri) {
        throw new Error("No Redis URI has been set up.");
      }

      const redisClient: IORedis.Redis = new Redis(redisUri);

      // The Redis client uses Redlock to obtain distributed locks.

      const redlock: Redlock = new Redlock([redisClient]);

      return putWork(request, redisClient, redlock, kv, authKv, identifier);
    }
  } else if (method === "post") {
    if (routine === "upload") {
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
