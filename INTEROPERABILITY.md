# Interoperability Inventory

ZT-Infra currently supports two primary SDK/runtime languages and eleven concrete integration interfaces.

The strongest current interoperability story is:

```text
LangGraph, OpenAI Responses, OpenAI Assistants, OpenAI Agents SDK, MCP, A2A, Docker, and Nono all converge on the same POST /actions policy decision and signed audit record shape.
```

## Language Support

| Category | Language / Format | Status | Where |
| --- | --- | --- | --- |
| Primary SDK/runtime | Python | Implemented | `zt_langgraph`, `zt_openai`, `zt_mcp`, `zt_a2a`, pytest integration tests |
| Primary SDK/runtime | JavaScript / Node.js | Implemented | `provisioner`, public `ZeroTrustClient`, Docker broker, Nono broker, Vercel site |
| Infrastructure | Terraform / HCL | Implemented | AWS VPC, EC2, IAM, CloudWatch, GuardDuty, KMS, public gateway example |
| Operations | Bash | Implemented | deploy, preflight, evidence, Tailscale secret, incident freeze scripts |
| Audit / DAAL | Solidity | Partial | `contracts/DAALog.sol`; public explorer verification remains pending |
| Specs and configuration | YAML / JSON / OpenAPI | Implemented | SOC 2 mappings, policies, OpenAPI, audit evidence, package configs |

Summary:

- primary application integration languages: 2;
- total project languages and configuration formats: 6.

## Agent And Protocol Interfaces

| Interface | Status | Notes |
| --- | --- | --- |
| Control Plane REST API | Implemented | `POST /actions` policy decision API. |
| LangGraph | Implemented | Python policy-gate node in `zt_langgraph`. |
| OpenAI Responses API | Implemented | Preferred OpenAI wrapper in `zt_openai.responses`. |
| OpenAI Assistants API | Implemented | Legacy/interoperability wrapper. |
| OpenAI Agents SDK Guardrail | Implemented | Guardrail adapter in `zt_openai.agents_sdk`. |
| MCP | Implemented | JSON-RPC MCP Zero Trust Gateway in `zt_mcp`. |
| A2A | Implemented | JSON-RPC A2A Policy Proxy in `zt_a2a`. |
| JavaScript SDK Client | Implemented | Public `ZeroTrustClient` in this repo. |
| Docker Local Broker | Implemented | Public execution broker example. |
| Nono CLI Broker | Implemented | Wraps `/usr/local/bin/nono` for sandboxed agent execution. |
| Audit Verifier CLI | Implemented | `zt-audit verify audit.json`. |

Summary:

- agent/protocol interfaces: 11.

## Infrastructure And Evidence Interfaces

| Interface | Status | Notes |
| --- | --- | --- |
| AWS Terraform deployment | Implemented | VPC, EC2, IAM, KMS, SSM, CloudWatch, GuardDuty. |
| AWS SSM | Implemented | Fallback access path; no SSH required. |
| Tailscale | Implemented | Zero Trust access and Serve path. |
| CloudWatch Logs | Implemented | Audit/evidence destination. |
| KMS signatures | Implemented in MVP path | Signed audit records. |
| DAAL smart contract | Partial / planned-public-proof | Solidity contract exists; public explorer verification still pending. |
| Vercel public developer site | Implemented | `zt-infra.org` public adapter docs and demo site. |

Summary:

- infrastructure/evidence interfaces: 7.

## Current Boundaries

Implemented means the repository contains code, tests, or deployable examples for the interface. Partial means code or design artifacts exist, but the public claim is intentionally bounded until external proof is available.

DAAL remains the main bounded gap: the contract exists, but the public docs should not claim explorer-verifiable audit anchoring until a verified Base Sepolia or Polygon Amoy contract address and example transaction are published.

