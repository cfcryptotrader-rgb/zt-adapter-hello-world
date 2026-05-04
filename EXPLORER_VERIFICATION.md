# Ledger Explorer Verification

This document tracks the public verification status for optional DAAL smart contracts.

## Current Status

| Item | Status | Notes |
| --- | --- | --- |
| Public DAAL contract address | Redacted from starter repo | Publish contract addresses in release notes or deployment-specific evidence bundles after source mapping and review. |
| Explorer verification | Criteria documented | This page defines what must be shown before making explorer-verification claims. |
| Supported MVP testnets | Active | Base Sepolia is the current MVP target. Polygon Amoy remains a compatible option. |
| Public verifier evidence | Planned | Production all-log reconciliation and a packaged verifier workflow are still planned. |

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
DAAL hooks and verifier patterns exist, and Base Sepolia MVP evidence is published. Production all-log verification claims remain pending until source-to-contract mapping, reconciliation, alerting, and verifier automation are complete.
```

Approved claim after full verification:

```text
The DAAL testnet contract is verified on <Explorer>, and example audit anchors can be independently inspected.
```

Avoid:

```text
Every audit log is ledger verified.
```

That claim is only valid after the production control plane writes all relevant audit anchors to a verified deployed contract and monitoring proves the expected delivery rate.
