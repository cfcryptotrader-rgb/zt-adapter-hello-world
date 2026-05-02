# Why Traditional IAM Is Not Enough For Autonomous Agents

Traditional IAM is necessary, but it was designed around relatively stable human users, service accounts, and application workloads. Autonomous agents create a different control problem: they are transient, tool-discovering, context-dependent actors that can take many actions on behalf of a human or workflow.

ZT-Infra does not replace IAM. It adds a policy and evidence layer at the moment an agent attempts to act.

ZT-Infra uses Zero Trust architecture as an influence: authorize each resource access explicitly, avoid implicit trust from network location, and keep policy close to the resource or action being protected. NIST SP 800-207 is the reference point for this architectural framing; ZT-Infra is not claiming NIST certification.

## The Gap

Human-centric OAuth and role-based access control usually answer:

- who authenticated;
- which application received a token;
- which broad scopes or roles were granted.

Agent authorization also needs to answer:

- which transient agent session is acting right now;
- which workflow, model, tool manifest, sandbox, or broker launched it;
- which exact action is being attempted;
- which resource is being touched;
- whether a human approval, ticket, or trust-domain context is required;
- whether the action was denied before execution;
- whether the decision can be audited later without trusting mutable application logs.

## Why Broad Tokens Are Risky

An OAuth token with a broad scope can outlive the context that made it safe. An agent may receive a token for a legitimate task, then be prompted or instructed to use available tools in a way the original workflow owner did not intend.

ZT-Infra narrows that gap by requiring a decision request before sensitive execution:

```json
{
  "actor": "demo-agent",
  "action": "aws.ec2.terminate_instances",
  "resource": "i-demo"
}
```

The control plane can deny that action even if the surrounding application has credentials that could technically perform it.

## What ZT-Infra Adds

- Deny-by-default policy for agent actions.
- A common decision contract across LangGraph, OpenAI, MCP, A2A, and custom adapters.
- Signed, hash-chained audit evidence for each decision in the full MVP.
- A path toward workload-bound identity using mTLS, SPIFFE/SPIRE, and short-lived agent credentials.

## What It Does Not Claim

ZT-Infra does not prevent prompt injection by itself. It does not make unsafe application logic safe. It does not remove the need for IAM, sandboxing, secrets management, endpoint security, or human approval workflows.

The point is narrower and more testable: when an agent attempts a protected action, policy should decide before execution, and the decision should leave verifiable evidence.
