# 10-Minute Web3 Integration

This guide is for the DAAL attestation layer only. The Hello World quickstart does not require Web3 credentials.

Use this when you are deploying the full ZT-Infra control plane and want authorization-decision hashes anchored to Base Sepolia for non-repudiation.

## Required Values

Non-secret values:

```bash
DAAL_ENABLED=true
DAAL_PROVIDER_MODE=cdp
DAAL_NETWORK=base-sepolia
DAAL_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
CDP_EVM_ACCOUNT_ADDRESS=0x0000000000000000000000000000000000000000
```

Secret values:

```bash
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
CDP_WALLET_SECRET=...
ALCHEMY_API_KEY=...
THIRDWEB_SECRET_KEY=...
```

`THIRDWEB_SECRET_KEY` is needed for contract deployment and management. The current runtime path uses `DAAL_PROVIDER_MODE=cdp`, so CDP signs the attestation transaction and Alchemy verifies the receipt.

## Setup Checklist

1. Create or select a CDP Server Wallet.
2. Confirm the EVM account address has Base Sepolia ETH for testnet gas.
3. Deploy or reuse the DAALog contract on Base Sepolia.
4. Create an Alchemy Base Sepolia app and copy the API key.
5. Store the secret values in AWS Secrets Manager or your CI secret store.
6. Run the DAAL config check before deploy.
7. Deploy the infrastructure.
8. Call a protected action and confirm a local audit record appears.
9. Wait for DAAL batch flush or force enough demo actions to meet `DAAL_BATCH_SIZE`.
10. Open the Base Sepolia transaction link and verify the transaction targets the configured DAAL contract.

## Config Check

In the full ZT-Infra repo:

```bash
DAAL_ENABLED=true \
DAAL_PROVIDER_MODE=cdp \
DAAL_NETWORK=base-sepolia \
DAAL_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000 \
CDP_EVM_ACCOUNT_ADDRESS=0x0000000000000000000000000000000000000000 \
node scripts/check-das-config.mjs
```

The script reports the active signer mode, contract address, expected provider roles, and missing configuration.

## Operational Notes

- Do not put CDP, Alchemy, or thirdweb secrets in git.
- Keep `DAAL_BATCH_SIZE=10` for MVP demos unless you need immediate single-action smoke tests.
- Use Base Sepolia for pilots and Base mainnet only after cost limits, reconciliation, and alerting are ready.
- Keep DAAL asynchronous. Do not make policy decisions wait for ledger finality.

## Provider Portability

The integration intentionally uses EVM-compatible primitives:

- `DAALog.sol` can be deployed with thirdweb, Remix, Foundry, Hardhat, or a native contract deployment pipeline.
- Receipt verification can use Alchemy, another RPC provider, or a self-hosted node.
- Signing can use CDP Server Wallets, another managed signer, or a KMS-backed signer.

The product boundary is `agentId + actionHash + txHash`, not a vendor-specific dashboard object.
