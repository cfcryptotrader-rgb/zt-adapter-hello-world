# Authorization Gateway Terraform Example

This example deploys a minimal AWS Authorization Gateway for public adapter experiments.

It intentionally uses AWS IAM authorization on the Lambda Function URL. There is no anonymous public ingress.

## What It Creates

- IAM role for the gateway Lambda.
- CloudWatch log group.
- Lambda function running a small `POST /actions` compatible handler.
- Lambda Function URL with `authorization_type = "AWS_IAM"`.

## Deploy

```bash
cd infra/terraform/examples/authorization-gateway
terraform init
terraform apply
```

## Call The Gateway

The function URL requires SigV4/IAM authorization. Use a signed HTTP client or AWS SDK. For local onboarding, keep using `npm run zt:mock`.

## Destroy

```bash
terraform destroy
```

## Production Notes

This example is a deployment skeleton, not a complete production ZT-Infra control plane.

Before production use, add:

- mTLS or workload identity binding;
- durable policy storage;
- KMS signing;
- CloudWatch audit sinks;
- broker-specific IAM roles;
- rate limiting and replay protection.
