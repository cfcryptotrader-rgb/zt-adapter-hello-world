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
- documents identity, policy, threat model, roadmap, and adapter contract;
- includes a Docker Local Execution Broker example;
- includes an IAM-authorized Terraform Authorization Gateway example;
- includes a local audit verifier CLI;
- includes CI tests for adapter behavior;
- avoids committed secrets in the public seed.

Known gaps:

- production-grade Authorization Gateway IaC remains in the private infrastructure repo; the public Terraform example is a skeleton;
- cloud execution brokers are documented but not implemented as public examples yet;
- GitHub branch protection and private vulnerability reporting must be enabled in repository settings;
- GitHub Advanced Security features must be verified in repository settings;
- social proof must wait for approved quotes or named references.

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

Nono is excluded from the public adapter MVP.

The name may return later as a demo persona, support agent, or narrative layer, but it is not a current subsystem, API, broker, policy model, or contributor workstream. New contributors should not create Nono-specific code or documentation unless an issue explicitly adds that scope.
