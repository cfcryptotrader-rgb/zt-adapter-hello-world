# Incident Response Plan

This playbook defines how maintainers respond to a security issue in the public adapter repo or hosted developer site.

## Severity Levels

| Severity | Examples | Target Response |
| --- | --- | --- |
| Critical | Committed secret, policy bypass with working exploit, malicious package release. | Acknowledge within 1 business day, freeze releases, rotate affected secrets, publish advisory when fixed. |
| High | Unsafe broker default, audit verifier false positive, dependency vulnerability affecting runtime behavior. | Acknowledge within 2 business days, patch or document mitigation within 7 business days. |
| Medium | Documentation that could cause unsafe deployment, incomplete threat model, non-runtime dependency issue. | Triage within 7 business days. |
| Low | Typo, broken link, non-security doc clarification. | Normal issue workflow. |

## War Room

Initial incident roles:

| Role | Owner |
| --- | --- |
| Incident Commander | Named project maintainer |
| Engineering Lead | Delegated maintainer |
| Communications Lead | Project maintainer until another maintainer is assigned |
| Security Reviewer | External reporter plus invited reviewer when appropriate |

If only one maintainer is available, that maintainer owns all roles and records decisions in the private advisory or issue tracker.

## First 30 Minutes

1. Move discussion to a private channel: GitHub private advisory, security email, or private maintainer thread.
2. Confirm whether a secret, package, release, website, or adapter path is affected.
3. Run local checks:

```bash
npm test
npm run security:secrets
npm audit --omit=dev
```

4. If a release or demo path is unsafe, freeze promotion and run:

```bash
bash scripts/incident-freeze.sh
```

5. Assign one owner to each remediation task.

## Freeze Actions

For the public adapter repo:

- disable or roll back unsafe Vercel environment variables;
- pause publishing new npm/package releases;
- pin or revert the affected dependency;
- temporarily remove unsafe docs or demo links;
- open a private GitHub advisory if the issue is exploitable.

For deployed production control planes:

- keep SSM access alive;
- rotate affected AWS, Tailscale, Alchemy, Thirdweb, Coinbase, or GitHub credentials;
- pause dangerous action policies;
- disable or quarantine affected brokers;
- preserve audit logs and verification JSON before redeploying.

## Recovery Criteria

An incident is ready to close when:

- the exploit path is fixed or clearly mitigated;
- tests and security checks pass;
- affected secrets are rotated and old credentials revoked;
- release notes or advisory text are prepared;
- the risk register is updated if the incident exposed a recurring risk.
