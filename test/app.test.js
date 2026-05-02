import assert from "node:assert/strict";
import { test } from "node:test";

import { routeRequest } from "../src/app.js";
import {
  getLaunchReadiness,
  getLaunchStatus,
  getReadinessChecklist,
  getRiskSummary,
  getSecurityEvidence,
} from "../src/launch-readiness.js";

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
  assert.deepEqual(body.next, [
    "/quickstart",
    "/docs",
    "/demo",
    "/launch-readiness",
    "/health",
    "/demo/deny",
    "/demo/allow",
  ]);
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
  assert.match(response.body, /Apache-2\.0/);
  assert.match(response.body, /Explorer verification/);
  assert.match(response.body, /Zero Trust Infrastructure/);
  assert.match(response.body, /https:\/\/discord\.gg\/cDS8MPX6G/);
  assert.match(response.body, /Phase 1 Ready/);
  assert.match(response.body, /Launch Readiness/);
  assert.match(response.body, /Interoperability/);
  assert.match(response.body, /Code to architecture/);
  assert.match(response.body, /broad API key/);
  assert.match(response.body, /delete a database/);
  assert.match(response.body, /does not claim to prevent prompt injection/);
  assert.match(response.body, /Join the alpha/);
  assert.match(response.body, /buttondown\.com\/api\/emails\/embed-subscribe\/oscarmackjr/);
  assert.match(response.body, /Get updates/);
});

test("launch readiness functions expose PM marketing and security status", () => {
  const status = getLaunchStatus();
  const checklist = getReadinessChecklist();
  const risks = getRiskSummary();
  const evidence = getSecurityEvidence();
  const readiness = getLaunchReadiness();

  assert.equal(status.verdict, "ready-with-bounded-gaps");
  assert.equal(status.pending, 1);
  assert.equal(readiness.ok, true);
  assert.ok(checklist.some((item) => item.id === "phase2-roadmap" && item.status === "done"));
  assert.ok(checklist.some((item) => item.id === "daal-explorer-verification" && item.status === "pending"));
  assert.ok(risks.some((risk) => risk.id === "sandbox-leak" && risk.severity === "high"));
  assert.ok(evidence.some((artifact) => artifact.id === "sbom" && artifact.status === "done"));
  assert.ok(evidence.some((artifact) => artifact.id === "daal-explorer" && artifact.status === "pending"));
});

test("launch readiness endpoint returns json and html dashboard", async () => {
  const jsonResponse = fakeResponse();
  const htmlResponse = fakeResponse();

  await routeRequest({ method: "GET", url: "/launch-readiness", headers: { accept: "application/json" } }, jsonResponse);
  await routeRequest({ method: "GET", url: "/launch-readiness", headers: { accept: "text/html" } }, htmlResponse);

  const body = JSON.parse(jsonResponse.body);
  assert.equal(jsonResponse.statusCode, 200);
  assert.equal(body.ok, true);
  assert.equal(body.status.verdict, "ready-with-bounded-gaps");
  assert.equal(body.status.pending, 1);
  assert.ok(body.checklist.some((item) => item.id === "secret-management"));

  assert.equal(htmlResponse.statusCode, 200);
  assert.match(htmlResponse.body, /Launch Readiness/);
  assert.match(htmlResponse.body, /ready-with-bounded-gaps/);
  assert.match(htmlResponse.body, /Verified DAAL contract address/);
  assert.match(htmlResponse.body, /MicroVM or sandbox isolation leak/);
  assert.match(htmlResponse.body, /CycloneDX SBOM/);
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
  assert.match(response.body, /Agent blocked, then authorized/);
  assert.match(response.body, /AsciinemaPlayer\.create/);
  assert.match(response.body, /agent-blocked-then-authorized\.cast/);
  assert.match(response.body, /Open deny JSON/);
  assert.match(response.body, /ZT_CONTROL_PLANE_URL/);
});

test("docs index lists repository documents", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Documentation/);
  assert.match(response.body, /Identity &amp; Policy/);
  assert.match(response.body, /Interoperability/);
  assert.match(response.body, /Architecture/);
  assert.match(response.body, /Day 1 Use Cases/);
  assert.match(response.body, /Why IAM Fails Agents/);
  assert.match(response.body, /Launch Checklist/);
  assert.match(response.body, /Explorer Verification/);
  assert.match(response.body, /Community/);
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
    "interoperability",
    "phase1-ready",
    "threat-model",
    "case-studies",
    "roi-metrics",
    "why-iam-fails",
    "adapter-contract",
    "roadmap",
    "explorer-verification",
    "contributing",
    "community",
    "security",
    "security-artifacts",
    "risk-register",
    "incident-response",
    "governance",
    "launch-checklist",
    "launch-brief",
    "social-kit",
    "engagement-strategy",
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

test("interoperability inventory renders supported languages and interfaces", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/interoperability", headers: { accept: "text/html" } }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.body, /Interoperability Inventory/);
  assert.match(response.body, /Primary SDK\/runtime/);
  assert.match(response.body, /Python/);
  assert.match(response.body, /JavaScript \/ Node\.js/);
  assert.match(response.body, /agent\/protocol interfaces: 11/);
  assert.match(response.body, /Nono CLI Broker/);
  assert.match(response.body, /infrastructure\/evidence interfaces: 7/);
  assert.match(response.body, /DAAL remains the main bounded gap/);
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
  assert.match(caseStudies.body, /Healthcare Data Processing Agent/);
  assert.match(caseStudies.body, /Customer Support Agent With SaaS Admin Tools/);
  assert.match(iam.body, /Traditional IAM Is Not Enough/);
  assert.match(iam.body, /NIST SP 800-207/);
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
  assert.match(roadmap.body, /Phase 1 ready criteria/);
  assert.match(roadmap.body, /Nono is not part of the public adapter MVP/);
  assert.match(governance.body, /Core Maintenance Team/);
  assert.match(governance.body, /Nono is excluded from the public adapter MVP/);
});

test("phase ready, risk, incident, ROI, and security artifact docs render", async () => {
  const phase = fakeResponse();
  const risk = fakeResponse();
  const incident = fakeResponse();
  const roi = fakeResponse();
  const artifacts = fakeResponse();
  const engagement = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/phase1-ready", headers: { accept: "text/html" } }, phase);
  await routeRequest({ method: "GET", url: "/docs/risk-register", headers: { accept: "text/html" } }, risk);
  await routeRequest({ method: "GET", url: "/docs/incident-response", headers: { accept: "text/html" } }, incident);
  await routeRequest({ method: "GET", url: "/docs/roi-metrics", headers: { accept: "text/html" } }, roi);
  await routeRequest({ method: "GET", url: "/docs/security-artifacts", headers: { accept: "text/html" } }, artifacts);
  await routeRequest({ method: "GET", url: "/docs/engagement-strategy", headers: { accept: "text/html" } }, engagement);

  assert.equal(phase.statusCode, 200);
  assert.equal(risk.statusCode, 200);
  assert.equal(incident.statusCode, 200);
  assert.equal(roi.statusCode, 200);
  assert.equal(artifacts.statusCode, 200);
  assert.equal(engagement.statusCode, 200);
  assert.match(phase.body, /Phase 1 MVP Definition/);
  assert.match(risk.body, /MicroVM or sandbox isolation leak/);
  assert.match(incident.body, /War Room/);
  assert.match(roi.body, /Cost Avoidance/);
  assert.match(artifacts.body, /SBOM generation/);
  assert.match(engagement.body, /GitHub Traffic/);
});

test("community and explorer verification docs render", async () => {
  const community = fakeResponse();
  const explorer = fakeResponse();

  await routeRequest({ method: "GET", url: "/docs/community", headers: { accept: "text/html" } }, community);
  await routeRequest({
    method: "GET",
    url: "/docs/explorer-verification",
    headers: { accept: "text/html" },
  }, explorer);

  assert.equal(community.statusCode, 200);
  assert.equal(explorer.statusCode, 200);
  assert.match(community.body, /Zero Trust Infrastructure/);
  assert.match(community.body, /https:\/\/discord\.gg\/cDS8MPX6G/);
  assert.match(explorer.body, /Explorer verification/);
  assert.match(explorer.body, /Pending/);
  assert.match(explorer.body, /Base Sepolia/);
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

test("asciinema cast is served for embedded demo", async () => {
  const response = fakeResponse();

  await routeRequest({
    method: "GET",
    url: "/agent-blocked-then-authorized.cast",
    headers: { accept: "application/x-asciicast" },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"], /application\/x-asciicast/);
  assert.match(response.body, /"version"/);
});

test("health endpoint returns service status", async () => {
  const response = fakeResponse();

  await routeRequest({ method: "GET", url: "/health" }, response);

  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.service, "zt-adapter-hello-world");
});
