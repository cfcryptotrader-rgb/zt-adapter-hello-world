# Threat Model

This repository demonstrates how an adapter asks the Zero Trust Control Plane for authorization before executing a sensitive action. The threat model is intentionally narrow so the demo remains honest and testable.

ZT-Infra is the adapter-contract and audit-envelope layer. It is not the identity provider, policy engine, sandbox, or SIEM.

## Scope

ZT-Infra protects against unauthorized tool calls.

In this public starter repository, that means:

- an adapter must call `POST /actions` before sensitive execution;
- the adapter must fail closed when the control plane denies or is unavailable;
- unregistered actors are denied;
- dangerous actions can be denied with a clear reason;
- every decision returns an audit envelope containing hashes and a signature field.

## Out Of Scope

ZT-Infra does not prevent LLM prompt injection. Prompt injection prevention is the application's responsibility.

Also out of scope for this starter repository:

- replacing SPIFFE/SPIRE, NANDA-style identity, OPA, Cedar, CSA ATF, nono, microVMs, or SIEM tooling;
- malicious code that runs after an action has already been allowed;
- compromised developer laptops or CI runners;
- secrets committed by users outside this repository;
- vulnerabilities in downstream cloud providers, SaaS APIs, MCP servers, or A2A peers;
- network hardening of the local mock control plane;
- production-grade key custody in the mock control plane;
- model hallucination or unsafe application logic before the adapter calls the control plane.

## Assets

The important assets are:

- agent identity, represented by `actor`;
- policy rules and decision logic;
- audit records, including previous hash, current hash, and signature;
- control-plane tokens or credentials;
- execution broker credentials;
- downstream tools and resources protected by policy.

## Trust Boundaries

```text
Agent or app code
  -> adapter SDK
  -> Zero Trust Control Plane
  -> policy decision
  -> execution broker or downstream tool
```

The control plane is the policy boundary. The adapter must not execute the protected action until it receives `allow`.

For the local quickstart, the mock control plane is a developer convenience. It demonstrates request shape and fail-closed behavior, but it does not provide real cryptographic custody.

## Threats And Mitigations

| Threat | Mitigation |
| --- | --- |
| Agent attempts unauthorized tool call | Deny-by-default policy and `guardedCall(...)` skip execution on deny. |
| Unknown transient agent invokes a protected action | Control plane rejects unregistered `actor` values. |
| Adapter bypasses policy check | Contract and tests require policy decision before execution; broker contributions must use `guardedCall(...)`. |
| Dangerous action appears in demo | Deny rule blocks `aws.ec2.terminate_instances` by default. |
| Audit record is edited locally | Hash chain makes edits detectable when compared with the expected current hash and signature. |
| Audit signature is forged in local demo | Local demo labels signatures as `MOCK_ECDSA_SHA_256`; production must use KMS-backed signatures. |
| Control plane unavailable | Adapter fails closed and skips protected execution. |
| Overbroad policy allows too much | ABAC examples document least-privilege policy by actor, action, resource, environment, and approval context. |
| Prompt injection tells an agent to call a dangerous tool | Control plane can deny the resulting tool call, but detecting prompt injection remains the application's responsibility. |
| Approved action performs harmful logic | ZT-Infra validates authorization, not business correctness of the approved function. |
| Approved action tries to exceed runtime permissions | Execution containment belongs to the broker layer. The Nono broker can map allowed actions to kernel-enforced Landlock or Seatbelt constraints. |

## Security Invariants

Adapter examples should preserve these invariants:

- no protected action runs before policy returns `allow`;
- deny means no execution;
- control-plane error means no execution;
- every decision response includes `decision`, `reason`, and `audit`;
- audit records use the same field names across LangGraph, OpenAI Responses, MCP, A2A, and custom adapters;
- examples do not require real cloud credentials in CI.

## Residual Risk

This starter repository is not a production control plane. It is an onboarding artifact for adapter developers. Production deployments should add:

- authenticated workload identity, preferably mTLS or SPIFFE/SPIRE;
- server-side actor binding so clients cannot spoof `actor`;
- KMS-backed signing;
- durable audit storage;
- rate limits and replay protection;
- policy review workflow;
- execution broker isolation.
