# Use Cases

These are hypothetical developer examples for understanding the adapter contract. They are not customer case studies, endorsements, or claims of production deployment.

Each example follows the same pattern:

1. an agent wants to call a tool;
2. the adapter sends an action request to the control plane;
3. policy returns `allow` or `deny`;
4. denied actions skip execution;
5. allowed actions can be handed to a broker with constrained permissions;
6. the response preserves the same audit envelope.

## Finance Reporting Agent

Protected action:

```json
{
  "actor": "finance-agent-demo",
  "action": "finance.report.export",
  "resource": "monthly-close-demo"
}
```

Example policy shape:

- allow read-only report export in a demo or development environment;
- deny transfer, payroll, vendor update, and production-ledger actions by default;
- require an approval context before any state-changing financial action.

## Cloud Operations Agent

Protected action:

```json
{
  "actor": "ops-agent-demo",
  "action": "aws.ec2.terminate_instances",
  "resource": "demo-instance"
}
```

Example policy shape:

- deny destructive infrastructure actions by default;
- allow read-only diagnostics such as status lookup, log lookup, and alarm listing;
- require approval and a hardened broker for restart, scale, or terminate actions.

## MCP Developer Tool Agent

Protected action:

```json
{
  "actor": "dev-agent-demo",
  "action": "mcp.github.create_pull_request",
  "resource": "example/repo"
}
```

Example policy shape:

- allow repository reads and local diff generation;
- deny pull request creation unless an approval context is present;
- deny writes to protected branches by default.

## A2A External Agent Task

Protected action:

```json
{
  "actor": "external-agent-demo",
  "action": "a2a.partner.create_task",
  "resource": "support-demo"
}
```

Example policy shape:

- deny untrusted external agents by default;
- allow only narrow task types from trusted issuers;
- record the external trust domain in the audit envelope.

## Healthcare Operations Agent

Protected action:

```json
{
  "actor": "healthcare-agent-demo",
  "action": "healthcare.patient.export_phi",
  "resource": "clinic-demo"
}
```

Example policy shape:

- deny protected health information export in public demos;
- allow only de-identified aggregate counts for onboarding examples;
- require trusted workload identity, approved purpose, and auditable ticket context before any PHI-related production action.

## SaaS Support Agent

Protected action:

```json
{
  "actor": "support-agent-demo",
  "action": "saas.user.disable_account",
  "resource": "customer-demo"
}
```

Example policy shape:

- allow read-only account lookup;
- deny account disable, role escalation, billing changes, and data export by default;
- require approval context and a scoped broker for state-changing support actions.
