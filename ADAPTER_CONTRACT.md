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
