# Project Scope

ZT-Infra is an open adapter contract and audit envelope for agent action authorization.

It is designed to plug into existing identity systems, policy engines, sandboxes, and observability tools so every agent framework does not invent its own authorization flow.

## Narrow Positioning

The durable contribution is the adapter contract:

- request shape for agent actions;
- response shape for allow/deny decisions;
- fail-closed SDK semantics;
- audit envelope fields;
- broker handoff conventions;
- conformance tests across LangGraph, MCP, A2A, OpenAI wrappers, and custom adapters.

This is closer to defining the agent-action equivalent of a portability contract than building every security primitive ourselves.

## Layer Model

| Layer | Better Primitive | ZT-Infra Role |
| --- | --- | --- |
| Identity | SPIFFE/SPIRE for workload identity; NANDA-style cross-org agent identity patterns where applicable. | Consume and bind authenticated identity into the action request. |
| Policy / governance | CSA Agentic Trust Framework for governance; OPA or Cedar for policy evaluation. | Wrap decisions in an agent-shaped contract and preserve fail-closed semantics. |
| Execution containment | nono for local/CLI agents; gVisor, Firecracker, Kata, or browser sandboxes for other runtimes. | Call the broker only after policy returns `allow`; capture broker evidence. |
| Observability | SIEM, OpenTelemetry, eBPF/runtime telemetry, CloudWatch, audit stores. | Emit a consistent audit envelope that those systems can ingest. |

ZT-Infra is not trying to replace any of those layers.

## What ZT-Infra Is Not

- Not a policy engine. OPA, Cedar, and similar engines are better places to express and evaluate policy.
- Not a sandbox. nono, gVisor, Firecracker, Kata, and browser sandboxes are better execution boundaries.
- Not a governance framework. CSA ATF and similar standards define governance maturity better than a single adapter repo can.
- Not a workload identity system. SPIFFE/SPIRE and related identity systems are the right foundation for authenticated workloads.

## What ZT-Infra Is

ZT-Infra is the integration glue for agent action control:

```text
agent framework -> adapter contract -> policy decision -> broker handoff -> audit envelope
```

The control point answers:

```text
Should this agent action run, and what evidence proves the decision?
```

The broker then answers:

```text
If it is allowed, what can the operating system or runtime actually permit?
```

## nono As Flagship Containment Example

nono lives at the execution containment layer. It uses Linux Landlock and macOS Seatbelt to make unauthorized filesystem operations structurally impossible for the sandboxed process. If an agent attempts a disallowed operation, the kernel denies it rather than trusting the agent to behave.

ZT-Infra composes with nono:

```text
ZT-Infra: should this action run?
nono: even if it runs, what can the process actually touch?
```

That is the defense-in-depth story. Policy mistakes should not automatically become kernel permission mistakes.

References:

- nono OS sandbox docs: <https://nono.sh/os-sandbox>
- nono project site: <https://nono.sh/>
- CSAI Foundation announcement on securing the agentic control plane: <https://cloudsecurityalliance.org/press-releases/2026/04/29/csai-foundation-announces-key-milestones-to-secure-the-agentic-control-plane>

## Why Contribute

The white space is at the integration boundaries:

- LangGraph decorators that wrap tool calls automatically.
- MCP middleware that calls a policy decision point before dispatch.
- A2A peer attestation hooks.
- Cedar and OPA policy templates for common agent ABAC patterns.
- SPIFFE/SPIRE actor binding to close the mock actor-spoofing gap.
- Adapter conformance tests so frameworks can prove they preserve fail-closed behavior.

The project wins if adapter authors can target one contract instead of rebuilding the authorization dance for every framework.

## Claim Boundary

Approved short pitch:

```text
An open adapter contract and audit envelope for agent action authorization, designed to plug into your existing identity, policy engine, and sandbox.
```

Avoid:

```text
The one-stop security layer for autonomous agents.
```
