# Day 1 Use Cases

These examples show where the Hello World adapter pattern becomes useful on the first day of a pilot. They are intentionally concrete: each one starts with an agent that wants to call a tool, then shows where ZT-Infra enforces policy before execution.

## 1. Finance Agent In A Docker Sandbox

Scenario: a finance operations agent drafts month-end variance notes and can call internal reporting tools.

Protected action:

```json
{
  "actor": "finance-agent-demo",
  "action": "finance.report.export",
  "resource": "monthly-close-demo"
}
```

Policy:

- allow read-only report export in the `dev` environment;
- deny wire transfer, vendor update, payroll, and production ledger actions;
- require human approval before any action that changes financial state.

Why this matters:

The sandbox limits runtime blast radius, but it does not decide whether a tool call is allowed. ZT-Infra sits before the tool call and produces evidence that the finance agent was constrained to read-only work.

## 2. Cloud Operations Agent With Dangerous AWS Tools

Scenario: an operations agent investigates an incident and has access to AWS helper tools.

Protected action:

```json
{
  "actor": "ops-agent-demo",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo"
}
```

Policy:

- deny destructive infrastructure actions by default;
- allow read-only diagnostics such as instance status, CloudWatch log lookup, and alarm listing;
- require an approval ID and production broker for restart, scale, or terminate actions.

Why this matters:

The demo action is intentionally scary. The proof point is that the adapter calls policy first, receives `deny`, skips execution, and returns an audit envelope with a reason.

## 3. Developer Agent Creating Pull Requests Through MCP

Scenario: a coding agent uses an MCP GitHub server to inspect repositories and propose changes.

Protected action:

```json
{
  "actor": "dev-agent-demo",
  "action": "mcp.github.create_pull_request",
  "resource": "repo/name"
}
```

Policy:

- allow repository reads and local diff generation;
- deny pull request creation unless an approval context is present;
- deny write operations to protected branches.

Why this matters:

MCP makes tool discovery and tool invocation easy. ZT-Infra provides the policy gate between discovery and execution so tool use can remain least privilege.

## 4. External A2A Agent Delegating Work

Scenario: an external agent sends a task to a local agent through an A2A-compatible interface.

Protected action:

```json
{
  "actor": "external-agent-demo",
  "action": "a2a.partner.create_task",
  "resource": "customer-support-demo"
}
```

Policy:

- deny untrusted external agents by default;
- allow only narrow task types from trusted issuers;
- record the external trust domain in the audit envelope.

Why this matters:

Autonomous systems will cross organizational boundaries. The default posture should be reject until identity, trust domain, resource, and action policy all match.

