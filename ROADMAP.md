# Roadmap

This repository is the public adapter starting point for Zero Trust V2.

Product thesis: Zero Trust V2 is trying to become the SPIFFE-like identity and policy layer for AI agents. That means the roadmap must move beyond demo authorization into portable agent identity, verifiable workload attestation, federated trust bundles, and conformance tests that adapter authors can implement consistently.

Contributor vision: this project is for people who want to help define the next decade of autonomous system security. The work is not just another SDK wrapper; it is the identity, policy, and evidence substrate that lets humans safely delegate actions to agents across tools, runtimes, clouds, and organizations.

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
| GitHub Project board | In Progress | Requires `gh auth refresh -s project,read:project`. |
| Newsletter / alpha capture | Done | Homepage includes Buttondown alpha signup. |
| Community hub | Done | Discord channel `Zero Trust Infrastructure` is linked from README, homepage, and COMMUNITY.md. |
| DAAL public testnet proof | In Progress | Hook planned; full contract-as-a-service example not yet public. Explorer verification requirements are documented in `EXPLORER_VERIFICATION.md`. |
| Production identity binding | In Progress | Phase 2 mTLS/SPIFFE work. |
| Phase 1 ready criteria | Done | `PHASE1_READY.md` defines current, experimental, and non-claimable capabilities. |
| Risk register | Done | `RISK_REGISTER.md` tracks launch and architecture risks. |
| Incident response playbook | Done | `INCIDENT_RESPONSE.md` defines freeze and recovery steps. |
| SBOM and secret-scan CI | Done | CI runs local secret scan and uploads a CycloneDX SBOM artifact. |

## 90-Day Launch Status

| Workstream | Done | In Progress | Next |
| --- | --- | --- | --- |
| Developer onboarding | README quickstart, Docker Compose, docs site, Good First Issues | Improve CLI help and fixtures through public issues | Add SDK API reference |
| Policy enforcement | Mock `/actions`, deny/allow demos, guarded SDK call | Versioned policy schema | Conformance suite across adapter surfaces |
| Execution | Docker Local Broker | Cloud broker design | AWS Lambda and Kubernetes Job brokers |
| Evidence | Audit-shaped responses, hash verifier CLI | KMS signature verification docs | DAAL testnet proof and verifier integration |
| Infrastructure | Public IAM-authorized gateway skeleton | Full one-command gateway + broker | Hardened production modules |
| Governance | SECURITY, CONTRIBUTING, branch protection, CodeQL, Dependabot | Project board pending auth scope | Contributor milestones and release cadence |

## Phase 2: Secure Service Identity

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

Adapters should not rely only on bearer tokens or network location. Workload identity lets the control plane reason about which service, broker, or agent is requesting execution.

Current gaps:

- `actor` is documented, but no canonical AI-agent identity profile exists yet.
- The public mock allows `POST /agents` registration without proof of workload identity.
- There is no agent credential issuance flow equivalent to SPIFFE SVID issuance.
- There is no trust bundle format for distributing control-plane roots or accepted issuers.
- There is no revocation story for transient agents that finish a task or become compromised.

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

SPIFFE identifies workloads. AI agents also need explainable runtime context: which model, which tool manifest, which sandbox, which broker, which policy, and which code produced the action.

Current gaps:

- Audit records identify actor/action/decision, but do not yet prove the runtime context of the agent.
- The Hello World mock does not bind an agent to a code digest, model identity, tool manifest, or sandbox.
- There is no reusable attestation schema that LangGraph, OpenAI Responses, MCP, and A2A adapters can share.

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

Current gaps:

- There is no trust domain abstraction.
- There is no signed bundle format for distributing accepted issuers or verification roots.
- External A2A and MCP identities are treated as policy strings, not federated principals.
- There is no documented trust negotiation or downgrade path.

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

- ABAC policy schema versioning.
- Policy decision conformance tests shared across LangGraph, OpenAI Responses, MCP, A2A, and custom SDKs.
- Golden audit record fixtures.
- Negative tests for spoofed actor, expired credential, missing attestation, untrusted issuer, and overbroad action.
- Compatibility matrix for supported adapter protocols.

Why it matters:

SPIFFE succeeded because identity behavior is portable. This project needs the same portability for agent policy decisions and audit evidence.

Current gaps:

- The docs show ABAC examples, but there is no versioned policy schema.
- There is no official conformance suite for third-party adapter authors.
- Audit fields are documented, but not published as a machine-readable schema.

Exit criteria:

- public adapter contributors can run one command to prove conformance;
- the same deny/allow fixture works across every supported adapter surface;
- audit schema validation is part of CI.

## Phase 7: Evidence Integrations

Planned:

- OpenTelemetry export examples.
- SIEM-friendly JSON event format.
- GitHub Actions evidence bundle.
- DAAL/blockchain attestation sample integration.
- Verified DAAL contract source on Base Sepolia or Polygon Amoy explorer.
- Example `ActionLogged` transaction linked from public docs.
- Trust-bundle and agent-attestation evidence export.
- Compliance mapping from identity, policy, and audit controls to SOC 2 evidence.
- Verifier CLI that checks identity signature, trust bundle, hash chain, and optional DAAL transaction.

## Non-Goals

- This repo will not contain production secrets.
- This repo will not become the full private infrastructure control plane.
- This repo will keep examples small enough for new adapter authors to understand.

## Nono Status

Nono is part of the public adapter MVP as an optional Execution Broker.

Earlier planning used "Nono" as a possible narrative or assistant persona. The current role is now concrete: the public repository includes a Nono CLI broker that converts approved Zero Trust actions into least-privilege `nono run` capability flags. Contributors should keep the integration focused on policy-before-execution, sandbox spawn safety, and audit evidence.
