# Zero Trust Hello World Adapter

This is the public starter repository for developers building adapters against the Zero Trust V2 infrastructure.

It is intentionally small: a Node.js Hello World service plus one demo call to the Zero Trust Control Plane.

**Tagline:** An open adapter contract and audit envelope for agent action authorization.

## Launch Trust Signals

- **License:** Apache-2.0, chosen for enterprise-friendly infrastructure adoption and explicit patent grant language.
- **Community:** Join the `Zero Trust Infrastructure` Discord: <https://discord.gg/cDS8MPX6G>.
- **Ledger explorer verification:** optional DAAL smart contract explorer verification is tracked in [EXPLORER_VERIFICATION.md](./EXPLORER_VERIFICATION.md). Base Sepolia MVP evidence is published, including direct and batched AWS smoke transactions. Production all-log claims remain pending until source mapping, reconciliation, alerting, and repeatable verifier automation are complete.

## Narrow Scope

ZT-Infra is not trying to be the identity system, policy engine, sandbox, or governance framework for agents.

Instead, it defines the integration contract those layers can meet: request shape, response shape, fail-closed semantics, audit envelope, broker handoff, and conformance tests for agent frameworks.

Use SPIFFE/SPIRE or related systems for workload identity. Use OPA, Cedar, or your governance framework for policy. Use nono, gVisor, Firecracker, Kata, or browser sandboxes for execution containment. Use ZT-Infra to make LangGraph, MCP, A2A, OpenAI wrappers, and custom adapters call those controls consistently before a tool runs and emit the same audit evidence afterward.

This repository is the public on-ramp for contributors who want to help define that adapter contract.

## Core Security Docs

Start here if you need to understand the security model before writing code:

- [Identity & Policy Spec](./IDENTITY_AND_POLICY.md): how transient agents get unique IDs and how least-privilege ABAC policies are shaped.
- [Project Scope](./PROJECT_SCOPE.md): what zt-infra is, what it is not, and how it composes with SPIFFE, OPA/Cedar, CSA ATF, nono, and observability tools.
- [Interoperability Inventory](./INTEROPERABILITY.md): supported languages, agent interfaces, brokers, and infrastructure evidence surfaces.
- [Phase 1 Ready Criteria](./PHASE1_READY.md): explicit MVP completion criteria and current versus planned claims.
- [Enterprise Readiness](./ENTERPRISE_READINESS.md): mathematical attestation, non-repudiation, optional ledger anchoring, resilience, signer security, and vendor portability.
- [Life Of A Request](./LIFE_OF_REQUEST.md): exact data flow through identity consumption, policy decision, broker execution, local audit, and optional DAAL anchoring.
- [10-Minute Web3 Integration](./WEB3_INTEGRATION.md): required DAAL environment values and setup checklist.
- [Threat Model](./THREAT_MODEL.md): what this system protects against and what remains the application developer's responsibility.
- [Risk Register](./RISK_REGISTER.md): launch and architecture risks, controls, and mitigations.
- [Incident Response](./INCIDENT_RESPONSE.md): maintainer playbook for vulnerability, secret, package, or demo incidents.
- [Day 1 Use Cases](./CASE_STUDIES.md): concrete examples for finance, cloud operations, MCP, and A2A agents.
- [ROI Metrics](./ROI_METRICS.md): cost-avoidance story and measurable operational value.
- [Why Traditional IAM Is Not Enough](./WHY_TRADITIONAL_IAM_FAILS.md): short whitepaper on why human-centric IAM needs an agent action control point.
- [Adapter Contract](./ADAPTER_CONTRACT.md): the minimum request, response, and fail-closed behavior expected from adapters.
- [Security Policy](./SECURITY.md): supported versions and private vulnerability reporting.
- [Security Artifacts](./SECURITY_ARTIFACTS.md): SAST, dependency review, secret scan, SBOM, and audit verification evidence.
- [Roadmap](./ROADMAP.md): planned Phase 2 work, including mTLS and SPIFFE/SPIRE integration.
- [Engagement Strategy](./ENGAGEMENT_STRATEGY.md): launch channels, package-manager plan, and measurement loops.
- [Ledger Explorer Verification](./EXPLORER_VERIFICATION.md): optional DAAL contract explorer verification status, example transactions, and claim boundaries.
- [Community](./COMMUNITY.md): Discord channel status, expectations, and feedback paths.
- [Governance](./GOVERNANCE.md): rules of engagement, stakeholder communication, and launch checklist.
- [Launch Checklist](./LAUNCH_CHECKLIST.md): status of review feedback, completed work, and open launch items.
- [Launch Brief](./LAUNCH_BRIEF.md): public narrative, audience, suggested launch message, and social-proof policy.
- [Social Kit](./SOCIAL_KIT.md): launch-ready copy for Hacker News, LinkedIn, X, and approved public claims.
- [SDK API](./SDK_API.md): `ZeroTrustClient` constructor, decision methods, helper methods, and fail-closed behavior.
- [Engineering Spec](./ENGINEERING_SPEC.md): required code and infrastructure changes that should be implemented deliberately.
- [Docker Local Broker](./brokers/docker-local/README.md): first public Execution Broker example.
- [Nono CLI Broker](./brokers/nono-cli/README.md): wraps `/usr/local/bin/nono` to spawn policy-approved sandboxed agents.
- [Authorization Gateway Terraform](./infra/terraform/examples/authorization-gateway/README.md): IAM-authorized public IaC example.

## Who this is for

Use this repo if you are:

- a junior developer learning how adapters connect to Zero Trust V2;
- an integration partner testing the public adapter contract;
- an end-user adapter author who needs a safe starting point.

## Five-Minute Secure Hello World

This quickstart shows the full security loop:

1. spin up a local Zero Trust control plane;
2. register a mock agent;
3. attempt an unauthorized execution and fail;
4. apply a policy;
5. execute a safe Hello World action successfully.

The local control plane is a mock for onboarding. It uses the same `/actions` request/response shape as the MVP, but its signatures are marked `MOCK_ECDSA_SHA_256`. For real infrastructure, point `ZT_CONTROL_PLANE_URL` at a deployed ZT-Infra control plane.

### Option A: Docker Compose

Use this path if you want the fewest local prerequisites:

```bash
git clone https://github.com/oscarmackjr-twg/zt-adapter-hello-world.git
cd zt-adapter-hello-world
docker compose up
```

Docker Desktop or another Docker daemon must be running before you start the stack.

In another terminal:

```bash
curl -sS http://127.0.0.1:8080/health
curl -sS http://127.0.0.1:8080/demo/deny
curl -sS -X POST http://127.0.0.1:3000/policies/allow \
  -H 'content-type: application/json' \
  -d '{"action":"hello-world.say_hello","reason":"Quickstart policy allows hello world."}'
curl -sS http://127.0.0.1:8080/demo/allow
```

Expected result:

- `/demo/deny` returns `decision: "deny"` and skips execution.
- `/demo/allow` returns `decision: "allow"` after the policy is applied.

Stop the stack:

```bash
docker compose down
```

### Option B: Local Node.js

### 1. Install

```bash
git clone https://github.com/oscarmackjr-twg/zt-adapter-hello-world.git
cd zt-adapter-hello-world
npm ci
npm test
npm run security:secrets
npm run sbom
```

### 2. Start local zt-infra mock

Terminal 1:

```bash
npm run zt:mock
```

Verify:

```bash
curl -sS http://127.0.0.1:3000/health | jq .
```

### 3. Register a mock agent

Terminal 2:

```bash
curl -sS -X POST http://127.0.0.1:3000/agents \
  -H 'content-type: application/json' \
  -d '{"actor":"hello-world-agent"}' | jq .
```

Expected:

```json
{
  "ok": true,
  "actor": "hello-world-agent",
  "registered": true
}
```

### 4. Attempt unauthorized execution

This action is intentionally dangerous and should fail:

```bash
npm run demo:deny
```

Expected:

```json
{
  "ok": false,
  "status": 403,
  "decision": "deny",
  "reason": "Mock policy blocks infrastructure termination.",
  "audit": {
    "kms_signature": {
      "algorithm": "MOCK_ECDSA_SHA_256"
    }
  }
}
```

### 5. Apply policy and execute successfully

Allow only the safe Hello World action:

```bash
curl -sS -X POST http://127.0.0.1:3000/policies/allow \
  -H 'content-type: application/json' \
  -d '{"action":"hello-world.say_hello","reason":"Quickstart policy allows hello world."}' | jq .
```

Then execute:

```bash
npm run demo:allow
```

Expected:

```json
{
  "ok": true,
  "status": 200,
  "decision": "allow",
  "executionSkipped": false,
  "result": {
    "message": "Hello from a policy-approved adapter action."
  }
}
```

### 6. Run the web adapter

Terminal 3:

```bash
cp .env.example .env
npm start
```

Open:

```text
http://127.0.0.1:8080
http://127.0.0.1:8080/health
http://127.0.0.1:8080/demo/deny
http://127.0.0.1:8080/demo/allow
```

## Requirements

- Node.js 20 or newer
- npm
- Optional: Docker Compose v2 for the containerized quickstart
- Optional: `jq` for prettier terminal output

## Deploy To Vercel

This repo is Vercel-ready. The browser homepage is served from `/`, and JSON demo endpoints remain available under the same paths.

The homepage includes a Buttondown-powered "Join the Alpha" form. It posts directly to Buttondown and does not store email addresses in this app.

1. Import the GitHub repo into Vercel:

```text
https://github.com/oscarmackjr-twg/zt-adapter-hello-world
```

2. Use the default Vercel Node.js settings. No build command is required.

3. Optional environment variables:

```text
ZT_CONTROL_PLANE_URL=https://your-control-plane.example.com
ZT_ACTOR=hello-world-agent
ZT_TOKEN=optional-bearer-token
```

Without `ZT_CONTROL_PLANE_URL`, the homepage and `/health` still render, while `/demo/deny` and `/demo/allow` return a clear `503` explaining that a control plane is not configured.

Vercel routing is defined in [vercel.json](./vercel.json), with the serverless entry point in [api/index.js](./api/index.js).

## Real zt-infra

The five-minute flow uses `npm run zt:mock`.

To use the real MVP control plane:

1. deploy ZT-Infra from the private infrastructure repo;
2. confirm `zt-provisioner` is reachable through SSM or Tailscale;
3. set:

```bash
ZT_CONTROL_PLANE_URL=http://127.0.0.1:3000
ZT_ACTOR=hello-world-agent
```

The real control plane signs audit records with AWS KMS and writes to the configured audit sink.

## Demo Endpoints

The adapter app exposes:

```text
GET /            hello response
GET /health      service health
GET /demo/deny   unauthorized action, expected deny
GET /demo/allow  safe action, expected allow after policy is applied
```

Denied response shape:

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

Adapters that need a stable evidence summary can normalize signed audit and DAAL fields:

```js
const evidence = zt.auditEvidence(decision);
console.log(evidence.daalTransactionLink);
```

See [SDK_REVIEW.md](./SDK_REVIEW.md) for notes on how this differs from the draft first-customer SDK.

## Adapter Contract

See [ADAPTER_CONTRACT.md](./ADAPTER_CONTRACT.md).

For identity provisioning, ABAC examples, and audit record semantics, see [IDENTITY_AND_POLICY.md](./IDENTITY_AND_POLICY.md).

## Execution Brokers

Execution Brokers run approved work after the control plane returns `allow`.

Examples planned for this public repo:

- Docker Local Execution Broker: [brokers/docker-local](./brokers/docker-local)
- Nono CLI Execution Broker: [brokers/nono-cli](./brokers/nono-cli)
- AWS Lambda Execution Broker
- Kubernetes Job Execution Broker

The current engineering spec for broker IaC and repository hardening is in [ENGINEERING_SPEC.md](./ENGINEERING_SPEC.md).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the broker contract.

## Audit Verification CLI

The repo includes a small verifier for audit-shaped decision responses:

```bash
npx zt-audit verify audit.json
```

or from a local checkout:

```bash
node bin/zt-audit.js verify audit.json
```

The verifier checks required actor/action/decision fields, hash-chain fields, signature metadata, and canonical hash consistency for the public demo record format. Production KMS signature verification is planned work.

## Public IaC Example

The public Terraform example deploys an IAM-authorized Lambda Authorization Gateway skeleton:

```bash
cd infra/terraform/examples/authorization-gateway
terraform init
terraform apply
```

The function URL requires AWS IAM/SigV4 authorization. It is not an anonymous public endpoint.

## Roadmap

See [ROADMAP.md](./ROADMAP.md).

Phase 2 focuses on secure service identity:

- mTLS
- SPIFFE/SPIRE integration
- workload identity mapping to `actor`

## Stable Releases

Stable versions are published as GitHub releases and tags:

```text
v0.1.0
```

Use releases when linking from public websites or tutorials.

## License

This repository is licensed under Apache-2.0. The project uses Apache-2.0 instead of MIT for the public adapter because infrastructure and security adopters usually expect explicit patent grant language.

See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Terminal Demo Recording

The repository includes an asciinema recording of the five-minute flow:

```text
recordings/agent-blocked-then-authorized.cast
```

It also includes a Nono Execution Broker recording:

```text
recordings/nono-sandbox-demo.cast
```

The website embeds both recordings on `/demo` and serves the public player sources from:

```text
public/agent-blocked-then-authorized.cast
public/nono-sandbox-demo.cast
```

To regenerate them:

```bash
asciinema rec --overwrite -c "npm run demo:record" recordings/agent-blocked-then-authorized.cast
asciinema rec --overwrite -c "npm run demo:record:nono" recordings/nono-sandbox-demo.cast
```

## Security

Do not commit secrets. Keep `.env` local.

Report vulnerabilities privately. See [SECURITY.md](./SECURITY.md).

For design-level security boundaries, see [THREAT_MODEL.md](./THREAT_MODEL.md).
For launch risks and incident handling, see [RISK_REGISTER.md](./RISK_REGISTER.md) and [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md).

This adapter is a learning repo, not a production agent runtime.
