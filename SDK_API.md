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
    },
    "daal": {
      "status": "submitted",
      "attestation_status": "verified",
      "actionHash": "0xab1347c9b9c95234aafc00921c4610711150ef4e109564c2761fda34b6d9ea80",
      "txHash": "0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
      "txLink": "https://sepolia.basescan.org/tx/0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9"
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

### `auditEvidence`

Use `auditEvidence(decision)` when an adapter needs a stable summary of signed audit and decentralized attestation fields.

```js
const decision = await zt.decide({
  action: "aws.ec2.terminate_instances",
  resource: "i-demo",
});

const evidence = zt.auditEvidence(decision);
```

Return shape:

```json
{
  "previousHash": "0000...",
  "currentHash": "aaaa...",
  "signatureAlgorithm": "ECDSA_SHA_256",
  "signatureKeyId": "test",
  "daalStatus": "submitted",
  "daalAttestationStatus": "verified",
  "daalActionHash": "0xab1347c9b9c95234aafc00921c4610711150ef4e109564c2761fda34b6d9ea80",
  "daalTransactionHash": "0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
  "daalTransactionLink": "https://sepolia.basescan.org/tx/0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9"
}
```

The helper throws when `audit` is absent. That is intentional: adapters should fail closed if a protected decision does not include evidence.

DAAL fields are optional in the public quickstart and depend on the deployed control plane. In the AWS MVP, CDP direct mode writes Base Sepolia attestations asynchronously. A single decision may show `attestation_status: "pending"` until a batch flush or reconciliation step writes the transaction hash.

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
