# Roadmap

This repository is the public adapter starting point for Zero Trust V2.

## Phase 1: Hello World Adapter

Status: current

- Local mock Zero Trust control plane.
- Agent registration.
- Deny-before-execute demo.
- Allow-before-execute demo.
- Tiny JavaScript client.
- CI tests.

## Phase 2: Secure Service Identity

Planned:

- mTLS between adapters and the Zero Trust Control Plane.
- SPIFFE/SPIRE identity integration.
- Workload identity mapping to `actor`.
- Certificate rotation examples.
- Signed adapter metadata.

Why it matters:

Adapters should not rely only on bearer tokens or network location. Workload identity lets the control plane reason about which service, broker, or agent is requesting execution.

## Phase 3: Execution Brokers

Planned:

- AWS Lambda Execution Broker.
- Kubernetes Job Execution Broker.
- Container sandbox broker example.
- Broker conformance test suite.

Execution Brokers are responsible for running approved actions after policy allows execution.

## Phase 4: Evidence Integrations

Planned:

- OpenTelemetry export examples.
- SIEM-friendly JSON event format.
- GitHub Actions evidence bundle.
- DAAL/blockchain attestation sample integration.

## Non-Goals

- This repo will not contain production secrets.
- This repo will not become the full private infrastructure control plane.
- This repo will keep examples small enough for new adapter authors to understand.
