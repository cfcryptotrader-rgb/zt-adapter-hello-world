# Social Kit

Use this kit when announcing ZT-Infra publicly. Keep the claims narrow, accurate, and tied to the runnable quickstart.

## One-Sentence Pitch

An open adapter contract and audit envelope for agent action authorization.

## Short Pitch

ZT-Infra helps agent frameworks call a policy decision before sensitive actions run, fail closed on deny, hand approved work to an execution broker, and return a consistent audit envelope.

## Longer Pitch

Autonomous agents are moving from chat into action: discovering tools, calling APIs, opening pull requests, and touching cloud resources. ZT-Infra is an early open-source adapter-contract MVP for those actions. The public adapter demonstrates the smallest useful loop: an agent asks to act, policy decides before execution, the protected function is skipped on deny, and the response includes a consistent audit envelope.

ZT-Infra does not replace OPA, Cedar, SPIFFE/SPIRE, CSA ATF, nono, microVMs, or SIEM tooling. It is the integration layer that makes agent adapters use those controls consistently.

## Links

- Website: <https://www.zt-infra.org>
- Public repo: <https://github.com/oscarmackjr-twg/zt-adapter-hello-world>
- Quickstart: <https://www.zt-infra.org/quickstart>
- Architecture: <https://www.zt-infra.org/docs/architecture>
- Threat model: <https://www.zt-infra.org/docs/threat-model>
- Identity and policy: <https://www.zt-infra.org/docs/identity-policy>

## Show HN Draft

Title:

```text
Show HN: ZT-Infra, an adapter contract for agent action authorization
```

Post:

```text
I built a small public adapter that demonstrates one security loop for autonomous agents: an agent attempts a risky action, a policy decision denies it before execution, and the adapter returns audit-shaped evidence.

The repo includes a Docker Compose quickstart, local mock control plane, Docker and Nono broker examples, Terraform gateway skeleton, and audit verifier CLI. It is early, and I am looking for feedback from people building agent tools, MCP servers, execution brokers, and security controls.

The narrow claim: this is not an identity system, policy engine, sandbox, or prompt-injection detector. It is an adapter contract and audit envelope that can plug into those systems.
```

## LinkedIn Draft

```text
Autonomous agents are moving from chat into action: opening tickets, calling APIs, touching cloud infrastructure, and using tools across organizations.

ZT-Infra is an early open-source effort to define the adapter contract and audit envelope for those actions. The public quickstart shows the core control point in minutes: an agent asks to act, policy decides before execution, and the result leaves verifiable evidence.

It is designed to compose with SPIFFE/SPIRE for identity, OPA or Cedar for policy, and nono or other sandboxes for execution containment. We are looking for contributors interested in LangGraph/MCP/A2A integration, broker handoff, policy templates, and adapter conformance tests.
```

## X Draft

```text
Agents need more than broad API keys.

ZT-Infra is building an open adapter contract and audit envelope for autonomous agent actions.

Quickstart: agent asks to act -> policy denies before execution -> audit-shaped evidence returned.

https://www.zt-infra.org
```

## Approved Claims

- ZT-Infra is an early open-source adapter-contract MVP.
- The public repo demonstrates policy-before-execution.
- The quickstart can show deny-before-execute and allow-before-execute.
- The full MVP is building toward signed, hash-chained audit evidence with optional DAAL hash anchoring.
- The roadmap includes SPIFFE/SPIRE consumption, OPA/Cedar policy templates, broker integrations, and conformance tests.
- The public adapter is Apache-2.0 licensed.

## Claims To Avoid

- Do not claim production certification.
- Do not claim SOC 2 readiness.
- Do not claim prompt-injection prevention.
- Do not claim every adapter framework version is certified.
- Do not claim every production audit log is ledger verified until reconciliation, alerting, and delivery-rate evidence exist.
- Use "mathematical attestation" or "non-repudiation layer" before naming any ledger or provider in enterprise messaging.
- Do not claim smart contracts are verified on an explorer until `EXPLORER_VERIFICATION.md` includes a real contract address and verified source link.
- Do not imply the local mock signatures are production cryptographic proof.
- Do not claim zt-infra replaces OPA, Cedar, SPIFFE/SPIRE, CSA ATF, nono, microVMs, or SIEM tooling.

## Audience-Specific Angles

Developers:

- "Show me the quickstart."
- "Where do I put the policy check?"
- "How do I wrap my tool call?"

Security teams:

- "What action was attempted?"
- "Who was the actor?"
- "Was execution skipped?"
- "Where is the audit evidence?"

Platform teams:

- "Can this work across LangGraph, OpenAI, MCP, A2A, and custom tools?"
- "Can brokers enforce the same decision contract?"
- "Can identity move toward SPIFFE/SPIRE?"
