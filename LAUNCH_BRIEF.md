# Launch Brief

Use this brief for public website copy, social posts, partner notes, and early adopter outreach.

## Why It Matters

Agents are moving from chat into action. They discover tools, call APIs, write code, open tickets, and operate across cloud and SaaS boundaries. Existing IAM can authenticate applications and humans, but it does not give teams a portable way to identify a transient agent, check exact action policy, and preserve signed evidence for each attempted action.

ZT-Infra is building an open adapter contract and audit envelope for autonomous agent actions. It is designed to plug into existing identity providers, policy engines, containment layers, and observability systems instead of replacing them.

One-sentence pitch:

An open adapter contract and audit envelope for agent action authorization.

## Who It Is For

- Developers building adapters for agent frameworks and tool protocols.
- Security engineers who need a clear control point before agent tool execution.
- Platform teams that want agent actions to follow the same rigor as production workload actions.
- Early contributors interested in adapter contracts, policy handoff, attestation evidence, MCP, A2A, and execution brokers.

## Current Public Proof

The public Hello World repository demonstrates the smallest useful loop:

1. start a local mock control plane;
2. register a mock agent;
3. attempt an unauthorized action;
4. receive `deny`;
5. skip execution;
6. apply narrow policy;
7. execute the safe action.

## Suggested Launch Message

ZT-Infra is an early open-source adapter-contract MVP for autonomous agent actions. The first public adapter shows a five-minute proof: an agent attempts a dangerous action, policy blocks it before execution, and the decision returns a consistent audit envelope. We are looking for contributors who want to define the portable authorization contract that LangGraph, MCP, A2A, OpenAI wrappers, and custom agents can share.

## Social Proof Policy

Do not fabricate quotes, logos, or customer claims. Until named references are approved, use one of these accurate phrases:

- "Alpha feedback is being collected from early reviewers."
- "Design-partner conversations are in progress."
- "Public examples are intentionally small so contributors can validate the security loop themselves."

## Visual Assets

Current reusable assets:

- architecture page: `/docs/architecture`;
- architecture SVG: `/architecture.svg`;
- asciinema terminal recording: `recordings/agent-blocked-then-authorized.cast`.
- alpha signup: homepage "Join the Alpha" form powered by Buttondown.

Planned asset:

- Code-to-Architecture animation showing a request moving from adapter code to policy decision to signed audit evidence. See [ENGINEERING_SPEC.md](./ENGINEERING_SPEC.md).

## Social Kit

### Hacker News

Show HN: ZT-Infra, an adapter contract for agent action authorization

I built a small public adapter that demonstrates one security loop: an agent attempts a risky action, policy denies it before execution, and the adapter returns an audit-shaped response. The repo includes a Docker Compose quickstart, local mock control plane, Docker and Nono broker examples, Terraform gateway skeleton, and audit verifier CLI. It is early, and I am looking for feedback from people building agent tools, MCP servers, execution brokers, and security controls.

### LinkedIn

Autonomous agents are moving from chat into action: opening tickets, calling APIs, touching cloud infrastructure, and using tools across organizations. ZT-Infra is an early open-source effort to define the adapter contract and audit envelope for those actions. The public quickstart shows the core control point in five minutes: an agent asks to act, policy decides before execution, and the result leaves verifiable evidence.

### X

Agents need more than broad API keys.

ZT-Infra is building an open adapter contract and audit envelope for autonomous agent actions.

Quickstart: agent asks to act -> policy denies before execution -> audit-shaped evidence returned.
