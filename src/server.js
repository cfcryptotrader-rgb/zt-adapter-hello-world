import http from "node:http";

import { routeRequest } from "./app.js";

const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || "127.0.0.1";

const server = http.createServer((request, response) => {
  routeRequest(request, response).catch((error) => {
    response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(`${JSON.stringify({ ok: false, error: error.message })}\n`);
  });
});

server.listen(port, host, () => {
  console.log(`zt-adapter-hello-world listening on http://${host}:${port}`);
});
