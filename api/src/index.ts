/**
 * Define HTTP entry points for this API worker.
 */

/**
 * A 404 response.
 */
const NOT_FOUND_RESPONSE = new Response("Resource not found.", {status: 404});

const ROUTE_AND_METHOD_TO_SERVICE = {
  "get": {
    "weeks": "",
    "week": "",
    "artists": "",
    "artist": "",
    "posts": "",
    "post": "",
  },
  "put": {
    "week": "",
    "artist": "",
    "post": "",
  },
  "post": {
    "week": "",
    "post": "",
  },
};

/**
 * Define the following endpoints (defined in more detail in their function code-doc).
 *
 * - `GET /api/weeks?year=<year>`
 *
 * Retrieve a list of weeks (redacting future weeks).
 *
 * - `GET /api/week?year=<year>&week=<week>`
 *
 * Retrieve information about a given week.
 *
 * - `PUT/POST /api/week?year=<year>&week=<week>`
 *
 * PUT: edit a week and its info. POST: create it instead.
 *
 * - `GET /api/artists?year=<year>`
 *
 * Retrieve all artists in the given year.
 *
 * - `GET /api/artist?name=<name>`
 *
 * Retrieve information pertaining to a given artist by name.
 *
 * - `PUT /api/artist?name=<name>`
 *
 * Edit the social media information for any given artist by name.
 *
 * - `GET /api/posts?year=<year>&week=<week>&artist=<name>&page=<page>&sort=<sort>`
 *
 * Get posts according to the search criteria. If week is provided, artist cannot be provided
 * and vice versa. If neither are required,
 *
 * Sort can be "ascending", "descending", or "random".
 *
 * - `GET /api/post?id=<id>`
 *
 * Retrieve a post directly.
 *
 * - `PUT /api/post?id=<id>`
 *
 * Edit a post by known ID.
 *
 * - `POST /api/post`
 *
 * Create a post.
 *
 * - `POST /api/upload`
 *
 * Retrieve a one-time upload URL.
 *
 * Notes:
 *
 * - Years supported by the system are so infrequently written, they're part of the environment
 *   variables and not controlled by the K/V store. A code change is needed to prepare for a new
 *   year of work leading to a transition period over the new year.
 * - All PUT and POST requests are authenticated.
 * - Artist information is empty when they are first authenticated with Auth0. In these cases,
 *   the frontend must send a subsequent authenticated request to update their socials.
 * - Some GET endpoints will have more information provided to the caller as long as the
 *   authentication is for a staff user.
 */
const worker = {
  fetch(request: Request, _env: unknown) {
    const url = new URL(request.url);

    // If POST or PUT, check authentication. Otherwise, the request must be GET.

    const method: string = request.method.toLowerCase();


    if (["post", "put"].includes(method)) {
      // TODO: CHECK AUTH.

      console.log("boop");
    } else if (method !== "get") {
      return NOT_FOUND_RESPONSE;
    }

    // The route rule is defined on the dashboard, not in code. Read it.

    const pathParts: string[] = url.pathname.split("/").filter(
      (part: string) => part && part !== "api"
    );

    if (pathParts[0] === "submit") {
      return new Response("Submit called!");
    } else if (pathParts[0] === "upload") {
      return new Response("Upload called!");
    }

    return NOT_FOUND_RESPONSE;
  }
};

export default worker;
