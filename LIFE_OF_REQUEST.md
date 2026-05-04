# Life Of A Request

This page shows where data moves during a protected agent action.

## Sequence

```text
1. User or operator reaches the private control plane through Tailscale.
2. Agent adapter prepares an action request.
3. Adapter calls ZT-Infra POST /actions before tool execution.
4. Policy returns allow or deny.
5. Deny stops execution immediately.
6. Allow enters an execution broker such as Docker Local or Nono.
7. Broker runs the approved command with constrained permissions.
8. Local audit record is hash-chained and signed.
9. Optional DAAL asynchronously anchors only the action hash or batch root.
10. Alchemy receipt verification confirms the transaction targets the DAAL contract.
```

## Data Flow

| Step | Component | Data In | Data Out |
| --- | --- | --- | --- |
| Identity and access | Tailscale / SSM | Operator or service access path. | Private network or fallback session. |
| Policy check | ZT-Infra control plane | `actor`, `action`, `resource`, optional context. | `allow` or `deny`, reason, audit envelope. |
| Execution broker | Docker Local / Nono | Allowed action plus constrained command spec. | Execution result or skipped execution. |
| Local audit | Provisioner audit module | Decision envelope. | Hash-chained signed audit record. |
| DAAL sidecar | CDP / Base transaction path | `agentId`, `actionHash`, optional metadata URI. | Transaction hash or pending queue status. |
| Verification | Alchemy RPC | Transaction hash. | Receipt status and contract-address match. |

## What Does Not Leave The Control Plane

The DAAL path should not receive:

- raw agent chat;
- prompts;
- private tool arguments;
- API keys;
- customer records;
- full policy files;
- local execution output.

Only the derived hash is anchored. If metadata URIs are used later, they must point to access-controlled evidence objects or redacted summaries.

## Failure Behavior

| Failure | Expected Behavior |
| --- | --- |
| Policy engine unavailable | Fail closed; protected action does not run. |
| Broker unavailable | Policy may allow, but execution fails with an operational error. |
| CDP unavailable | Local audit remains durable; DAAL status remains `pending` or `failed`; execution path is not blocked by ledger confirmation. |
| Alchemy unavailable | Receipt verification is delayed; transaction hash can be reconciled later with another RPC provider. |
| thirdweb unavailable | Contract deployment or optional Engine write path is delayed; CDP direct mode can continue if configured. |
| Base congestion | DAAL submission is delayed; local audit and retry queue remain the immediate evidence. |

## Security ROI

This architecture gives a CTO three reviewable properties:

1. **Pre-execution control:** sensitive agent actions are checked before they run.
2. **Constrained execution:** allowed actions pass through a broker with explicit permissions.
3. **Independent evidence:** local audit records can be checked against an external hash anchor.

The ledger attestation path is therefore a non-repudiation control, not an execution dependency.
