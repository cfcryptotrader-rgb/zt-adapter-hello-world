import assert from "node:assert/strict";
import { test } from "node:test";

import { routeRequest } from "../src/app.js";

function fakeResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };
}

test("root endpoint returns hello message", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/" }, response);

  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.ok, true);
  assert.match(body.message, /Zero Trust adapter/);
});

test("health endpoint returns service status", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/health" }, response);

  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.service, "zt-adapter-hello-world");
});
