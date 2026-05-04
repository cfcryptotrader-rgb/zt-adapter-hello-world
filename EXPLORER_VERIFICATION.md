# Blockchain Explorer Verification

This document tracks the public verification status for DAAL smart contracts.

## Current Status

| Item | Status | Notes |
| --- | --- | --- |
| Public DAAL contract address | MVP evidence published | Base Sepolia contract `0x73D7465a33906156447C8D8bf4ad285dCd811fD2` is the current MVP DAALog contract. |
| Explorer verification | Partial | Sourcify and Blockscout verification succeeded during deployment. Basescan/Etherscan API verification was skipped because no API key was configured in Remix. |
| Supported MVP testnets | Active | Base Sepolia is the current MVP testnet. Polygon Amoy remains a compatible option. |
| Public verifier evidence | Partial | Direct and batched AWS smoke transactions are published below. Production all-log reconciliation and a packaged verifier workflow are still planned. |

## MVP Smoke Evidence

This evidence proves the current MVP path can anchor action hashes to Base Sepolia. It should not be marketed as a production all-log guarantee.

| Field | Value |
| --- | --- |
| Network | `base-sepolia` |
| Contract name | `DAALog` |
| Contract address | `0x73D7465a33906156447C8D8bf4ad285dCd811fD2` |
| Runtime sender | `0xc0fd34C1d7bbFDCFc46D40Ffd085c3BF6ef67b56` |
| Runtime provider | CDP direct mode |
| Receipt verification | Passed with Alchemy receipt verification |

## Example Transactions

| Scenario | Action hash / root | Transaction |
| --- | --- | --- |
| Direct DAAL smoke | `0xab1347c9b9c95234aafc00921c4610711150ef4e109564c2761fda34b6d9ea80` | `https://sepolia.basescan.org/tx/0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9` |
| AWS `/actions` batch smoke | `0xa515c2e69e725e459b252973319211a70f110e0f1daf823e7efe444ebd022587` | `https://sepolia.basescan.org/tx/0xd5f725ca0531e0eb6c8754e62c94d7c027e1b58cc72d541d4c288e9b297a7e3f` |

Additional AWS smoke context:

| Field | Value |
| --- | --- |
| AWS instance | `i-09261e895db142732` |
| Authorization path | `/actions` deny-before-execute decision, audit record, asynchronous DAAL batch flush |
| Receipt verification | Passed with Alchemy receipt verification |

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
Every audit log is blockchain verified.
```

That claim is only valid after the production control plane writes all relevant audit anchors to a verified deployed contract and monitoring proves the expected delivery rate.
