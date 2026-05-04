# ZT-Infra Architecture

This public architecture diagram shows how the developer site, Hello World quickstart, adapters, control plane, execution brokers, deployed runtimes, and evidence systems fit together.

![ZT-Infra current architecture](/architecture.svg)

## What This Shows

- **Agent interfaces**: LangGraph, OpenAI, MCP, A2A, and custom adapters can normalize requests into one control-plane contract.
- **Public developer path**: `zt-infra.org` and this repo provide the public quickstart, local mock control plane, and adapter onboarding path.
- **Adapter contract layer**: SDK wrappers and protocol gateways call policy before execution and return the same audit envelope.
- **Control plane**: the current implemented endpoint is `POST /actions`.
- **Execution containment layer**: brokers such as Docker Local and Nono run approved work with runtime constraints. ZT-Infra does not replace those sandboxes.
- **Deployed runtime**: production deployments should expose the control plane only through approved private access paths and keep verification evidence available to operators.
- **Evidence systems**: audit records can be hash-chained, KMS-signed, written to CloudWatch, and optionally anchored through DAAL in the full MVP.

## Layer Boundaries

| Layer | Example primitives | ZT-Infra relationship |
| --- | --- | --- |
| Identity | SPIFFE/SPIRE, NANDA-style agent identity | Consume identity and bind it into `actor`. |
| Policy / governance | CSA ATF, OPA, Cedar | Wrap policy decisions in an agent-shaped contract. |
| Execution containment | nono, gVisor, Firecracker, Kata, browser sandboxes | Handoff approved work to a broker; record evidence. |
| Observability | SIEM, OpenTelemetry, eBPF/runtime telemetry | Emit consistent audit records. |

## Current Versus Future

Current:

- public developer site and Hello World quickstart;
- local mock control plane for onboarding;
- `POST /actions` policy decision contract;
- signed audit record shape;
- Nono and Docker broker examples;
- framework wrappers for LangGraph, OpenAI, MCP, and A2A in the full MVP.

Future:

- canonical transient agent identity;
- workload-bound credentials;
- signed runtime attestation;
- trust bundles and federation;
- richer identity and authorization APIs.
