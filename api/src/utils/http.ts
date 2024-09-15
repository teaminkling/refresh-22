export const generateCorsHeaders = (origin?: string): Headers => {
  return new Headers({
    "Access-Control-Allow-Origin": origin || "https://refresh.fiveclawd.com",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  });
};

export const createGenericResponse = (
  body?: BodyInit, origin?: string, status?: number,
) => {
  const newHeaders = new Headers();

  newHeaders.append("Content-Type", "application/json");
  for (const [key, value] of generateCorsHeaders(origin).entries()) {
    newHeaders.append(key, value);
  }

  return new Response(
    body || "{}", {headers: newHeaders, status: status},
  );
};

export const createJsonResponse = async (body?: BodyInit, origin?: string): Promise<Response> => {
  return createGenericResponse(body, origin);
};

export const createNotFoundResponse = async (origin?: string): Promise<Response> => {
  return createGenericResponse(JSON.stringify({
    "message": "Not Found",
    "details": null,
    "_original": [],
  }), origin, 404);
};
