import { checkAction } from "./adapter.js";

export async function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");

  if (request.method === "GET" && url.pathname === "/") {
    if (wantsHtml(request)) {
      return html(response, 200, landingPage());
    }
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

function wantsHtml(request) {
  const accept = String(request.headers?.accept || request.headers?.Accept || "");
  return accept.includes("text/html");
}

function landingPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Zero Trust Hello World Adapter</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f8fb;
        --panel: #ffffff;
        --ink: #18202f;
        --muted: #596477;
        --line: #d9dee8;
        --accent: #126f83;
        --danger: #a92828;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
        color: var(--ink);
        line-height: 1.5;
      }
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 48px 20px 64px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 6vw, 4rem);
        line-height: 1;
        letter-spacing: 0;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 1.1rem;
      }
      p { color: var(--muted); margin: 0 0 18px; }
      .eyebrow {
        color: var(--accent);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.78rem;
        margin-bottom: 16px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 28px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 18px;
      }
      .button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 28px 0;
      }
      a.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 16px;
        border: 1px solid var(--line);
        border-radius: 6px;
        color: var(--ink);
        text-decoration: none;
        background: var(--panel);
        font-weight: 650;
      }
      a.button.primary {
        border-color: var(--accent);
        background: var(--accent);
        color: white;
      }
      code {
        background: #eef1f6;
        border: 1px solid var(--line);
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 0.92em;
      }
      .danger { color: var(--danger); font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Zero Trust V2 public adapter</div>
      <h1>Hello World for governed agent actions</h1>
      <p>
        This deployable demo shows the adapter surface for policy-before-execution:
        an agent asks the Zero Trust control plane before a sensitive action runs.
      </p>
      <div class="button-row">
        <a class="button primary" href="/health">Health JSON</a>
        <a class="button" href="/demo/deny">Unauthorized action</a>
        <a class="button" href="/demo/allow">Allowed action</a>
      </div>
      <section class="grid" aria-label="Demo flow">
        <div class="card">
          <h2>1. Agent requests action</h2>
          <p><code>aws.ec2.terminate_instances</code> is intentionally high risk.</p>
        </div>
        <div class="card">
          <h2>2. Policy runs first</h2>
          <p>The adapter calls <code>POST /actions</code> before execution.</p>
        </div>
        <div class="card">
          <h2>3. Unsafe work is blocked</h2>
          <p><span class="danger">Deny</span> means the protected function is skipped.</p>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

export function html(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "text/html; charset=utf-8",
  });
  response.end(body);
}

export function json(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}
