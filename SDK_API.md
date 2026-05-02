# SDK API

This document describes the small public JavaScript client in `src/zero-trust-client.js`.

The SDK is intentionally minimal. Its job is to make one invariant easy to preserve:

> Protected execution must not happen until the Zero Trust Control Plane returns `allow`.

## Import

```js
import { ZeroTrustClient } from "./src/zero-trust-client.js";
```

When consumed as a package:

```js
import { ZeroTrustClient } from "zt-adapter-hello-world";
```

## Constructor

```js
const zt = new ZeroTrustClient({
  baseUrl: "http://127.0.0.1:3000",
  actor: "hello-world-agent",
  token: process.env.ZT_TOKEN,
});
```

Options:

| Option | Default | Purpose |
| --- | --- | --- |
| `baseUrl` | `process.env.ZT_CONTROL_PLANE_URL` or `http://127.0.0.1:3000` | Control plane base URL. |
| `actor` | `process.env.ZT_ACTOR` or `hello-world-agent` | Agent identity sent with decisions. |
| `token` | `process.env.ZT_TOKEN` or empty string | Optional bearer token. |
| `fetchImpl` | `globalThis.fetch` | Test hook or custom fetch implementation. |

Security note:

The public quickstart sends `actor` as request data because it is a learning mock. Production systems should bind `actor` to workload identity, such as mTLS, SPIFFE/SPIRE, cloud workload identity, or another authenticated server-side identity source.

## `decide`

Calls the current MVP decision endpoint:

```text
POST /actions
```

Usage:

```js
const decision = await zt.decide({
  actor: "hello-world-agent",
  action: "aws.ec2.terminate_instances",
  resource: "i-demo",
});
```

Request body:

```json
{
  "actor": "hello-world-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo"
}
```

Return shape:

```json
{
  "ok": false,
  "status": 403,
  "actor": "hello-world-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo",
  "decision": "deny",
  "reason": "Mock policy blocks infrastructure termination.",
  "audit": {
    "timestamp": "2026-05-01T00:00:00.000Z",
    "previous_hash": "...",
    "current_hash": "...",
    "kms_signature": {
      "algorithm": "MOCK_ECDSA_SHA_256",
      "key_id": "mock-key",
      "signature": "mock-signature"
    }
  },
  "raw": {}
}
```

## `guardedCall`

Use `guardedCall` for protected execution.

```js
const result = await zt.guardedCall({
  action: "hello-world.say_hello",
  resource: "local-demo",
  fn: async () => {
    return { message: "Hello from a policy-approved action." };
  },
});
```

Behavior:

- Calls `decide(...)`.
- If `decision !== "allow"`, returns with `executionSkipped: true`.
- If `decision === "allow"`, runs `fn`.
- The function result is returned as `result`.

Deny result:

```json
{
  "decision": "deny",
  "executionSkipped": true,
  "reason": "action is not in the allow list"
}
```

Allow result:

```json
{
  "decision": "allow",
  "executionSkipped": false,
  "result": {
    "message": "Hello from a policy-approved action."
  }
}
```

## Helper Methods

These helpers preserve a common decision contract across adapter surfaces.

### `langGraph`

```js
await zt.langGraph({
  action: "aws.ec2.terminate_instances",
  nodeName: "dangerous_node",
});
```

Maps `nodeName` to `resource` when `resource` is not provided.

### `openAIResponses`

```js
await zt.openAIResponses({
  action: "aws.ec2.terminate_instances",
  responseId: "resp_123",
});
```

Maps `responseId` to `resource` when `resource` is not provided.

### `mcpToolCall`

```js
await zt.mcpToolCall({
  toolName: "github.create_pull_request",
  resource: "octo/repo",
});
```

When `action` is omitted, the SDK derives:

```text
mcp.tool.github.create_pull_request
```

### `a2aTask`

```js
await zt.a2aTask({
  externalAgent: "github_agent",
  resource: "octo/repo",
});
```

When `action` is omitted, the SDK derives:

```text
a2a.github_agent.send_message
```

## Errors

The SDK throws `ZeroTrustClientError` when required local inputs are missing, such as:

- missing `action`;
- missing `fn` for `guardedCall`;
- missing `fetch` implementation.

Control-plane denies are not thrown as exceptions. They are normal security decisions and should be handled as `decision: "deny"`.

## Fail-Closed Rule

Adapters and brokers should preserve this rule:

```js
if (decision.decision !== "allow") {
  return { ...decision, executionSkipped: true };
}
```

Do not execute protected work when:

- decision is `deny`;
- decision is missing;
- the control plane is unavailable;
- the response cannot be parsed;
- required audit evidence is absent.

## Testing Pattern

Use an injected `fetchImpl` so tests do not need a networked control plane:

```js
const client = new ZeroTrustClient({
  fetchImpl: async () => ({
    ok: false,
    status: 403,
    async json() {
      return {
        decision: "deny",
        reason: "test policy",
        audit: {
          previous_hash: "0".repeat(64),
          current_hash: "a".repeat(64),
          kms_signature: {
            algorithm: "MOCK_ECDSA_SHA_256",
            key_id: "mock",
            signature: "mock"
          }
        }
      };
    }
  })
});
```

