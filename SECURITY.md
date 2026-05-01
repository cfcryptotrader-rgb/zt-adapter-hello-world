# Security Policy

## Supported Versions

Security fixes are prioritized for the latest tagged release.

| Version | Supported |
| --- | --- |
| `v0.1.x` | Yes |

## Reporting a Vulnerability

Please do not open a public GitHub issue for suspected vulnerabilities.

Report privately by emailing:

```text
security@zerotrustv2.example
```

Include:

- affected version or commit;
- summary of the issue;
- reproduction steps;
- expected impact;
- any logs or proof-of-concept code that help us validate safely.

We aim to acknowledge reports within 2 business days and provide a remediation plan or status update within 7 business days.

## Scope

Primary scope:

- ZT-Infra protects against unauthorized tool calls.

In scope:

- bypasses of policy enforcement before execution;
- leakage of tokens, audit signatures, or agent identity;
- unsafe defaults in adapter examples;
- dependency vulnerabilities that affect runtime behavior;
- issues in future Execution Broker examples.

Out of scope:

- ZT-Infra does not prevent LLM prompt injection. Prompt injection prevention is the application's responsibility.
- vulnerabilities in local developer machines;
- attacks requiring committed secrets that are not part of this repository;
- denial-of-service against the mock control plane used only for onboarding.

For the full design-level threat model, see [THREAT_MODEL.md](./THREAT_MODEL.md).

## Safe Harbor

Good-faith security research that avoids privacy violations, data destruction, and service disruption is welcome.
