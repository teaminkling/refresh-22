import {getArtists} from "./services/artists";
import {getWeeks} from "./services/weeks";
import {getWork, getWorks} from "./services/works";
import Environment from "./types/environment";
import {createNotFoundResponse, generateCorsHeaders} from "./utils/http";

const handleRequest = async (
  env: Environment,
  method: string,
  routine: string,
  params: URLSearchParams,
  _request: Request,
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
      return getWeeks(env);
    case ("get/artists"):
      return getArtists(env);
    case ("get/works"):
      return getWorks(env, params);
    case ("get/work"):
      return getWork(env, params);
  }

  return createNotFoundResponse();
};

const worker = {
  async fetch(
    request: Request, env: Environment, _context: EventContext<Environment, never, unknown>,
  ) {
    try {
      const method: string = request.method.toLowerCase();

      // Handle preflight request without handling JWT since it's not necessary.

      if (method === "options") {
        return new Response(
          "{}", {headers: generateCorsHeaders(env.ALLOWED_ORIGIN)}
        );
      }

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
