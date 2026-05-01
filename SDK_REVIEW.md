# Draft SDK Review

The first-customer draft SDK in the private planning package was reviewed before adding SDK-style content here.

## What was correct

- The SDK should expose one small client for adapter authors.
- Helper methods for LangGraph, OpenAI Responses, MCP, and A2A are useful.
- A `guardedCall` helper is the right developer experience for "check policy, then execute."
- All adapters should preserve the signed audit envelope returned by the control plane.

## What changed for this public repo

The draft SDK targets a future API:

```text
POST /authorize
```

with fields:

```json
{
  "actor": "...",
  "interface": "mcp",
  "action": "...",
  "resource": "...",
  "context": {}
}
```

The current MVP control plane exposes:

```text
POST /actions
```

with fields:

```json
{
  "actor": "...",
  "action": "...",
  "resource": "..."
}
```

So this public repo implements the draft SDK ergonomics on top of the current `/actions` endpoint.

## Public client

Use:

```js
import { ZeroTrustClient } from "./src/zero-trust-client.js";

const zt = new ZeroTrustClient({
  baseUrl: "http://127.0.0.1:3000",
  actor: "hello-world-agent",
});

const decision = await zt.mcpToolCall({
  toolName: "github.create_pull_request",
  resource: "octo/repo",
});
```

The client keeps the public repo accurate today while leaving room for a future `/authorize` API.
