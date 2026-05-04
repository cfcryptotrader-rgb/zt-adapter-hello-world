# Governance And Launch Readiness

This document turns the launch review comments into operating rules for the public repository.

## Rules Of Engagement

- Issues and pull requests should stay focused on adapter behavior, policy examples, execution brokers, documentation, and tests.
- Security reports must follow [SECURITY.md](./SECURITY.md), not public issues.
- New execution brokers must follow the broker contract in [CONTRIBUTING.md](./CONTRIBUTING.md).
- New policy templates must include a deny path, an allow path, and a least-privilege explanation.
- Public examples must not require cloud credentials in CI.
- Public docs must clearly label mock behavior versus production MVP behavior.

## Current MVP Retrospective

What the current public repo does well:

- demonstrates deny-before-execute and allow-before-execute in minutes;
- keeps the local control plane small and understandable;
- documents identity consumption, policy handoff, threat model, roadmap, and adapter contract;
- includes a Docker Local Execution Broker example;
- includes an IAM-authorized Terraform Authorization Gateway example;
- includes a local audit verifier CLI;
- includes CI tests for adapter behavior;
- avoids committed secrets in the public seed.

Phase 1 readiness is defined in [PHASE1_READY.md](./PHASE1_READY.md). Any launch claim should use that document as the source of truth for production-ready, experimental, and planned capabilities.

Known gaps:

- production-grade Authorization Gateway IaC remains in the private infrastructure repo; the public Terraform example is a skeleton;
- cloud execution brokers are documented but not implemented as public examples yet;
- GitHub branch protection and private vulnerability reporting must be enabled in repository settings;
- GitHub Advanced Security features must be verified in repository settings;
- social proof must wait for approved quotes or named references.

## Core Maintenance Team

| Role | Current Owner |
| --- | --- |
| Project lead | Oscar Mack |
| Engineering review | TWG Global partners / delegated maintainers |
| Security review | Security reporter, TWG Global partner, or invited reviewer depending on issue |
| Community triage | Project lead during alpha |
| Release owner | Project lead until additional maintainers are named |

This is intentionally lightweight for alpha. Add named maintainers only after they accept responsibility for review, security triage, or release ownership.

## Stakeholder Communication Plan

Notify in this order before broader public promotion:

1. internal project owner and engineering reviewer;
2. TWG Global partners or advisors who need private context;
3. early beta testers and design partners;
4. security reviewers who may validate the threat model;
5. public developer audience.

Each communication should include:

- the five-minute quickstart link;
- the architecture link;
- the threat model link;
- the clear statement that this is an early public adapter MVP, not a production certification.

## Release Checklist

- `npm test` passes.
- `npm audit --omit=dev` passes or documented exceptions exist.
- No `.env`, private keys, cloud tokens, or generated secrets are committed.
- `SECURITY.md` has a real reporting path.
- `CONTRIBUTING.md` explains brokers and policy templates.
- `ROADMAP.md` clearly names Phase 2 identity goals.
- Website links expose use cases, IAM whitepaper, roadmap, and threat model.
- Website includes a Current vs Planned banner.
- Public broker and public IaC examples are documented.
- Branch protection is enabled for `main`.

## Nono Status

Nono is included as an optional public Execution Broker integration.

The Nono integration is not the identity system or policy model. It is a sandbox execution target that runs only after the Zero Trust Control Plane returns `allow`. New contributors should keep Nono work scoped to broker behavior, capability mapping, demo evidence, and tests unless an issue explicitly expands that scope.
