# Governance

This document defines operating rules for the public developer repository.

## Rules Of Engagement

- Issues and pull requests should stay focused on adapter behavior, policy examples, execution brokers, documentation, and tests.
- Security reports must follow [SECURITY.md](./SECURITY.md), not public issues.
- New execution brokers must follow the broker contract in [CONTRIBUTING.md](./CONTRIBUTING.md).
- New policy templates must include a deny path, an allow path, and a least-privilege explanation.
- Public examples must not require cloud credentials in CI.
- Public docs must clearly label mock behavior versus production MVP behavior.

## Current Public Adapter Scope

What the current public repo does well:

- demonstrates deny-before-execute and allow-before-execute in minutes;
- keeps the local control plane small and understandable;
- documents identity consumption, policy handoff, threat model, roadmap, and adapter contract;
- includes a Docker Local Execution Broker example;
- includes an IAM-authorized Terraform Authorization Gateway skeleton;
- includes a local audit verifier CLI;
- includes CI tests for adapter behavior;
- avoids committed secrets in the public seed.

Phase 1 readiness is defined in [PHASE1_READY.md](./PHASE1_READY.md). Any launch claim should use that document as the source of truth for production-ready, experimental, and planned capabilities.

Boundaries:

- this repository is the public adapter and quickstart surface;
- production control planes may be implemented in separate deployments as long as they honor the adapter contract;
- cloud execution brokers should be added only when they can run in CI without real cloud credentials;
- repository security settings are managed in GitHub and are not documented here as operational status.

## Core Maintenance Team

| Role | Current Owner |
| --- | --- |
| Project lead | Named project maintainer |
| Engineering review | Delegated maintainers |
| Security review | Security reporter plus invited reviewer when needed |
| Community triage | Maintainers during alpha |
| Release owner | Named release maintainer |

This is intentionally lightweight for alpha. Add named maintainers only after they accept responsibility for review, security triage, or release ownership.

## Stakeholder Communication Plan

Public communication should link to the quickstart, architecture, threat model, and Phase 1 ready criteria. Avoid publishing internal launch plans, unreleased timelines, private stakeholder lists, or unapproved commercial claims in this repository.

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
