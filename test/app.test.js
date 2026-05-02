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

  await routeRequest({ method: "GET", url: "/", headers: { accept: "application/json" } }, response);

  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.ok, true);
  assert.match(body.message, /ZT-Infra developer site/);
  assert.deepEqual(body.next, ["/quickstart", "/docs", "/demo", "/health", "/demo/deny", "/demo/allow"]);
});

test("root endpoint returns browser-friendly html", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"], /text\/html/);
  assert.match(response.body, /Identity, policy, and audit evidence for autonomous agents/);
  assert.match(response.body, /Start the quickstart/);
  assert.match(response.body, /Hello World is the proof path/);
  assert.match(response.body, /Current:/);
  assert.match(response.body, /Planned:/);
  assert.match(response.body, /Code to architecture/);
  assert.match(response.body, /broad API key/);
  assert.match(response.body, /delete a database/);
  assert.match(response.body, /does not claim to prevent prompt injection/);
  assert.match(response.body, /Join the alpha/);
  assert.match(response.body, /buttondown\.com\/api\/emails\/embed-subscribe\/oscarmackjr/);
  assert.match(response.body, /Get updates/);
});

test("quickstart page renders readme content", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/quickstart", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Five-Minute Secure Hello World/);
  assert.match(response.body, /Docker Compose/);
  assert.match(response.body, /docker compose up/);
  assert.match(response.body, /Deploy To Vercel/);
});

test("demo page explains json endpoints", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/demo", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Demo Flow/);
  assert.match(response.body, /Open deny JSON/);
  assert.match(response.body, /ZT_CONTROL_PLANE_URL/);
});

test("docs index lists repository documents", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Documentation/);
  assert.match(response.body, /Identity &amp; Policy/);
  assert.match(response.body, /Architecture/);
  assert.match(response.body, /Day 1 Use Cases/);
  assert.match(response.body, /Why IAM Fails Agents/);
  assert.match(response.body, /Launch Checklist/);
  assert.match(response.body, /Social Kit/);
  assert.match(response.body, /SDK API/);
  assert.match(response.body, /Threat Model/);
});

test("docs page renders markdown content", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/readme", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Five-Minute Secure Hello World/);
  assert.match(response.body, /Deploy To Vercel/);
});

test("all docs routes render markdown content", async () => {
  const slugs = [
    "identity-policy",
    "threat-model",
    "case-studies",
    "why-iam-fails",
    "adapter-contract",
    "roadmap",
    "contributing",
    "security",
    "governance",
    "launch-checklist",
    "launch-brief",
    "social-kit",
    "engineering-spec",
    "sdk-review",
    "sdk-api",
    "changelog",
  ];

  for (const slug of slugs) {
    const response = fakeResponse();

    await routeRequest({ method: "GET", url: `/docs/${slug}`, headers: { accept: "text/html" } }, response);

    assert.equal(response.statusCode, 200, slug);
    assert.doesNotMatch(response.body, /ENOENT/, slug);
    assert.match(response.body, /<main>/, slug);
  }
});

test("architecture doc renders reusable diagram", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/architecture", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /ZT-Infra Architecture/);
  assert.match(response.body, /src="\/architecture\.svg"/);
});

test("website exposes launch review documentation", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Use cases/);
  assert.match(response.body, /Why IAM fails agents/);
  assert.match(response.body, /Day 1 security question/);
  assert.match(response.body, /guardedCall/);
  assert.match(response.body, /POST \/actions/);
});

test("case studies and IAM whitepaper render", async () => {
  const caseStudies = fakeResponse();
  const iam = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/case-studies", headers: { accept: "text/html" } }, caseStudies);
  await routeRequest({ method: "GET", url: "/docs/why-iam-fails", headers: { accept: "text/html" } }, iam);

  assert.equal(caseStudies.statusCode, 200);
  assert.equal(iam.statusCode, 200);
  assert.match(caseStudies.body, /Finance Agent In A Docker Sandbox/);
  assert.match(iam.body, /Traditional IAM Is Not Enough/);
});

test("social kit and SDK API docs render", async () => {
  const social = fakeResponse();
  const sdk = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/social-kit", headers: { accept: "text/html" } }, social);
  await routeRequest({ method: "GET", url: "/docs/sdk-api", headers: { accept: "text/html" } }, sdk);

  assert.equal(social.statusCode, 200);
  assert.equal(sdk.statusCode, 200);
  assert.match(social.body, /Show HN/);
  assert.match(social.body, /Claims To Avoid/);
  assert.match(sdk.body, /ZeroTrustClient/);
  assert.match(sdk.body, /Fail-Closed Rule/);
});

test("roadmap and governance clarify launch status", async () => {
  const roadmap = fakeResponse();
  const governance = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/roadmap", headers: { accept: "text/html" } }, roadmap);
  await routeRequest({ method: "GET", url: "/docs/governance", headers: { accept: "text/html" } }, governance);

  assert.equal(roadmap.statusCode, 200);
  assert.equal(governance.statusCode, 200);
  assert.match(roadmap.body, /90-Day Launch Status/);
  assert.match(roadmap.body, /Nono is not part of the public adapter MVP/);
  assert.match(governance.body, /Nono is excluded from the public adapter MVP/);
});

test("contributing page documents coding standards", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/contributing", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Coding Standards/);
  assert.match(response.body, /Fail closed/);
  assert.match(response.body, /Pull Request Standards/);
});

test("launch checklist renders review status", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/launch-checklist", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Governance And Continuity/);
  assert.match(response.body, /Good First Issue backlog/);
  assert.match(response.body, /Docker daemon was not running/);
});

test("architecture svg is served for media reuse", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/architecture.svg", headers: { accept: "image/svg+xml" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"], /image\/svg\+xml/);
  assert.match(response.body, /ZT-Infra current architecture/);
});

test("health endpoint returns service status", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/health" }, response);

  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.service, "zt-adapter-hello-world");
});
