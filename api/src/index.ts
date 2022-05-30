import {createRemoteJWKSet, FlattenedJWSInput, JWSHeaderParameters, jwtVerify} from "jose";
import {GetKeyFunction} from "jose/dist/types/types";
import {getArtists, putArtist} from "./services/artists";
import {getWeeks, putWeeks} from "./services/weeks";
import {deleteWork, getWork, getWorks, postApprove, postUpload, putWork} from "./services/works";
import Environment from "./types/environment";
import {createNotFoundResponse, generateCorsHeaders} from "./utils/http";

/**
 * Handle an API request.
 *
 * @param {Environment} env the workers environment
 * @param {string} method the method name
 * @param {string} routine the routine name
 * @param {URLSearchParams} params the URL parameters
 * @param {Request} request the request
 * @param {string | undefined} identifier if provided, the recognised ID of the calling user
 * @returns {Promise<Response>} the response
 */
const handleRequest = async (
  env: Environment,
  method: string,
  routine: string,
  params: URLSearchParams,
  request: Request,
  identifier?: string,
): Promise<Response> => {
  if (!env.REFRESH_KV) {
    return new Response(JSON.stringify({
      "message": "Server is undergoing maintenance. Please try again in 10 seconds.",
      "details": null,
      "_original": [],
    }), {status: 503});
  }

  switch (`${method.toLowerCase()}/${routine.toLowerCase()}`) {
    case ("get/weeks"):
      return getWeeks(env, identifier);
    case ("get/artists"):
      return getArtists(env);
    case ("get/works"):
      return getWorks(env, params, identifier);
    case ("get/work"):
      // Note the slight spelling difference: "s".

      return getWork(env, params);
    case ("put/weeks"):
      return putWeeks(env, request, identifier);
    case ("put/artist"):
      return putArtist(env, request, identifier);
    case ("put/work"):
      return putWork(env, request, identifier);
    case ("post/upload"):
      return postUpload(env, request, identifier);
    case ("post/approve"):
      return postApprove(env, request, identifier);
    case ("delete/work"):
      return deleteWork(env, request, identifier);
  }

  return createNotFoundResponse();
};

/**
 * Handle a JWT and return an auth identifier.
 *
 * @param {string | null} jwt the JWT in condensed format, if applicable
 * @param {string} audience the audience to verify
 * @param {string} jwksUrl the JWKS URL
 * @returns {string | null} if found, the auth identifier
 */
const handleJwt = async (
  jwt: string | null, audience: string, jwksUrl: string
): Promise<string | undefined> => {
  if (jwt) {
    // Now that the JWT is decrypted, continue verifying it.

    const jwks: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> = createRemoteJWKSet(
      new URL(`${jwksUrl}/.well-known/jwks.json`)
    );

    const {payload} = await jwtVerify(jwt, jwks, {
      issuer: jwksUrl, audience: audience
    });

    // E.g., oauth2|discord|<id>

    const rawTokenParts: string[] | undefined = payload["sub"]?.split("|");
    const rawTokenLength: number | undefined = rawTokenParts?.length;

    // The end result should be a bunch of numbers only.

    if (rawTokenParts && rawTokenLength) {
      return rawTokenParts[rawTokenLength - 1] || undefined;
    }
  }

  return undefined;
};

/**
 * The main Cloudflare Worker for this backend project.
 */
const worker = {
  async fetch(
    request: Request, env: Environment, context: EventContext<Environment, never, unknown>,
  ) {
    try {
      const method: string = request.method.toLowerCase();

      // Handle preflight request without handling JWT since it's not necessary.

      if (method === "options") {
        return new Response(
          "{}", {headers: generateCorsHeaders(env.ALLOWED_ORIGIN)}
        );
      }

      // If there's a JWT, validate it.

      const jwt: string | null = (
        request.headers.get("Authorization")?.replace("Bearer ", "")?.trim()
      ) || null;

      const identifier: string | undefined = await handleJwt(jwt, env.AUDIENCE, env.JWKS_URL);

      // If it's a normal request, check the URL and handle normally.

      const url = new URL(request.url);
      const pathParts: string[] = url.pathname.split("/").filter(
        (part: string) => part && part !== "api"
      );

      if (pathParts.length === 0) {
        return createNotFoundResponse();
      }

      return handleRequest(
        env,
        method,
        pathParts[0],
        url.searchParams,
        request,
        identifier,
      );
    } catch (error: unknown) {
      return new Response(JSON.stringify(
        {
          "message": "Internal Server Error",
          "details": error || null,
          "_original": [],
        },
      ), {status: 500});
    }
  }
};

export default worker;
