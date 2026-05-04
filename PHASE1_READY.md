# Phase 1 Ready Criteria

This document defines what "Ready" means for the public Phase 1 MVP. It separates production-ready behavior from demo, mock, and planned capabilities.

## Phase 1 MVP Definition

Phase 1 is ready when a developer can prove the core control point in five minutes:

1. start the local mock control plane;
2. register a mock agent identity;
3. attempt an unauthorized action;
4. see the action denied before execution;
5. apply a narrow policy;
6. execute only the allowed Hello World action;
7. inspect an audit-shaped decision record.

The ready state is not a claim that the public starter repo is a production agent runtime, policy engine, identity system, or sandbox. It is a claim that the adapter contract, developer path, audit envelope, and policy-before-execution behavior are understandable, testable, and stable enough for public contribution.

## Ready Now

| Capability | Ready Criteria | Evidence |
| --- | --- | --- |
| Five-minute quickstart | `docker compose up` or `npm run zt:mock` demonstrates deny and allow paths. | [README.md](./README.md), [docker-compose.yml](./docker-compose.yml) |
| Policy-before-execution | Protected actions call the control plane before running user code. | [src/zero-trust-client.js](./src/zero-trust-client.js), [ADAPTER_CONTRACT.md](./ADAPTER_CONTRACT.md) |
| Deny demo | `aws.ec2.terminate_instances` is denied and execution is skipped. | `/demo/deny`, [test/adapter.test.js](./test/adapter.test.js) |
| Allow demo | `hello-world.say_hello` runs only after policy is applied. | `/demo/allow`, [test/mock-control-plane.test.js](./test/mock-control-plane.test.js) |
| Audit record shape | Decisions include actor, action, decision, reason, hash-chain fields, and signature metadata. | [IDENTITY_AND_POLICY.md](./IDENTITY_AND_POLICY.md), [SDK_API.md](./SDK_API.md) |
| Audit verifier CLI | `zt-audit verify audit.json` validates demo audit shape and hash-chain consistency. | [bin/zt-audit.js](./bin/zt-audit.js), [test/audit-verifier.test.js](./test/audit-verifier.test.js) |
| Public broker example | Docker Local Broker shows how approved work is executed after policy allows. | [brokers/docker-local](./brokers/docker-local) |
| Nono broker example | Nono CLI Broker shows the flagship local containment pairing: zt-infra decides before execution, nono constrains the process at runtime. | [brokers/nono-cli](./brokers/nono-cli) |
| Public IaC example | Authorization Gateway Terraform skeleton uses IAM authorization, not anonymous public access. | [infra/terraform/examples/authorization-gateway](./infra/terraform/examples/authorization-gateway) |
| Security posture | Apache-2.0 license, SECURITY.md, CodeQL, dependency review, npm audit, secret scan, and SBOM workflow exist. | [LICENSE](./LICENSE), [SECURITY.md](./SECURITY.md), [.github/workflows](./.github/workflows) |
| Contribution path | CONTRIBUTING, roadmap, launch checklist, community link, and Good First Issues exist. | [CONTRIBUTING.md](./CONTRIBUTING.md), [ROADMAP.md](./ROADMAP.md), [COMMUNITY.md](./COMMUNITY.md) |

## Experimental Or Planned

| Capability | Status | Requirement Before Production Claim |
| --- | --- | --- |
| Production mTLS identity | Planned Phase 2 | Adapters authenticate with workload-bound credentials and actor spoofing is denied in tests. |
| SPIFFE/SPIRE integration | Planned Phase 2 | Agent identities map to a trust domain, issuer, expiration, and revocation flow. |
| KMS-backed public signature verification | Planned | Public verifier validates real signatures against published keys or KMS metadata. |
| DAAL decentralized audit anchoring | MVP evidence published / production reconciliation pending | Base Sepolia contract and example AWS transactions are published in [EXPLORER_VERIFICATION.md](./EXPLORER_VERIFICATION.md). Production claims still require source-to-contract mapping, reconciliation, alerting, and repeatable verifier automation. |
| Cloud execution brokers | Planned | AWS Lambda and Kubernetes brokers pass broker conformance tests without committing cloud credentials. |
| MicroVM isolation | Planned for full runtime | Isolation boundary, escape assumptions, kernel update process, and attestation evidence are documented and tested. |

## Not Ready For Phase 1 Claims

Do not claim:

- "Production-certified agent security."
- "Prompt injection prevention."
- "Every audit log is ledger verified."
- "Every agent action is cryptographically non-repudiable."
- "MicroVM isolation is implemented in the public starter repo."
- "ZT-Infra replaces OPA, Cedar, SPIFFE/SPIRE, nono, or SIEM tooling."

Approved Phase 1 claim:

```text
The public MVP demonstrates an agent action adapter contract: deny-before-execute semantics, a fail-closed SDK, broker handoff examples, audit-shaped records, and contributor-ready docs.
```
