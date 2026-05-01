# Identity & Policy Spec

This document defines the security logic behind the Hello World adapter. It is written for adapter authors who need to understand how a transient agent gets an identity and how least-privilege policy decisions are represented.

## Identity Provisioning

Every protected action is evaluated against an `actor`. In the MVP request shape, `actor` is the agent identity:

```json
{
  "actor": "hello-world-agent",
  "action": "hello-world.say_hello",
  "resource": "local-demo"
}
```

For the five-minute quickstart, identity provisioning is intentionally simple:

1. The local mock control plane starts with `hello-world-agent` registered.
2. A transient demo agent can also register by calling `POST /agents`.
3. The adapter sends that `actor` value with each `POST /actions` decision request.
4. The control plane denies requests from unknown actors.

Example:

```bash
curl -sS -X POST http://127.0.0.1:3000/agents \
  -H 'content-type: application/json' \
  -d '{"actor":"hello-world-agent"}'
```

Production identity should be stronger than the local mock. Recommended patterns:

```text
agt_<workspace>_<runtime>_<uuid>
spiffe://example.com/workload/agent/<uuid>
aws:sts::<account-id>:assumed-role/<role>/<session-name>
```

The identity should be:

- unique per agent runtime or task;
- stable for the lifetime of the task;
- bound to the workload where possible, such as mTLS, SPIFFE/SPIRE, SSM session context, or a cloud workload identity;
- immutable inside the action request path;
- included in every audit record.

Phase 2 will map authenticated workload identity to `actor` automatically. Until then, adapters must treat `actor` as security-sensitive input and must not let an untrusted end user choose it.

## Decision Request

Current MVP endpoint:

```text
POST /actions
```

Current MVP body:

```json
{
  "actor": "hello-world-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo"
}
```

Recommended richer request shape for production ABAC:

```json
{
  "subject": {
    "actor": "agt-demo-runtime-01",
    "type": "agent",
    "workspace": "demo",
    "trust_level": "sandboxed"
  },
  "action": "hello-world.say_hello",
  "resource": {
    "id": "local-demo",
    "type": "adapter.endpoint",
    "environment": "dev"
  },
  "context": {
    "request_id": "req_01J...",
    "approval_id": null,
    "source": "quickstart"
  }
}
```

## Policy Model

Policy is deny by default. A request is allowed only when a policy explicitly matches:

- subject attributes, such as actor, group, workspace, or trust level;
- action name;
- resource attributes, such as resource ID, type, owner, repository, or environment;
- context attributes, such as approval status, ticket ID, session, or time window.

The quickstart mock uses a simplified action allow list so junior developers can learn the flow quickly. Real deployments should evaluate ABAC policy before any action execution.

## ABAC JSON Examples

Allow only the Hello World action for the demo agent:

```json
{
  "id": "allow-demo-hello-world",
  "effect": "allow",
  "description": "Allow the demo agent to run only the safe Hello World action.",
  "subjects": {
    "actors": ["hello-world-agent"],
    "workspaces": ["demo"]
  },
  "actions": ["hello-world.say_hello"],
  "resources": {
    "types": ["adapter.endpoint"],
    "ids": ["local-demo"],
    "environments": ["dev"]
  },
  "conditions": {
    "requires_approval": false
  }
}
```

Deny dangerous AWS infrastructure actions:

```json
{
  "id": "deny-ec2-termination",
  "effect": "deny",
  "description": "Agents may not terminate EC2 instances through adapter demos.",
  "subjects": {
    "types": ["agent"]
  },
  "actions": ["aws.ec2.terminate_instances"],
  "resources": {
    "types": ["aws.ec2.instance"],
    "ids": ["*"]
  },
  "reason": "Infrastructure termination requires a human-approved production broker."
}
```

Require approval before creating a GitHub pull request through MCP:

```json
{
  "id": "mcp-github-pr-requires-approval",
  "effect": "deny",
  "description": "MCP GitHub PR creation is blocked unless an approval context is present.",
  "subjects": {
    "trust_levels": ["sandboxed", "untrusted"]
  },
  "actions": ["mcp.github.create_pull_request"],
  "resources": {
    "repositories": ["repo/name"]
  },
  "conditions": {
    "approval_id": null
  },
  "reason": "Agent may not create pull requests without approval."
}
```

Reject an external A2A task from an untrusted agent:

```json
{
  "id": "reject-untrusted-a2a-task",
  "effect": "deny",
  "description": "External A2A agents must be trusted before they can delegate tasks.",
  "subjects": {
    "external_agents": ["*"]
  },
  "actions": ["a2a.*.send_message", "a2a.*.create_task"],
  "conditions": {
    "external_agent_trust": "untrusted"
  },
  "reason": "External agent task rejected because the sending agent is not trusted."
}
```

## YAML Equivalent

```yaml
policies:
  - id: allow-demo-hello-world
    effect: allow
    description: Allow the demo agent to run only the safe Hello World action.
    subjects:
      actors:
        - hello-world-agent
      workspaces:
        - demo
    actions:
      - hello-world.say_hello
    resources:
      types:
        - adapter.endpoint
      ids:
        - local-demo
      environments:
        - dev
    conditions:
      requires_approval: false

  - id: deny-ec2-termination
    effect: deny
    description: Agents may not terminate EC2 instances through adapter demos.
    subjects:
      types:
        - agent
    actions:
      - aws.ec2.terminate_instances
    resources:
      types:
        - aws.ec2.instance
      ids:
        - "*"
    reason: Infrastructure termination requires a human-approved production broker.
```

## Audit Record Contract

Every decision should produce the same audit envelope:

```json
{
  "actor": "hello-world-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo",
  "decision": "deny",
  "reason": "Mock policy blocks infrastructure termination.",
  "audit": {
    "timestamp": "2026-05-01T00:00:00.000Z",
    "previous_hash": "...",
    "current_hash": "...",
    "kms_signature": {
      "algorithm": "ECDSA_SHA_256",
      "key_id": "...",
      "signature": "..."
    }
  }
}
```

The local mock uses `MOCK_ECDSA_SHA_256` so developers can run the quickstart without cloud credentials. Production ZT-Infra uses AWS KMS-backed signatures and configured audit sinks.

