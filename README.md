# Zero Trust Hello World Adapter

This is the public starter repository for developers building adapters against the Zero Trust V2 infrastructure.

It is intentionally small: a Node.js Hello World service plus one demo call to the Zero Trust Control Plane.

## Who this is for

Use this repo if you are:

- a junior developer learning how adapters connect to Zero Trust V2;
- an integration partner testing the public adapter contract;
- an end-user adapter author who needs a safe starting point.

## What you will build

You will run a small app with:

- `GET /` hello response;
- `GET /health` service health;
- `GET /demo/deny` example policy check against the Zero Trust Control Plane.

The demo action is intentionally dangerous:

```text
aws.ec2.terminate_instances
```

The expected result is `deny`.

## Requirements

- Node.js 20 or newer
- npm
- Optional: access to a running Zero Trust Control Plane at `http://127.0.0.1:3000`

## Quick Start

```bash
git clone https://github.com/REPLACE_ME/zt-adapter-hello-world.git
cd zt-adapter-hello-world
npm ci
npm test
npm start
```

Open:

```text
http://127.0.0.1:8080
http://127.0.0.1:8080/health
```

## Connect to the Control Plane

Copy the example environment file:

```bash
cp .env.example .env
```

Set:

```bash
ZT_CONTROL_PLANE_URL=http://127.0.0.1:3000
ZT_ACTOR=hello-world-agent
```

Run the denial demo:

```bash
npm run demo:deny
```

Or call the app endpoint:

```bash
curl -sS http://127.0.0.1:8080/demo/deny | jq .
```

Expected shape:

```json
{
  "ok": false,
  "status": 403,
  "decision": "deny",
  "reason": "...",
  "audit": {
    "previous_hash": "...",
    "current_hash": "...",
    "kms_signature": {
      "algorithm": "ECDSA_SHA_256"
    }
  }
}
```

## SDK-Style Usage

This repo includes a tiny public client inspired by the first-customer SDK draft, adapted to the current MVP `/actions` API.

```js
import { ZeroTrustClient } from "./src/zero-trust-client.js";

const zt = new ZeroTrustClient({
  baseUrl: "http://127.0.0.1:3000",
  actor: "hello-world-agent",
});

const decision = await zt.guardedCall({
  action: "aws.ec2.terminate_instances",
  resource: "i-demo",
  fn: async () => {
    return "this only runs if policy allows";
  },
});

console.log(decision);
```

Helper methods are included for common adapter surfaces:

```js
await zt.langGraph({ action, nodeName });
await zt.openAIResponses({ action, responseId });
await zt.mcpToolCall({ toolName, resource });
await zt.a2aTask({ externalAgent, resource });
```

See [SDK_REVIEW.md](./SDK_REVIEW.md) for notes on how this differs from the draft first-customer SDK.

## Adapter Contract

See [ADAPTER_CONTRACT.md](./ADAPTER_CONTRACT.md).

## Stable Releases

Stable versions are published as GitHub releases and tags:

```text
v0.1.0
```

Use releases when linking from public websites or tutorials.

## Security

Do not commit secrets. Keep `.env` local.

This adapter is a learning repo, not a production agent runtime.
