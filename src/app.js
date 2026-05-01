import { checkAction } from "./adapter.js";

export async function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");

  if (request.method === "GET" && url.pathname === "/") {
    return json(response, 200, {
      ok: true,
      message: "Hello from a Zero Trust adapter.",
      next: ["/health", "/demo/deny", "/demo/allow"],
    });
  }

  if (request.method === "GET" && url.pathname === "/health") {
    return json(response, 200, {
      ok: true,
      service: "zt-adapter-hello-world",
      ts: new Date().toISOString(),
    });
  }

  if (request.method === "GET" && url.pathname === "/demo/deny") {
    try {
      const decision = await checkAction({
        action: "aws.ec2.terminate_instances",
        resource: "i-demo",
      });
      return json(response, decision.ok ? 200 : 403, decision);
    } catch (error) {
      return json(response, 503, {
        ok: false,
        error: error.message,
        hint: "Set ZT_CONTROL_PLANE_URL or run the local zt-provisioner first.",
      });
    }
  }

  if (request.method === "GET" && url.pathname === "/demo/allow") {
    try {
      const decision = await checkAction({
        action: "hello-world.say_hello",
        resource: "local-demo",
      });
      if (decision.decision !== "allow") {
        return json(response, 403, {
          ...decision,
          executionSkipped: true,
        });
      }
      return json(response, 200, {
        ...decision,
        executionSkipped: false,
        result: {
          message: "Hello from a policy-approved adapter action.",
        },
      });
    } catch (error) {
      return json(response, 503, {
        ok: false,
        error: error.message,
        hint: "Set ZT_CONTROL_PLANE_URL or run the local mock control plane first.",
      });
    }
  }

  return json(response, 404, {
    ok: false,
    error: "not found",
  });
}

export function json(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}
