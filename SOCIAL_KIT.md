# Social Kit

Use this kit when announcing ZT-Infra publicly. Keep the claims narrow, accurate, and tied to the runnable quickstart.

## One-Sentence Pitch

Open-source identity, policy, and audit evidence for autonomous AI agents.

## Short Pitch

ZT-Infra helps developers put a policy decision in front of sensitive agent actions, then return audit-shaped evidence for what was allowed or denied.

## Longer Pitch

Autonomous agents are moving from chat into action: discovering tools, calling APIs, opening pull requests, and touching cloud resources. ZT-Infra is an early open-source control-plane MVP for those actions. The public adapter demonstrates the smallest useful loop: an agent asks to act, policy decides before execution, the protected function is skipped on deny, and the response includes a consistent audit envelope.

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
Show HN: ZT-Infra, policy-before-execution for AI agents
```

Post:

```text
I built a small public adapter that demonstrates one security loop for autonomous agents: an agent attempts a risky action, a control plane denies it before execution, and the adapter returns audit-shaped evidence.

The repo includes a Docker Compose quickstart, local mock control plane, Docker broker example, Terraform gateway skeleton, and audit verifier CLI. It is early, and I am looking for feedback from people building agent tools, MCP servers, execution brokers, and security controls.

The narrow claim: this does not prevent prompt injection. It blocks unauthorized tool calls that an agent may attempt after prompt injection, bad planning, or overbroad credentials.
```

## LinkedIn Draft

```text
Autonomous agents are moving from chat into action: opening tickets, calling APIs, touching cloud infrastructure, and using tools across organizations.

ZT-Infra is an early open-source effort to define an identity, policy, and audit evidence layer for those actions. The public quickstart shows the core control point in minutes: an agent asks to act, policy decides before execution, and the result leaves verifiable evidence.

We are building toward a SPIFFE-like trust layer for AI agents and looking for contributors interested in policy enforcement, execution brokers, MCP/A2A integration, and audit verification.
```

## X Draft

```text
Agents need more than broad API keys.

ZT-Infra is building open-source identity, policy, and audit evidence for autonomous AI agents.

Quickstart: agent asks to act -> policy denies before execution -> audit-shaped evidence returned.

https://www.zt-infra.org
```

## Approved Claims

- ZT-Infra is an early open-source control-plane MVP.
- The public repo demonstrates policy-before-execution.
- The quickstart can show deny-before-execute and allow-before-execute.
- The full MVP is building toward signed, hash-chained audit evidence.
- The roadmap includes mTLS, SPIFFE/SPIRE, attestation, brokers, and conformance tests.

## Claims To Avoid

- Do not claim production certification.
- Do not claim SOC 2 readiness.
- Do not claim prompt-injection prevention.
- Do not claim every adapter framework version is certified.
- Do not claim DAAL/blockchain audit proof is complete until the public testnet verifier exists.
- Do not imply the local mock signatures are production cryptographic proof.

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

