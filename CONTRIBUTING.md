# Contributing

This repo is designed for junior developers and first-time adapter authors.

## Local workflow

1. Create a branch.
2. Run `npm test`.
3. Keep examples small and dependency-light.
4. Make sure the five-minute quickstart still works.
5. Open a pull request with a short description and test output.

## Rules

- Do not commit `.env` files or API keys.
- Keep examples readable before clever.
- Sensitive actions must call the Zero Trust Control Plane first.

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
