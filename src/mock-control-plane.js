import http from "node:http";
import crypto from "node:crypto";

const port = Number(process.env.MOCK_CONTROL_PLANE_PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
export function createMockControlPlaneState() {
  const registeredAgents = new Set(["hello-world-agent"]);
  const allow = new Map([["hello-world.say_hello", "Mock policy allows the hello world action."]]);
  const deny = new Map([
    ["aws.ec2.terminate_instances", "Mock policy blocks infrastructure termination."],
  ]);

  return {
    health() {
      return {
        ok: true,
        service: "mock-zt-control-plane",
        registeredAgents: [...registeredAgents],
        allow: [...allow.keys()],
        deny: [...deny.keys()],
      };
    },
    registerAgent(actor) {
      if (!actor) {
        return { status: 400, body: { ok: false, error: "actor is required" } };
      }
      registeredAgents.add(actor);
      return { status: 201, body: { ok: true, actor, registered: true } };
    },
    allowAction(action, reason = "Mock policy allows this action.") {
      if (!action) {
        return { status: 400, body: { ok: false, error: "action is required" } };
      }
      allow.set(action, reason);
      deny.delete(action);
      return { status: 201, body: { ok: true, action, decision: "allow" } };
    },
    decide({ actor, action, resource = "" }) {
      if (!registeredAgents.has(actor)) {
        return {
          status: 403,
          body: decisionBody(actor, action, resource, "deny", "agent is not registered"),
        };
      }
      if (deny.has(action)) {
        return {
          status: 403,
          body: decisionBody(actor, action, resource, "deny", deny.get(action)),
        };
      }
      if (allow.has(action)) {
        return {
          status: 200,
          body: decisionBody(actor, action, resource, "allow", allow.get(action)),
        };
      }
      return {
        status: 403,
        body: decisionBody(actor, action, resource, "deny", "action is not in the allow list"),
      };
    },
  };
}

export function createMockControlPlane(state = createMockControlPlaneState()) {
  return http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    return json(response, 200, state.health());
  }

  if (request.method === "POST" && request.url === "/agents") {
    const body = await readJson(request);
    const actor = String(body.actor || "").trim();
    const result = state.registerAgent(actor);
    return json(response, result.status, result.body);
  }

  if (request.method === "POST" && request.url === "/policies/allow") {
    const body = await readJson(request);
    const action = String(body.action || "").trim();
    const result = state.allowAction(action, body.reason);
    return json(response, result.status, result.body);
  }

  if (request.method === "POST" && request.url === "/actions") {
    const body = await readJson(request);
    const actor = String(body.actor || "").trim();
    const action = String(body.action || "").trim();
    const resource = String(body.resource || "").trim();
    const result = state.decide({ actor, action, resource });
    return json(response, result.status, result.body);
  }

  return json(response, 404, { ok: false, error: "not found" });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createMockControlPlane();
  server.listen(port, host, () => {
    console.log(`mock zt control plane listening on http://${host}:${port}`);
  });
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function decisionBody(actor, action, resource, result, reason) {
  const timestamp = new Date().toISOString();
  const previousHash = "0".repeat(64);
  const currentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ actor, action, resource, result, reason, timestamp, previousHash }))
    .digest("hex");
  return {
    ok: result === "allow",
    actor,
    action,
    resource,
    decision: result,
    reason,
    audit: {
      timestamp,
      previous_hash: previousHash,
      current_hash: currentHash,
      kms_signature: {
        algorithm: "MOCK_ECDSA_SHA_256",
        key_id: "mock-key",
        signature: "mock-signature",
      },
    },
  };
}

function json(response, statusCode, body) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}
