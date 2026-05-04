# Changelog

## 0.1.0

- Initial public Hello World adapter.
- Adds health endpoint, demo deny flow, demo allow flow, local mock control plane, and CI test workflow.
- Adds public security policy, roadmap, and contribution guidance for Execution Brokers.
- Adds Identity & Policy and Threat Model docs for public adapter authors.
- Expands the roadmap around the adapter-contract thesis, including SPIFFE/SPIRE consumption, attestation metadata, trust bundles, federation, and conformance gaps.
- Makes the contributor-facing vision prominent: defining the next decade of autonomous system security.
- Adds Vercel deployment support with a browser-friendly homepage.
- Adds a reusable architecture diagram and public `/docs/architecture` page.
- Adds launch-review documentation: Day 1 use cases, IAM whitepaper, launch brief, governance checklist, and engineering change spec.
- Promotes use cases and IAM narrative on the homepage.
- Adds `npm audit --omit=dev` to CI.
- Adds the first public Execution Broker: `brokers/docker-local`.
- Adds a public IAM-authorized Terraform Authorization Gateway example.
- Adds `zt-audit verify audit.json` for local audit-shaped response verification.
- Adds CodeQL, dependency review, Dependabot configuration, homepage Code-to-Architecture flow, and Current vs Planned banner.
- Switches the public adapter license from MIT to Apache-2.0 for enterprise-friendly infrastructure adoption.
- Adds Docker Compose quickstart, 90-day roadmap status table, Nono status, and explicit coding standards.
- Adds launch checklist documentation and publishes it on the docs site.
- Adds Buttondown-powered "Join the Alpha" signup to the homepage.
- Adds a sharper homepage vulnerability hook that explains the broad API key failure mode and prompt-injection boundary.
- Adds `SOCIAL_KIT.md` with platform-specific launch copy, approved claims, and claims to avoid.
- Adds `SDK_API.md` with the public `ZeroTrustClient` contract, helper methods, and fail-closed guidance.
