# Blockchain Explorer Verification

This document tracks the public verification status for DAAL smart contracts.

## Current Status

| Item | Status | Notes |
| --- | --- | --- |
| Public DAAL contract address | Not published | No public adapter quickstart contract address is currently committed. |
| Explorer verification | Pending | Do not claim Basescan, Etherscan, or Polygonscan verification until the deployed contract source is verified on the explorer. |
| Supported MVP testnets | Planned | Base Sepolia and Polygon Amoy are the intended low-cost testnet targets. |
| Public verifier evidence | Planned | Future docs should include contract address, explorer link, deployment transaction, source verification link, and example audit transaction. |

## Verification Requirement

Before public claims that DAAL is explorer-verifiable, publish all of the following:

| Field | Required Value |
| --- | --- |
| Network | `base-sepolia` or `polygon-amoy` |
| Contract name | `DAALog` |
| Contract address | `0x...` |
| Deployment transaction | Explorer transaction URL |
| Verified source URL | Basescan, Etherscan, or Polygonscan contract verification URL |
| Example audit transaction | Explorer transaction URL containing an emitted `ActionLogged` event |
| Source commit | Git commit that matches the deployed Solidity source |

## Acceptance Criteria

A third-party reviewer must be able to:

1. Open the explorer contract page.
2. See the contract source marked verified.
3. Match the verified source to the public repository commit.
4. Open an example transaction.
5. Confirm the transaction emitted an `ActionLogged` event with an agent ID, action hash, timestamp, and metadata.

## Claim Boundaries

Approved claim before verification:

```text
DAAL hooks and verifier patterns are planned; public explorer verification is pending.
```

Approved claim after verification:

```text
The DAAL testnet contract is verified on <Explorer>, and example audit anchors can be independently inspected.
```

Avoid:

```text
Every audit log is blockchain verified.
```

That claim is only valid after the production control plane writes all relevant audit anchors to a verified deployed contract and monitoring proves the expected delivery rate.
