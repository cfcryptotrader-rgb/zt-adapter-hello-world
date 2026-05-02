import fs from "node:fs";

import { checkAction } from "./adapter.js";

const bundledFiles = new Map([
  ["ADAPTER_CONTRACT.md", fs.readFileSync(new URL("../ADAPTER_CONTRACT.md", import.meta.url), "utf8")],
  ["ARCHITECTURE.md", fs.readFileSync(new URL("../ARCHITECTURE.md", import.meta.url), "utf8")],
  ["CASE_STUDIES.md", fs.readFileSync(new URL("../CASE_STUDIES.md", import.meta.url), "utf8")],
  ["CHANGELOG.md", fs.readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8")],
  ["CONTRIBUTING.md", fs.readFileSync(new URL("../CONTRIBUTING.md", import.meta.url), "utf8")],
  ["ENGINEERING_SPEC.md", fs.readFileSync(new URL("../ENGINEERING_SPEC.md", import.meta.url), "utf8")],
  ["GOVERNANCE.md", fs.readFileSync(new URL("../GOVERNANCE.md", import.meta.url), "utf8")],
  ["IDENTITY_AND_POLICY.md", fs.readFileSync(new URL("../IDENTITY_AND_POLICY.md", import.meta.url), "utf8")],
  ["LAUNCH_BRIEF.md", fs.readFileSync(new URL("../LAUNCH_BRIEF.md", import.meta.url), "utf8")],
  ["LAUNCH_CHECKLIST.md", fs.readFileSync(new URL("../LAUNCH_CHECKLIST.md", import.meta.url), "utf8")],
  ["README.md", fs.readFileSync(new URL("../README.md", import.meta.url), "utf8")],
  ["ROADMAP.md", fs.readFileSync(new URL("../ROADMAP.md", import.meta.url), "utf8")],
  ["SDK_API.md", fs.readFileSync(new URL("../SDK_API.md", import.meta.url), "utf8")],
  ["SDK_REVIEW.md", fs.readFileSync(new URL("../SDK_REVIEW.md", import.meta.url), "utf8")],
  ["SECURITY.md", fs.readFileSync(new URL("../SECURITY.md", import.meta.url), "utf8")],
  ["SOCIAL_KIT.md", fs.readFileSync(new URL("../SOCIAL_KIT.md", import.meta.url), "utf8")],
  ["THREAT_MODEL.md", fs.readFileSync(new URL("../THREAT_MODEL.md", import.meta.url), "utf8")],
  [
    "WHY_TRADITIONAL_IAM_FAILS.md",
    fs.readFileSync(new URL("../WHY_TRADITIONAL_IAM_FAILS.md", import.meta.url), "utf8"),
  ],
  ["public/architecture.svg", fs.readFileSync(new URL("../public/architecture.svg", import.meta.url), "utf8")],
  [
    "public/agent-blocked-then-authorized.cast",
    fs.readFileSync(new URL("../public/agent-blocked-then-authorized.cast", import.meta.url), "utf8"),
  ],
]);

function readBundledFile(file) {
  const contents = bundledFiles.get(file);
  if (contents === undefined) {
    throw new Error(`Bundled file is not registered: ${file}`);
  }
  return contents;
}

const docs = [
  {
    slug: "readme",
    title: "README",
    file: "README.md",
    summary: "Five-minute secure Hello World quickstart and deployment guide.",
  },
  {
    slug: "identity-policy",
    title: "Identity & Policy",
    file: "IDENTITY_AND_POLICY.md",
    summary: "Agent identity provisioning and least-privilege ABAC examples.",
  },
  {
    slug: "architecture",
    title: "Architecture",
    file: "ARCHITECTURE.md",
    summary: "System diagram for the website, adapters, control plane, AWS runtime, and evidence path.",
  },
  {
    slug: "threat-model",
    title: "Threat Model",
    file: "THREAT_MODEL.md",
    summary: "What this MVP protects, what it does not protect, and residual risks.",
  },
  {
    slug: "case-studies",
    title: "Day 1 Use Cases",
    file: "CASE_STUDIES.md",
    summary: "Concrete first-day examples for finance, cloud operations, MCP, and A2A agents.",
  },
  {
    slug: "why-iam-fails",
    title: "Why IAM Fails Agents",
    file: "WHY_TRADITIONAL_IAM_FAILS.md",
    summary: "Short whitepaper on why human-centric IAM is not enough for autonomous agents.",
  },
  {
    slug: "adapter-contract",
    title: "Adapter Contract",
    file: "ADAPTER_CONTRACT.md",
    summary: "Minimum request, response, and fail-closed behavior for adapters.",
  },
  {
    slug: "roadmap",
    title: "Roadmap",
    file: "ROADMAP.md",
    summary: "SPIFFE-for-AI-agents roadmap and future contribution areas.",
  },
  {
    slug: "contributing",
    title: "Contributing",
    file: "CONTRIBUTING.md",
    summary: "How to add adapters, brokers, tests, and examples.",
  },
  {
    slug: "security",
    title: "Security",
    file: "SECURITY.md",
    summary: "Supported versions and private vulnerability reporting.",
  },
  {
    slug: "governance",
    title: "Governance",
    file: "GOVERNANCE.md",
    summary: "Launch readiness, stakeholder communication, and rules of engagement.",
  },
  {
    slug: "launch-checklist",
    title: "Launch Checklist",
    file: "LAUNCH_CHECKLIST.md",
    summary: "Reviewer checklist with completed, partial, open, and blocked launch items.",
  },
  {
    slug: "launch-brief",
    title: "Launch Brief",
    file: "LAUNCH_BRIEF.md",
    summary: "Public launch narrative, audience, suggested message, and social-proof policy.",
  },
  {
    slug: "social-kit",
    title: "Social Kit",
    file: "SOCIAL_KIT.md",
    summary: "Approved launch copy, platform-specific posts, claims to use, and claims to avoid.",
  },
  {
    slug: "engineering-spec",
    title: "Engineering Spec",
    file: "ENGINEERING_SPEC.md",
    summary: "Specs for IaC, security scans, DAAL, animation, and repository protection work.",
  },
  {
    slug: "sdk-review",
    title: "SDK Review",
    file: "SDK_REVIEW.md",
    summary: "How the public client differs from the first-customer draft SDK.",
  },
  {
    slug: "sdk-api",
    title: "SDK API",
    file: "SDK_API.md",
    summary: "ZeroTrustClient constructor, decision methods, fail-closed behavior, and testing patterns.",
  },
  {
    slug: "changelog",
    title: "Changelog",
    file: "CHANGELOG.md",
    summary: "Release notes for the public adapter repo.",
  },
];

export async function routeRequest(request, response) {
  const url = new URL(request.url, "http://localhost");

  if (request.method === "GET" && url.pathname === "/") {
    if (wantsHtml(request)) {
      return html(response, 200, landingPage());
    }
    return json(response, 200, {
      ok: true,
      message: "ZT-Infra developer site",
      next: ["/quickstart", "/docs", "/demo", "/health", "/demo/deny", "/demo/allow"],
    });
  }

  if (request.method === "GET" && url.pathname === "/quickstart") {
    const markdown = readBundledFile("README.md");
    return html(response, 200, docsShell("Quickstart", markdownToHtml(markdown)));
  }

  if (request.method === "GET" && url.pathname === "/demo") {
    return html(response, 200, demoPage());
  }

  if (request.method === "GET" && url.pathname === "/architecture.svg") {
    const svg = readBundledFile("public/architecture.svg");
    response.writeHead(200, {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    });
    response.end(svg);
    return undefined;
  }

  if (request.method === "GET" && url.pathname === "/agent-blocked-then-authorized.cast") {
    const cast = readBundledFile("public/agent-blocked-then-authorized.cast");
    response.writeHead(200, {
      "content-type": "application/x-asciicast; charset=utf-8",
      "cache-control": "public, max-age=300",
    });
    response.end(cast);
    return undefined;
  }

  if (request.method === "GET" && url.pathname === "/docs") {
    return html(response, 200, docsIndexPage());
  }

  if (request.method === "GET" && url.pathname.startsWith("/docs/")) {
    const slug = url.pathname.replace(/^\/docs\//, "").replace(/\/$/, "");
    const doc = docs.find((item) => item.slug === slug);
    if (!doc) {
      return html(response, 404, docsShell("Not found", "<p>That documentation page does not exist.</p>"));
    }
    if (doc.slug === "architecture") {
      return html(response, 200, docsShell(doc.title, architecturePageContent()));
    }
    const markdown = readBundledFile(doc.file);
    return html(response, 200, docsShell(doc.title, markdownToHtml(markdown)));
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
    <title>ZT-Infra | Agent Identity, Policy, and Audit</title>
    <style>${sharedStyles()}</style>
  </head>
  <body>
    <main>
      <nav class="top-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/quickstart">Quickstart</a>
        <a href="/docs">Docs</a>
        <a href="/demo">Demo</a>
        <a href="https://github.com/oscarmackjr-twg/zt-adapter-hello-world">GitHub</a>
      </nav>
      <div class="eyebrow">ZT-Infra</div>
      <h1>Identity, policy, and audit evidence for autonomous agents</h1>
      <p>
        ZT-Infra is building toward a SPIFFE-like trust layer for AI agents:
        portable agent identity, least-privilege policy, pre-execution enforcement,
        and signed evidence that security teams can verify.
      </p>
      <p>
        The first proof is deliberately simple: an agent attempts a dangerous action,
        policy blocks it before execution, and the adapter returns a verifiable audit-shaped response.
      </p>
      <section class="vulnerability-hook" aria-label="Vulnerability example">
        <div class="hook-label">The failure mode</div>
        <h2>A broad API key can turn one bad instruction into real damage</h2>
        <p>
          An agent starts with a legitimate task and a powerful cloud, repository, or SaaS token.
          A prompt, plugin, or tool instruction pushes it toward a dangerous call: delete a database,
          terminate infrastructure, export private data, or create an unauthorized pull request.
        </p>
        <p>
          ZT-Infra does not claim to prevent prompt injection. It puts policy in front of the resulting
          tool call: deny the action, skip execution, and return audit evidence.
        </p>
      </section>
      <section class="status-banner" aria-label="Current versus planned">
        <div>
          <strong>Current:</strong> public Hello World adapter, local mock control plane, deny-before-execute demo,
          architecture docs, Docker broker example, verifier CLI, and IAM-authorized Terraform gateway example.
        </div>
        <div>
          <strong>Planned:</strong> production mTLS/SPIFFE identity binding, KMS-backed public audit verification,
          hardened cloud brokers, and DAAL testnet anchoring.
        </div>
      </section>
      <div class="button-row">
        <a class="button primary" href="/quickstart">Start the quickstart</a>
        <a class="button" href="/docs/case-studies">Use cases</a>
        <a class="button" href="/docs/why-iam-fails">Why IAM fails agents</a>
        <a class="button" href="/docs/architecture">Architecture</a>
        <a class="button" href="/docs/identity-policy">Identity &amp; Policy</a>
        <a class="button" href="/demo">View demo flow</a>
      </div>
      <section class="grid" aria-label="Product pillars">
        <div class="card">
          <h2>Agent identity</h2>
          <p>Define who the transient agent is, which workload launched it, and which trust domain it belongs to.</p>
        </div>
        <div class="card">
          <h2>Policy before execution</h2>
          <p>Adapters call <code>POST /actions</code> before a sensitive tool, workflow, or external task runs.</p>
        </div>
        <div class="card">
          <h2>Signed evidence</h2>
          <p>Every decision can produce hash-chained audit evidence with KMS-backed signatures in the full MVP.</p>
        </div>
      </section>
      <section class="flow" aria-label="Code to architecture flow">
        <h2>Code to architecture</h2>
        <div class="flow-track">
          <div class="flow-step">
            <span class="step-label">Adapter code</span>
            <code>guardedCall(...)</code>
          </div>
          <div class="flow-arrow" aria-hidden="true"></div>
          <div class="flow-step">
            <span class="step-label">Control plane</span>
            <code>POST /actions</code>
          </div>
          <div class="flow-arrow deny" aria-hidden="true"></div>
          <div class="flow-step danger-step">
            <span class="step-label">Decision</span>
            <code>deny</code>
          </div>
          <div class="flow-arrow" aria-hidden="true"></div>
          <div class="flow-step">
            <span class="step-label">Evidence</span>
            <code>audit.current_hash</code>
          </div>
        </div>
        <p>
          The protected function is skipped unless policy returns <code>allow</code>.
          The same flow maps to brokers, MCP tools, OpenAI adapters, LangGraph nodes, and A2A task handlers.
        </p>
      </section>
      <section class="doc callout">
        <h2>Day 1 security question</h2>
        <p>
          When an autonomous agent asks to terminate infrastructure, create a pull request, export finance data,
          or accept an external task, who decides before the tool runs and where is the evidence?
        </p>
        <p>
          ZT-Infra makes that decision point explicit and keeps the public starter small enough to verify.
        </p>
      </section>
      <section class="signup" aria-label="Join the alpha">
        <div>
          <h2>Join the alpha</h2>
          <p>
            Get occasional updates on the adapter SDK, execution brokers, identity work,
            and audit verification. No app account or API key is required.
          </p>
        </div>
        <form
          action="https://buttondown.com/api/emails/embed-subscribe/oscarmackjr"
          method="post"
          class="embeddable-buttondown-form"
        >
          <label for="bd-email">Email</label>
          <div class="signup-row">
            <input type="email" name="email" id="bd-email" placeholder="you@example.com" required>
            <input type="hidden" value="1" name="embed">
            <button type="submit">Get updates</button>
          </div>
          <p class="fine-print">
            Powered by <a href="https://buttondown.com/refer/oscarmackjr" target="_blank" rel="noreferrer">Buttondown</a>.
          </p>
        </form>
      </section>
      <section class="grid" aria-label="Documentation">
        ${docs
          .slice(0, 9)
          .map(
            (doc) => `<a class="card doc-link" href="/docs/${escapeHtml(doc.slug)}">
          <h2>${escapeHtml(doc.title)}</h2>
          <p>${escapeHtml(doc.summary)}</p>
        </a>`,
          )
          .join("")}
      </section>
      <section class="doc callout">
        <h2>Hello World is the proof path</h2>
        <p>
          The public repository includes a small Hello World adapter so developers can see the control point quickly:
          an agent attempts an unauthorized action, policy denies it, and the protected function is skipped.
        </p>
      </section>
    </main>
  </body>
</html>`;
}

function demoPage() {
  return docsShell(
    "Demo",
    `<h1>Demo Flow</h1>
    <p class="lede">The hosted demo separates the human-readable story from the JSON endpoints used by scripts and tests.</p>
    <section class="demo-player" aria-label="Terminal recording">
      <div class="demo-player-header">
        <div>
          <h2>Agent blocked, then authorized</h2>
          <p>
            This terminal recording shows the local quickstart path: a dangerous action is denied before execution,
            then an allowed action runs and returns audit-shaped evidence.
          </p>
        </div>
        <a class="button" href="/agent-blocked-then-authorized.cast">Open cast file</a>
      </div>
      <div id="asciinema-demo" class="asciinema-demo">
        <p>
          Loading terminal recording. If the player does not load,
          <a href="/agent-blocked-then-authorized.cast">open the cast file</a>.
        </p>
      </div>
    </section>
    <section class="grid" aria-label="Demo steps">
      <div class="card">
        <h2>1. Agent asks to act</h2>
        <p>The intentionally unsafe action is <code>aws.ec2.terminate_instances</code>.</p>
      </div>
      <div class="card">
        <h2>2. Adapter checks policy</h2>
        <p>The adapter calls <code>POST /actions</code> before any protected function runs.</p>
      </div>
      <div class="card">
        <h2>3. Deny skips execution</h2>
        <p>A deny response means the action is not forwarded or executed.</p>
      </div>
    </section>
    <div class="button-row">
      <a class="button primary" href="/demo/deny">Open deny JSON</a>
      <a class="button" href="/demo/allow">Open allow JSON</a>
      <a class="button" href="/docs/readme">Run locally</a>
    </div>
    <p>
      On Vercel, the JSON demo endpoints need <code>ZT_CONTROL_PLANE_URL</code> to point at a reachable control plane.
      Without that setting, they return a clear configuration error while the website and docs remain viewable.
    </p>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.css">
    <script src="https://cdn.jsdelivr.net/npm/asciinema-player@3.15.1/dist/bundle/asciinema-player.min.js"></script>
    <script>
      if (globalThis.AsciinemaPlayer) {
        AsciinemaPlayer.create("/agent-blocked-then-authorized.cast", document.getElementById("asciinema-demo"), {
          autoPlay: false,
          fit: "width",
          idleTimeLimit: 1.5,
          preload: true,
          theme: "asciinema"
        });
      }
    </script>`,
  );
}

function docsIndexPage() {
  return docsShell(
    "Documentation",
    `<p class="lede">Browse the public adapter documentation without leaving the Vercel deployment.</p>
    <section class="grid" aria-label="Documentation pages">
      ${docs
        .map(
          (doc) => `<a class="card doc-link" href="/docs/${escapeHtml(doc.slug)}">
        <h2>${escapeHtml(doc.title)}</h2>
        <p>${escapeHtml(doc.summary)}</p>
      </a>`,
        )
        .join("")}
    </section>`,
  );
}

function architecturePageContent() {
  return `<h1>ZT-Infra Architecture</h1>
    <p class="lede">
      This public architecture diagram shows how the developer site, Hello World quickstart,
      adapters, control plane, private AWS MVP, and evidence systems fit together.
    </p>
    <p><img src="/architecture.svg" alt="ZT-Infra current architecture"></p>
    <h2>What This Shows</h2>
    <ul>
      <li><strong>Agent interfaces:</strong> LangGraph, OpenAI, MCP, A2A, and custom adapters normalize requests into one control-plane contract.</li>
      <li><strong>Public developer path:</strong> <code>zt-infra.org</code> and this repo provide the public quickstart, local mock control plane, and adapter onboarding path.</li>
      <li><strong>Adapter layer:</strong> SDK wrappers and protocol gateways call policy before execution.</li>
      <li><strong>Control plane:</strong> the current implemented endpoint is <code>POST /actions</code>.</li>
      <li><strong>Private AWS MVP runtime:</strong> the full infrastructure repo runs <code>zt-provisioner</code>, Tailscale access, SSM fallback, Nginx, and verification.</li>
      <li><strong>Evidence systems:</strong> audit records can be hash-chained, KMS-signed, written to CloudWatch, and optionally anchored through DAAL.</li>
    </ul>
    <h2>Current Versus Future</h2>
    <h3>Current</h3>
    <ul>
      <li>public developer site and Hello World quickstart;</li>
      <li>local mock control plane for onboarding;</li>
      <li><code>POST /actions</code> policy decision contract;</li>
      <li>signed audit record shape;</li>
      <li>framework wrappers for LangGraph, OpenAI, MCP, and A2A in the full MVP.</li>
    </ul>
    <h3>Future</h3>
    <ul>
      <li>canonical transient agent identity;</li>
      <li>workload-bound credentials;</li>
      <li>signed runtime attestation;</li>
      <li>trust bundles and federation;</li>
      <li>richer identity and authorization APIs.</li>
    </ul>`;
}

function docsShell(title, content) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Zero Trust Hello World Adapter</title>
    <style>${sharedStyles()}</style>
  </head>
  <body>
    <main>
      <nav class="top-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/quickstart">Quickstart</a>
        <a href="/docs">Docs</a>
        <a href="/demo">Demo</a>
        <a href="/demo/deny">Deny JSON</a>
        <a href="https://github.com/oscarmackjr-twg/zt-adapter-hello-world">GitHub</a>
      </nav>
      <article class="doc">
        ${content}
      </article>
    </main>
  </body>
</html>`;
}

function sharedStyles() {
  return `
    :root {
      color-scheme: light;
      --bg: #f7f8fb;
      --panel: #ffffff;
      --ink: #18202f;
      --muted: #596477;
      --line: #d9dee8;
      --accent: #126f83;
      --danger: #a92828;
      --code: #eef1f6;
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
      max-width: 1040px;
      margin: 0 auto;
      padding: 40px 20px 64px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(2rem, 6vw, 4rem);
      line-height: 1;
      letter-spacing: 0;
    }
    h2 { margin: 0 0 12px; font-size: 1.2rem; }
    h3 { margin: 28px 0 10px; }
    p { color: var(--muted); margin: 0 0 18px; }
    a { color: var(--accent); }
    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 22px 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: white;
    }
    ul, ol { color: var(--muted); padding-left: 1.4rem; }
    li { margin: 6px 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      background: var(--panel);
    }
    th, td {
      border: 1px solid var(--line);
      padding: 10px;
      text-align: left;
      vertical-align: top;
    }
    th { color: var(--ink); }
    pre {
      overflow-x: auto;
      background: #151a23;
      color: #f4f7fb;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0 22px;
    }
    code {
      background: var(--code);
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 0.92em;
    }
    pre code { background: transparent; border: 0; padding: 0; color: inherit; }
    .top-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 32px;
    }
    .top-nav a, a.button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 0 14px;
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
    .eyebrow {
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.78rem;
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }
    a.card {
      color: inherit;
      text-decoration: none;
    }
    a.card:hover { border-color: var(--accent); }
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 28px 0;
    }
    .danger { color: var(--danger); font-weight: 700; }
    .doc {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: clamp(20px, 4vw, 40px);
    }
    .doc h1 {
      font-size: clamp(2rem, 5vw, 3.4rem);
      margin-bottom: 18px;
    }
    .callout {
      margin-top: 32px;
    }
    .vulnerability-hook {
      margin-top: 28px;
      padding: 22px;
      border: 1px solid #efb8b8;
      border-left: 5px solid var(--danger);
      border-radius: 8px;
      background: #fff7f6;
    }
    .hook-label {
      color: var(--danger);
      font-weight: 800;
      text-transform: uppercase;
      font-size: 0.78rem;
      margin-bottom: 10px;
    }
    .lede { font-size: 1.08rem; }
    .status-banner {
      display: grid;
      gap: 10px;
      padding: 16px 18px;
      margin: 24px 0;
      border: 1px solid #b8d4db;
      border-left: 5px solid var(--accent);
      border-radius: 8px;
      background: #eef8fa;
      color: var(--muted);
    }
    .status-banner strong {
      color: var(--ink);
    }
    .flow {
      margin-top: 30px;
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }
    .flow-track {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) 42px minmax(150px, 1fr) 42px minmax(150px, 1fr) 42px minmax(150px, 1fr);
      gap: 10px;
      align-items: center;
      margin: 18px 0;
    }
    .flow-step {
      min-height: 94px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      padding: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfe;
    }
    .flow-step code {
      width: fit-content;
    }
    .danger-step {
      border-color: #efb8b8;
      background: #fff7f6;
    }
    .step-label {
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .flow-arrow {
      height: 2px;
      background: var(--accent);
      position: relative;
    }
    .flow-arrow::after {
      content: "";
      position: absolute;
      right: -1px;
      top: -5px;
      border-left: 9px solid var(--accent);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
    .flow-arrow.deny {
      background: var(--danger);
    }
    .flow-arrow.deny::after {
      border-left-color: var(--danger);
    }
    .signup {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
      gap: 22px;
      align-items: center;
      margin-top: 32px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #ffffff;
    }
    .signup form {
      display: grid;
      gap: 10px;
    }
    .signup label {
      font-weight: 700;
      color: var(--ink);
    }
    .signup-row {
      display: flex;
      gap: 10px;
    }
    .signup input[type="email"] {
      min-width: 0;
      flex: 1;
      min-height: 42px;
      padding: 0 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
      font: inherit;
    }
    .signup button {
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--accent);
      border-radius: 6px;
      background: var(--accent);
      color: #ffffff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .fine-print {
      margin: 0;
      font-size: 0.88rem;
    }
    .demo-player {
      margin: 24px 0 28px;
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #ffffff;
    }
    .demo-player-header {
      display: flex;
      gap: 16px;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    .demo-player-header p {
      margin-bottom: 0;
    }
    .asciinema-demo {
      min-height: 280px;
      overflow: hidden;
      border-radius: 8px;
      background: #151a23;
    }
    .asciinema-demo p {
      padding: 18px;
      color: #f4f7fb;
    }
    .asciinema-demo a {
      color: #8ed7e6;
    }
    @media (max-width: 820px) {
      .flow-track {
        grid-template-columns: 1fr;
      }
      .signup {
        grid-template-columns: 1fr;
      }
      .demo-player-header {
        flex-direction: column;
      }
      .signup-row {
        flex-direction: column;
      }
      .flow-arrow {
        width: 2px;
        height: 28px;
        justify-self: center;
      }
      .flow-arrow::after {
        right: -5px;
        top: auto;
        bottom: -1px;
        border-top: 9px solid var(--accent);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 0;
      }
      .flow-arrow.deny::after {
        border-top-color: var(--danger);
        border-left-color: transparent;
      }
    }
  `;
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const htmlParts = [];
  let paragraph = [];
  let list = null;
  let table = [];
  let fence = null;

  function flushParagraph() {
    if (paragraph.length) {
      htmlParts.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (list) {
      htmlParts.push(`<${list.type}>${list.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${list.type}>`);
      list = null;
    }
  }

  function flushTable() {
    if (table.length) {
      const [header, separator, ...rows] = table;
      if (separator && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(separator)) {
        const headers = splitTableRow(header).map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("");
        const body = rows
          .map((row) => `<tr>${splitTableRow(row).map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`)
          .join("");
        htmlParts.push(`<table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`);
      } else {
        paragraph.push(...table);
      }
      table = [];
    }
  }

  for (const line of lines) {
    if (fence) {
      if (line.startsWith("```")) {
        htmlParts.push(`<pre><code>${escapeHtml(fence.lines.join("\n"))}</code></pre>`);
        fence = null;
      } else {
        fence.lines.push(line);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushTable();
      fence = { lines: [] };
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }

    flushTable();

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      htmlParts.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = /^\s*[-*]\s+(.+)$/.exec(line);
    if (unordered) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }

    const ordered = /^\s*\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line.trim());
  }

  if (fence) {
    htmlParts.push(`<pre><code>${escapeHtml(fence.lines.join("\n"))}</code></pre>`);
  }
  flushParagraph();
  flushList();
  flushTable();
  return htmlParts.join("\n");
}

function splitTableRow(row) {
  return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function inlineMarkdown(value) {
  let htmlValue = escapeHtml(value);
  htmlValue = htmlValue.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
    return `<img src="${escapeHtml(mapMarkdownHref(String(src)))}" alt="${escapeHtml(alt)}">`;
  });
  htmlValue = htmlValue.replace(/`([^`]+)`/g, "<code>$1</code>");
  htmlValue = htmlValue.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  htmlValue = htmlValue.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
    const cleanHref = mapMarkdownHref(String(href));
    return `<a href="${escapeHtml(cleanHref)}">${escapeHtml(text)}</a>`;
  });
  return htmlValue;
}

function mapMarkdownHref(href) {
  if (/^https?:\/\//.test(href) || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }
  const normalized = href.replace(/^\.\//, "");
  const [file, anchor = ""] = normalized.split("#");
  const doc = docs.find((item) => item.file === file);
  if (!doc) {
    return href;
  }
  return `/docs/${doc.slug}${anchor ? `#${anchor}` : ""}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
