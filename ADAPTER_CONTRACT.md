# Adapter Contract

This repository demonstrates the minimum contract expected from public Zero Trust adapter examples.

## Required behavior

An adapter should:

- expose a simple `GET /health` endpoint;
- call the Zero Trust Control Plane before a sensitive action;
- fail closed if the control plane is unreachable;
- surface `decision`, `reason`, and `audit` fields in demo output;
- demonstrate both deny-before-execute and allow-before-execute paths;
- avoid committing secrets.

## Identity

Every request must include an `actor`. The `actor` is the unique identity of the agent or workload requesting the action.

For the local quickstart, `actor` is registered through `POST /agents`. In production, `actor` should be bound to workload identity, such as mTLS, SPIFFE/SPIRE, SSM session context, or cloud workload identity. Adapters must not allow untrusted end users to choose the `actor`.

See [IDENTITY_AND_POLICY.md](./IDENTITY_AND_POLICY.md) for the full identity provisioning and ABAC policy model.

## Control Plane request

Current MVP endpoint:

```text
POST /actions
```

```json
{
  "actor": "hello-world-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo"
}
```

Policy is deny by default. The control plane should allow execution only when the actor, action, resource, and context match an explicit least-privilege policy.

## Control Plane response

```json
{
  "ok": false,
  "decision": "deny",
  "reason": "demo action blocked",
  "audit": {
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

Adapters must execute the protected function only when `decision` is exactly `allow`.
