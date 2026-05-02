# ZT-Infra Architecture

This public architecture diagram shows how the developer site, Hello World quickstart, adapters, control plane, private AWS MVP, and evidence systems fit together.

![ZT-Infra current architecture](/architecture.svg)

## What This Shows

- **Agent interfaces**: LangGraph, OpenAI, MCP, A2A, and custom adapters can normalize requests into one control-plane contract.
- **Public developer path**: `zt-infra.org` and this repo provide the public quickstart, local mock control plane, and adapter onboarding path.
- **Adapter layer**: SDK wrappers and protocol gateways call policy before execution.
- **Control plane**: the current implemented endpoint is `POST /actions`.
- **Private AWS MVP runtime**: the full infrastructure repo runs the deployed `zt-provisioner`, Tailscale access, SSM fallback, Nginx, and verification system.
- **Evidence systems**: audit records can be hash-chained, KMS-signed, written to CloudWatch, and optionally anchored through DAAL in the full MVP.

## Current Versus Future

Current:

- public developer site and Hello World quickstart;
- local mock control plane for onboarding;
- `POST /actions` policy decision contract;
- signed audit record shape;
- framework wrappers for LangGraph, OpenAI, MCP, and A2A in the full MVP.

Future:

- canonical transient agent identity;
- workload-bound credentials;
- signed runtime attestation;
- trust bundles and federation;
- richer identity and authorization APIs.
