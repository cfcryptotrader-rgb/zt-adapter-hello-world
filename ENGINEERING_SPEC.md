# Engineering Change Spec

This spec captures code and infrastructure changes requested by the launch review that should be implemented deliberately rather than rushed as copy edits.

## 1. One-Command Authorization Gateway And Broker IaC

Goal: give a developer a one-command path to deploy an Authorization Gateway and one sample Execution Broker.

Proposed shape:

```text
infra/
  terraform/
    modules/
      authorization-gateway/
      execution-broker-lambda/
      execution-broker-kubernetes/
    examples/
      aws-lambda/
      kubernetes/
```

Requirements:

- no public ingress by default;
- least-privilege IAM for the gateway and broker;
- secrets pulled from a managed secret store;
- logs and audit output enabled by default;
- outputs include gateway URL, broker identity, and validation commands;
- tests or policy checks prove no wildcard admin permissions are introduced.

Acceptance criteria:

- `make deploy-demo-gateway` or equivalent deploys a minimal gateway and broker;
- `make destroy-demo-gateway` cleans it up;
- CI validates Terraform formatting and static policy checks.

## 2. Automated Security Scans In CI

Goal: make the public repo demonstrate the security discipline it advocates.

Minimum implementation:

- `npm test`;
- `npm audit --omit=dev`;
- dependency review for pull requests;
- secret scanning through GitHub repository settings;
- CodeQL or equivalent static analysis where available.

Acceptance criteria:

- pull requests fail on test failures or high-severity dependency findings;
- documented exceptions require an issue link and expiry date;
- branch protection requires the CI status checks.

## 3. DAAL Contract-As-A-Service Integration

Goal: prove the "mathematically verifiable" claim with an optional decentralized audit anchor while keeping authorization latency low.

Requirements:

- authorization remains synchronous and fast;
- DAAL submission is asynchronous;
- audit records include local hash chain fields before ledger submission;
- ledger result is correlated later through a transaction hash;
- batch or Merkle-root logging is available for cost control;
- implementation supports Base Sepolia or Polygon Amoy first.

Acceptance criteria:

- local test proves tamper detection when an audit record changes;
- integration test can submit to a configured testnet when credentials are present;
- no private keys or provider secrets are committed;
- failed ledger submission does not block policy enforcement.

## 4. Code-To-Architecture Animation

Goal: make the homepage visually explain how code maps to the architecture.

Proposed behavior:

1. show adapter code calling `guardedCall(...)`;
2. animate request to `POST /actions`;
3. show policy returning `deny`;
4. show execution skipped;
5. show signed audit envelope written.

Implementation notes:

- use static HTML/CSS/JS in this repo;
- keep it accessible with text alternatives;
- do not depend on external animation services;
- keep the architecture SVG reusable as a standalone asset.

Acceptance criteria:

- homepage includes the animation above the documentation cards;
- reduced-motion users see a static sequence;
- tests assert the homepage contains the animation section and architecture link.

## 5. Repository Protection And Cleanup

Goal: make the public repository launch-safe.

Required operations:

- enable branch protection on `main`;
- require pull request review before merge;
- require CI checks;
- enable private vulnerability reporting;
- enable GitHub secret scanning and push protection where available;
- remove unused generated artifacts before public promotion.

Acceptance criteria:

- repository settings show protected `main`;
- private vulnerability reporting path works;
- secret scan returns no active findings;
- source tree contains no unused experimental scripts or notebooks.

