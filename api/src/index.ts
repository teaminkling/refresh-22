/**
 * A 404 response.
 */
const NOT_FOUND_RESPONSE = new Response("Resource not found.", {status: 404});

/**
 * Define the following endpoints (defined in more detail in their function code-doc).
 *
 * - AUTHENTICATED POST /api/submit -> Submit or edit a post.
 * - AUTHENTICATED POST /api/upload -> Retrieve a one-time upload URL.
 *
 * Note that fetching posts per week/artist/all via any kind of sorting, retrieving a single
 * post, and retrieving user profiles are entirely handled by the headless CMS, Contentful.
 */
const worker = {
  fetch(request: Request, _env: unknown) {
    const url = new URL(request.url);

    // Only allow POST requests.

    if (request.method.toLowerCase() !== "post") {
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
