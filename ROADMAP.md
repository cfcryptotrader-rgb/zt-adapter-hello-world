# Roadmap

This repository is the public adapter-contract starting point for Zero Trust V2.

Product thesis: ZT-Infra should own the agent-action adapter contract, not every security primitive around it. The contract defines how agent frameworks ask for authorization, fail closed, hand approved work to brokers, and emit audit evidence. Identity can come from SPIFFE/SPIRE or NANDA-style patterns, policy can come from OPA/Cedar and CSA ATF-aligned governance, execution containment can come from nono or microVM/container sandboxes, and observability can come from SIEM/runtime telemetry.

Contributor vision: this project is for people who want to define the portable authorization contract for agent actions. The goal is intentionally narrow and defensible: one adapter shape, one audit envelope, one conformance suite, many identity/policy/sandbox backends.

## Phase 1: Hello World Adapter

Status: current

| Item | Status | Notes |
| --- | --- | --- |
| Local mock Zero Trust control plane | Done | `npm run zt:mock` and Docker Compose path. |
| Agent registration | Done | `POST /agents` in the mock control plane. |
| Deny-before-execute demo | Done | `npm run demo:deny` and `/demo/deny`. |
| Allow-before-execute demo | Done | `npm run demo:allow` after policy allow. |
| Tiny JavaScript client SDK | Done | `ZeroTrustClient` with `guardedCall`. |
| Docker Compose quickstart | Done | `docker compose up` runs mock control plane and web adapter. |
| Docker Local Execution Broker | Done | First public broker example under `brokers/docker-local`. |
| Audit verification CLI | Done | `zt-audit verify audit.json`. |
| Public Authorization Gateway IaC skeleton | Done | IAM-authorized Lambda Function URL Terraform example. |
| CodeQL, Dependabot, dependency review | Done | GitHub workflows and repository settings. |
| Good First Issue backlog | Done | Three labeled onboarding issues. |
| GitHub Project board | Planned | Managed outside the public adapter source tree. |
| Community feedback path | Done | Moderated community channel and GitHub issue path documented. |
| DAAL public testnet proof | MVP Evidence Published | Verification criteria are documented. Production reconciliation, alerting, and verifier automation remain planned. |
| Production identity binding | In Progress | Phase 2 extends service identity with mTLS/SPIFFE consumption and actor binding; zt-infra is not replacing SPIFFE/SPIRE. |
| Phase 1 ready criteria | Done | `PHASE1_READY.md` defines current, experimental, and non-claimable capabilities. |
| Risk register | Done | `RISK_REGISTER.md` tracks launch and architecture risks. |
| Incident response playbook | Done | `INCIDENT_RESPONSE.md` defines freeze and recovery steps. |
| SBOM and secret-scan CI | Done | CI runs local secret scan and uploads a CycloneDX SBOM artifact. |

## Adapter Roadmap Status

| Workstream | Done | In Progress | Next |
| --- | --- | --- | --- |
| Developer onboarding | README quickstart, Docker Compose, docs site, Good First Issues | Improve CLI help and fixtures through public issues | Add SDK API reference |
| Adapter contract | `/actions`, deny/allow demos, guarded SDK call, audit envelope | Versioned request/response schema | Conformance suite across adapter surfaces |
| Policy engine integration | Mock policy evaluator | OPA/Cedar policy templates | Engine-agnostic PDP adapters |
| Execution | Docker Local Broker, Nono CLI Broker | Cloud broker design | AWS Lambda and Kubernetes Job brokers |
| Evidence | Audit-shaped responses and hash verifier CLI | KMS signature verification docs, DAAL source-to-contract mapping, reconciliation alerts | DAAL verifier integration and reconciliation docs |
| Infrastructure | Public IAM-authorized gateway skeleton | Full one-command gateway + broker | Hardened production modules |
| Governance | SECURITY, CONTRIBUTING, branch protection, CodeQL, Dependabot | Project board pending auth scope | Contributor milestones and release cadence |

## Phase 2: Workload Identity Extensions

Planned:

- mTLS between adapters and the Zero Trust Control Plane.
- SPIFFE/SPIRE identity integration.
- Workload identity mapping to `actor`.
- Certificate rotation examples.
- Signed adapter metadata.
- Agent ID profile that defines canonical AI agent identifiers, such as `ztid://tenant/workload/agent/session` and `spiffe://tenant.example/agent/session`.
- Agent registration API that binds transient agent IDs to workload identity, runtime metadata, owner, policy namespace, and expiration.
- Short-lived agent credentials with automatic rotation and explicit TTLs.
- Server-side actor binding so clients cannot spoof `actor` in `POST /actions`.
- Revocation flow for compromised, expired, or completed agent sessions.

Why it matters:

Adapters should not rely only on bearer tokens or network location. Workload identity lets the adapter contract bind `actor` to a real workload identity. ZT-Infra should consume those identities, not replace the system that issues them.

Next requirements:

- define the canonical AI-agent identity profile;
- map local mock actors to workload-bound identity in production examples;
- document credential issuance patterns equivalent to SPIFFE SVID issuance;
- define trust bundle shape for control-plane roots and accepted issuers;
- document revocation for transient agents that finish a task or become compromised.

Exit criteria:

- an adapter can request a short-lived agent identity;
- the control plane can bind `actor` to authenticated workload identity;
- a verifier can validate the agent identity issuer, expiration, and trust domain;
- a denied spoofed-actor request is covered by tests.

## Phase 3: Agent Attestation

Planned:

- Runtime attestation envelope for agent launch context, model/provider, tool manifest, policy namespace, sandbox type, code digest, and broker identity.
- Signed agent metadata document that travels with every audit event.
- Optional TPM, Nitro Enclave, container image digest, or CI provenance hooks where available.
- Attestation verification endpoint for adapters and auditors.
- Tamper-evident binding between `actor`, attestation hash, policy decision, and audit record.

Why it matters:

SPIFFE identifies workloads. The adapter contract also needs explainable runtime context: which model, which tool manifest, which sandbox, which broker, which policy, and which code produced the action.

Next requirements:

- extend audit records with runtime-context attestations;
- bind demo agents to code digest, model identity, tool manifest, and broker context where practical;
- publish a reusable attestation schema that LangGraph, OpenAI Responses, MCP, and A2A adapters can share.

Exit criteria:

- all demo adapters can attach the same attestation envelope;
- audit records include an attestation hash;
- tests prove an action is denied when required attestation fields are missing or stale.

## Phase 4: Trust Bundles And Federation

Planned:

- Trust domain model for organizations, teams, brokers, and external agents.
- Trust bundle document containing accepted issuers, public keys, policy namespaces, and expiration metadata.
- Trust bundle discovery endpoint.
- Federation example where one organization accepts a constrained external agent from another trust domain.
- Cross-domain deny examples for untrusted MCP and A2A calls.

Why it matters:

The SPIFFE analogy only becomes real when identities can cross boundaries safely. Agents will call tools across teams, vendors, SaaS providers, and customer environments.

Next requirements:

- define a trust-domain abstraction;
- define a signed bundle format for accepted issuers and verification roots;
- model external A2A and MCP identities as federated principals;
- document trust negotiation and downgrade behavior.

Exit criteria:

- a verifier can load a trust bundle and validate an agent identity from another trust domain;
- external agents are denied by default until a trust bundle and policy allow them;
- federation behavior is covered by local tests without cloud credentials.

## Phase 5: Execution Brokers

Planned:

- AWS Lambda Execution Broker.
- Kubernetes Job Execution Broker.
- Container sandbox broker example.
- Broker conformance test suite.
- Broker identity profile so each broker has its own workload identity distinct from the agent identity.
- Broker attestation checks before running approved work.
- Policy rules that constrain which broker types may execute which action families.
- Broker isolation evidence attached to the audit record.

Execution Brokers are responsible for running approved actions after policy allows execution.

## Phase 6: Policy And Conformance

Planned:

- OPA and Cedar policy adapter examples.
- Cedar policy templates for common agent ABAC patterns.
- ABAC policy schema versioning.
- Policy decision conformance tests shared across LangGraph, OpenAI Responses, MCP, A2A, and custom SDKs.
- Golden audit record fixtures.
- Negative tests for spoofed actor, expired credential, missing attestation, untrusted issuer, and overbroad action.
- Compatibility matrix for supported adapter protocols.

Why it matters:

OCI succeeded because container behavior became portable across runtimes. This project needs the same kind of portability for agent policy decisions and audit evidence.

Next requirements:

- publish a versioned policy schema;
- publish a conformance suite for third-party adapter authors;
- publish audit fields as a machine-readable schema.

Exit criteria:

- public adapter contributors can run one command to prove conformance;
- the same deny/allow fixture works across every supported adapter surface;
- audit schema validation is part of CI.

## Phase 7: Evidence Integrations

Planned:

- OpenTelemetry export examples.
- SIEM-friendly JSON event format.
- GitHub Actions evidence bundle.
- Optional DAAL ledger-attestation sample integration.
- Verified DAAL contract source on Base Sepolia or Polygon Amoy explorer.
- Example `ActionLogged` transaction linked from public docs. MVP Base Sepolia direct and batched AWS smoke transactions are published; production readiness still needs source-to-contract mapping, reconciliation, and alerting.
- Trust-bundle and agent-attestation evidence export.
- Compliance mapping from adapter decisions, broker evidence, and audit controls to SOC 2 evidence.
- Verifier CLI that checks identity signature, trust bundle, hash chain, and optional DAAL transaction.

## Non-Goals

- This repo will not contain production secrets.
- This repo will not become a full production control plane implementation.
- This repo will keep examples small enough for new adapter authors to understand.

## Nono Status

Nono is part of the public adapter MVP as an optional Execution Broker and the flagship local containment example.

Earlier planning used "Nono" as a possible narrative or assistant persona. The current role is now concrete: the public repository includes a Nono CLI broker that converts approved Zero Trust actions into least-privilege `nono run` capability flags. ZT-Infra answers "should this run?" and nono answers "what will the kernel permit if it does run?" Contributors should keep the integration focused on policy-before-execution, sandbox spawn safety, capability mapping, and audit evidence.
