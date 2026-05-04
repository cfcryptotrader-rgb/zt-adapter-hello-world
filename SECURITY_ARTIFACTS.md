# Security Artifacts

This page lists the security evidence available in the public repository.

| Artifact | Status | Location |
| --- | --- | --- |
| Vulnerability reporting policy | Done | [SECURITY.md](./SECURITY.md) |
| Threat model | Done | [THREAT_MODEL.md](./THREAT_MODEL.md) |
| Risk register | Done | [RISK_REGISTER.md](./RISK_REGISTER.md) |
| Incident response playbook | Done | [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) |
| SAST | Done | CodeQL workflow in [.github/workflows/codeql.yml](./.github/workflows/codeql.yml) |
| Dependency review | Done | CI workflow in [.github/workflows/ci.yml](./.github/workflows/ci.yml) |
| npm audit | Done | CI workflow and local `npm audit --omit=dev` |
| Secret scan | Done | `npm run security:secrets` and GitHub secret scanning guidance |
| Recording disclosure scan | Done | `npm run security:recordings` checks public asciinema casts for common leak patterns |
| SBOM generation | Done | `npm run sbom` and CI `sbom` artifact |
| DAAL explorer verification | Partial | [EXPLORER_VERIFICATION.md](./EXPLORER_VERIFICATION.md) |
| Enterprise attestation model | Done | [ENTERPRISE_READINESS.md](./ENTERPRISE_READINESS.md) |
| Life-of-request data flow | Done | [LIFE_OF_REQUEST.md](./LIFE_OF_REQUEST.md) |

## Local Security Commands

```bash
npm test
npm audit --omit=dev
npm run security:secrets
npm run security:recordings
npm run sbom
```

The generated SBOM file is intentionally ignored by git. CI uploads it as an artifact for release review.
