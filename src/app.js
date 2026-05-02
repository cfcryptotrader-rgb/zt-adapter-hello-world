import fs from "node:fs/promises";
import path from "node:path";

import { checkAction } from "./adapter.js";

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
    slug: "threat-model",
    title: "Threat Model",
    file: "THREAT_MODEL.md",
    summary: "What this MVP protects, what it does not protect, and residual risks.",
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
    slug: "sdk-review",
    title: "SDK Review",
    file: "SDK_REVIEW.md",
    summary: "How the public client differs from the first-customer draft SDK.",
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
      message: "Hello from a Zero Trust adapter.",
      next: ["/docs", "/health", "/demo/deny", "/demo/allow"],
    });
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
    const markdown = await fs.readFile(path.join(process.cwd(), doc.file), "utf8");
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
        <a class="button primary" href="/docs">Read the docs</a>
        <a class="button" href="/docs/readme">Quickstart</a>
        <a class="button" href="/demo/deny">Unauthorized action</a>
        <a class="button" href="/demo/allow">Allowed action</a>
        <a class="button" href="/health">Health JSON</a>
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
      <section class="grid" aria-label="Documentation">
        ${docs
          .slice(0, 6)
          .map(
            (doc) => `<a class="card doc-link" href="/docs/${escapeHtml(doc.slug)}">
          <h2>${escapeHtml(doc.title)}</h2>
          <p>${escapeHtml(doc.summary)}</p>
        </a>`,
          )
          .join("")}
      </section>
    </main>
  </body>
</html>`;
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
        <a href="/docs">Docs</a>
        <a href="/demo/deny">Deny JSON</a>
        <a href="/health">Health</a>
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
    .lede { font-size: 1.08rem; }
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
