# Risk Register

This register tracks launch and architecture risks for the public adapter MVP. It is intentionally candid: security adopters need to see what is controlled, what is experimental, and what will be mitigated next.

| Risk | Impact | Likelihood | Current Control | Mitigation / Owner | Status |
| --- | --- | --- | --- | --- | --- |
| Policy bypass in an adapter | A sensitive tool executes without authorization. | Medium | `ZeroTrustClient.guardedCall(...)`, adapter tests, deny-before-execute docs. | Add conformance tests for every new adapter surface. Owner: maintainer. | Open |
| Actor spoofing in mock control plane | A local demo actor can claim another identity. | High in mock, low production claim | Mock docs label this as onboarding-only. | Phase 2 mTLS/SPIFFE actor binding. Owner: maintainer + contributors. | Planned |
| Performance overhead from control-plane checks | Agent workflows become too slow for adoption. | Medium | Local checks are lightweight; DAAL is explicitly asynchronous/planned. | Add latency benchmarks and target p95 decision overhead. Owner: maintainer. | Open |
| Audit hash-chain mismatch | Evidence cannot be verified after tampering or serialization drift. | Medium | `zt-audit verify` tests canonical hash consistency. | Publish machine-readable audit schema and golden fixtures. Owner: maintainer. | Open |
| KMS or DAAL outage | Evidence sink is delayed or unavailable. | Medium | Public repo does not block on DAAL; full MVP should record local audit first. | Queue audit anchors asynchronously with retry/dead-letter metrics. Owner: platform engineer. | Planned |
| MicroVM or sandbox isolation leak | Approved action escapes runtime boundary. | Low in public repo, higher in full runtime | Public repo uses Docker Local Broker only and labels microVM work as planned. | Document broker isolation assumptions and add runtime-specific hardening tests. Owner: broker contributor. | Planned |
| Secret exposure in examples or docs | Cloud keys, wallet keys, or API tokens leak publicly. | Medium | `.gitignore`, SECURITY.md, local secret scanner, GitHub secret scanning guidance. | Keep CI secret scan and GitHub push protection enabled. Owner: maintainer. | Active |
| Overclaiming decentralized audit | Market trust is damaged by claims beyond implementation. | Medium | Explorer verification doc defines approved claims and claim boundaries. | Publish contract address only after explorer source verification. Owner: maintainer. | Active |
| Unclear ownership during incident | Public vulnerability response stalls. | Medium | SECURITY.md has reporting SLA. | Use incident response playbook and war-room roles. Owner: project lead. | Active |
| Contributor confusion between mock and production | Users assume the local mock is the production control plane. | Medium | Current vs Planned banner and Phase 1 ready criteria. | Keep mock labels in README, website, and docs. Owner: docs maintainer. | Active |

## Review Cadence

Review this register before each tagged release and whenever a new broker, adapter surface, or audit sink is added.

