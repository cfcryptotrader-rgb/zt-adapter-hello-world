# Enterprise Readiness

ZT-Infra uses decentralized attestation for one business reason: non-repudiation.

The product goal is not to add crypto complexity to agent infrastructure. The goal is to make sensitive agent decisions tamper-evident after the fact, even if a privileged system operator later has access to local logs.

## Why Mathematical Attestation

Traditional audit logs are useful, but they usually trust the same administrative boundary as the system being audited. If that boundary is compromised, an attacker or insider can try to edit, delete, or rewrite the record.

ZT-Infra keeps the local signed audit chain as the immediate system of record, then asynchronously anchors an action hash or batch Merkle root to an EVM ledger.

That gives reviewers a simple question to answer:

```text
Does the local audit record still hash to the evidence anchored on-chain?
```

If the local record changes later, the recomputed hash no longer matches the anchored value.

## What Goes On-Chain

The ledger receives a hash, not the agent's prompt, chat transcript, tool arguments, secrets, customer data, or private context.

Current MVP attestation fields:

| Field | Purpose |
| --- | --- |
| `agentId` | Stable identifier for the actor or agent namespace. |
| `actionHash` | SHA-256 hash of the signed audit record or batch Merkle root. |
| `timestamp` | Contract event timestamp for ordering and review. |
| `metadata` | Optional URI or empty string; do not place sensitive payloads here. |

The local audit record remains inside the control-plane environment. The ledger only receives enough evidence to prove later tampering.

## Provider Roles

| Provider | Role | What It Does Not Receive |
| --- | --- | --- |
| Coinbase Developer Platform | Server-wallet signing for DAAL transactions. | Agent chat content, raw prompts, private tool payloads, or app secrets. |
| thirdweb | Contract deployment and optional transaction infrastructure. | Local audit body unless explicitly placed in metadata. |
| Alchemy | Base RPC reads and receipt verification. | Raw agent context or policy documents. |
| Base Sepolia | Testnet ledger for MVP evidence anchoring. | Private action details; only hashes and optional metadata URI. |

External provider documentation to review during procurement:

- Coinbase Developer Platform Server Wallets describe secure enclave / TEE custody for server-wallet private keys: <https://www.coinbase.com/developer-platform/products/wallets/>
- thirdweb Transactions / Engine describes server-wallet transaction operations, nonce management, relaying, and observability: <https://portal.thirdweb.com/engine/>
- Alchemy Base Sepolia RPC documents the Base Sepolia endpoint and chain ID `84532`: <https://www.alchemy.com/rpc/base-sepolia>

## Defense In Depth

ZT-Infra is not a single sandbox claim. It is the adapter and audit layer in a defense-in-depth stack:

| Layer | Control |
| --- | --- |
| Access | Tailscale and SSM keep infrastructure off public SSH. |
| Identity | The adapter sends an actor identity; Phase 2 binds this to mTLS/SPIFFE. |
| Policy | `POST /actions` must return `allow` before protected execution. |
| Broker | Docker Local and Nono brokers translate allowed actions into constrained execution. |
| Host hardening | The provisioner runs as a dedicated non-root user with systemd sandboxing. |
| Evidence | Local hash-chain records are signed and can be anchored through DAAL. |

The Nono broker should be understood as one execution isolation layer, not the entire security model. If a sandbox layer weakens, policy-before-execution, broker controls, host hardening, and immutable audit evidence still limit and expose unsafe behavior.

## Operational Resilience

The authorization path is designed to remain fast and available:

1. Policy decision happens first.
2. Local audit is written immediately.
3. DAAL anchoring is queued asynchronously.
4. Execution does not wait for Base, Alchemy, thirdweb, or CDP confirmation.
5. Reconciliation verifies transaction receipts later.

If the ledger path is unavailable, local signed audit records remain durable and should be retried or reconciled. This is the difference between "audit delayed" and "agent execution outage."

## Vendor Portability

DAAL is intentionally EVM-compatible.

| Current Choice | Portability Path |
| --- | --- |
| Base Sepolia / Base | Any EVM chain with a compatible `DAALog` deployment. |
| Alchemy RPC | Another EVM RPC provider or self-hosted node. |
| thirdweb deployment tooling | Native Solidity deployment, Foundry, Hardhat, or another contract manager. |
| CDP Server Wallet | Another managed signer, KMS-backed signer, or controlled EOA provider. |

The control-plane contract is the audit hash and transaction hash, not a proprietary provider object.

## Current Claim Boundary

Approved enterprise-facing claim:

```text
ZT-Infra anchors hashes of agent authorization decisions to Base Sepolia so local audit records become independently tamper-evident.
```

Avoid:

```text
Every production audit log is blockchain verified.
```

That stronger claim requires production reconciliation, delivery-rate monitoring, alerting, and retention evidence.
