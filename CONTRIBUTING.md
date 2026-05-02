# Contributing

This repo is designed for junior developers and first-time adapter authors.

The broader mission is to help define the next decade of autonomous system security. If you care about portable agent identity, policy-before-execution, signed audit evidence, secure tool use, or federated trust between agent runtimes, this project is the place to turn those ideas into runnable examples and tests.

## Local workflow

1. Create a branch.
2. Install dependencies with `npm ci`.
3. Run `npm test`.
4. Run `npm audit --omit=dev`.
5. Keep examples small and dependency-light.
6. Make sure the five-minute quickstart still works.
7. Open a pull request with a short description and test output.

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
