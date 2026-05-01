import { routeRequest } from "../src/app.js";

export default async function handler(request, response) {
  try {
    await routeRequest(request, response);
  } catch (error) {
    response.statusCode = 500;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.end(`${JSON.stringify({ ok: false, error: error.message })}\n`);
  }
}

