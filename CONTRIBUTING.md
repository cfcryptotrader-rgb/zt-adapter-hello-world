# Contributing

This repo is designed for junior developers and first-time adapter authors.

The project mission is to define the integration contract for agent action authorization. If you care about policy-before-execution, fail-closed adapter behavior, broker handoff, signed audit evidence, or framework interoperability, this repo is the place to turn those ideas into runnable examples and tests.

ZT-Infra is not trying to replace SPIFFE/SPIRE, OPA, Cedar, CSA ATF, nono, microVMs, or SIEM tooling. Contributions should make those primitives easier for agent frameworks to use consistently.

## Local workflow

1. Create a branch.
2. Install dependencies with `npm ci`.
3. Run `npm test`.
4. Run `npm audit --omit=dev`.
5. Run `npm run security:secrets`.
6. Generate an SBOM with `npm run sbom` for release-sensitive changes.
7. Keep examples small and dependency-light.
8. Make sure the five-minute quickstart still works.
9. Open a pull request with a short description and test output.

## Development Environment

Required:

- Node.js 20 or newer.
- npm.

Optional:

- Docker Compose v2 for the containerized quickstart.
- `jq` for formatted JSON in terminal examples.

Fast local check:

```bash
npm ci
npm test
npm audit --omit=dev
npm run security:secrets
```

Containerized quickstart:

```bash
docker compose up
```

## Rules

- Do not commit `.env` files or API keys.
- Keep examples readable before clever.
- Sensitive actions must call the Zero Trust Control Plane first.
- New adapter surfaces must document how they set `actor`, what resource string they protect, and the least-privilege policy needed for the safe path.

## Coding Standards

- Use modern Node.js ESM syntax.
- Keep source files dependency-light; prefer built-in Node.js APIs unless a dependency removes meaningful complexity.
- Keep protected actions behind `ZeroTrustClient.guardedCall(...)` or an equivalent policy-before-execution check.
- Fail closed when the control plane is unavailable or returns `deny`.
- Do not log secrets, bearer tokens, private keys, or raw environment dumps.
- Preserve the current response shape: `decision`, `reason`, `audit`, and `executionSkipped` where execution is involved.
- Add tests for both deny and allow behavior when adding adapters, brokers, or policy examples.
- Keep examples runnable without cloud credentials in CI.
- Use clear names over abstraction; this repo is a teaching surface for new adapter authors.

## Pull Request Standards

Every PR should include:

- what changed;
- why it matters;
- commands run and pass/fail results;
- screenshots or terminal output for website or CLI changes when useful;
- any remaining risk or follow-up issue.

## Review Structure

PR review order:

1. correctness and tests;
2. fail-closed security behavior;
3. documentation and quickstart impact;
4. dependency, secret-scan, and SBOM impact;
5. maintainer approval and squash merge.

Security-sensitive PRs should reference [RISK_REGISTER.md](./RISK_REGISTER.md) or [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) when they change broker execution, policy semantics, audit verification, or secret handling.

## Adding Execution Brokers

Execution Brokers are adapters that run approved work after the Zero Trust Control Plane returns `allow`.

Examples:

- AWS Lambda broker
- Kubernetes Job broker
- local container broker
- queue worker broker

### Broker contract

Every broker contribution must:

1. call `ZeroTrustClient.guardedCall(...)` before execution;
2. skip execution on `deny`;
3. return `decision`, `reason`, `audit`, and `executionSkipped`;
4. include a safe Hello World-style example;
5. include tests for both deny and allow paths;
6. avoid requiring cloud credentials in CI;
7. document any required runtime permissions.
8. include a least-privilege policy example that maps actor, action, and resource.

## Adding Policy Templates

Policy template contributions should be small, explicit, and deny-by-default.

Each template must include:

1. a realistic protected action, such as `mcp.github.create_pull_request`;
2. a deny example;
3. an allow example with the narrowest practical actor, action, resource, and context;
4. a short explanation of what human approval or workload identity is required;
5. tests or fixtures that prove the deny and allow behavior.

### Suggested structure

```text
brokers/
  aws-lambda/
    README.md
    index.js
    test/
  kubernetes-job/
    README.md
    index.js
    test/
```

### Broker review checklist

- Does it fail closed if the control plane is unavailable?
- Does it avoid logging secrets?
- Does it clearly separate policy decision from execution?
- Does it keep dangerous examples mocked by default?
- Can a junior developer run the example locally?
- Does it document identity mapping and deny-by-default policy behavior?
