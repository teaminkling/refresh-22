/**
 * Define HTTP entry points for this API worker.
 */

import {getMeta, putArtist, putWeeks} from "./services/meta";
import {getWork, getWorks, postUpload, postWork, putWork} from "./services/works";

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
 * - `GET /api/works?year=<year>&week=<week>&artist=<name>&sort=<sort>&search=<query>`
 *
 * Get posts according to the search criteria.
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
  fetch(request: Request, env: { REFRESH_KV: KVNamespace }) {
    // Constants must be placed inside the worker for the module syntax.

    /**
     * A 404 response.
     */
    const NOT_FOUND_RESPONSE = new Response("Resource not found.", {status: 404});

    /**
     * A map of method to route to callable for specific endpoints.
     */
    const ROUTE_AND_METHOD_TO_SERVICE: Record<string, Record<string, (
      params: URLSearchParams, body: Body, kv: KVNamespace
    ) => Promise<Response>>> = {
      "get": {
        "meta": getMeta,
        "posts": getWorks,
        "post": getWork,
      },
      "put": {
        "weeks": putWeeks,
        "artist": putArtist,
        "post": putWork,
      },
      "post": {
        "post": postWork,
        "upload": postUpload,
      },
    };

    // Start non-constant part of the code.

    const url = new URL(request.url);

    // If POST or PUT, check authentication. Otherwise, the request must be GET.

    // TODO: Check if user is authenticated and what their role is.

    const method: string = request.method.toLowerCase();

    const isPutOrPost: boolean = ["post", "put"].includes(method);

    // TODO: Check Cloudflare Cache for responses.

    if (isPutOrPost) {
      // TODO: Check auth.
      // TODO: Validate CSRF token.
    } else if (method !== "get") {
      return NOT_FOUND_RESPONSE;
    }

    // Read the route and call the appropriate endpoint if it exists.

    const pathParts: string[] = url.pathname.split("/").filter(
      (part: string) => part && part !== "api"
    );

    const callable: CallableFunction | undefined = (
      ROUTE_AND_METHOD_TO_SERVICE[request.method.toLowerCase()][pathParts[0]]
    );

    if (callable) {
      return callable(url.searchParams, request.body, env.REFRESH_KV);
    }

    return NOT_FOUND_RESPONSE;
  }
};

export default worker;
