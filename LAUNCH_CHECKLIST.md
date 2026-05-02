# Launch Checklist

This checklist tracks the governance, marketing, and engineering feedback for the public ZT-Infra adapter launch.

## Governance And Continuity

| Item | Status | Solution / Reference |
| --- | --- | --- |
| CONTRIBUTING guide with setup, PR process, and coding standards | Done | [CONTRIBUTING.md](./CONTRIBUTING.md) now documents environment setup, local checks, coding standards, broker rules, policy template rules, and PR standards. |
| Good First Issue backlog | Done | GitHub issues [#4](https://github.com/oscarmackjr-twg/zt-adapter-hello-world/issues/4), [#5](https://github.com/oscarmackjr-twg/zt-adapter-hello-world/issues/5), and [#6](https://github.com/oscarmackjr-twg/zt-adapter-hello-world/issues/6). |
| 90-day roadmap status | Done | [ROADMAP.md](./ROADMAP.md) includes Phase 1 status and a 90-Day Launch Status table. |
| GitHub Project board | Blocked | `gh project create` requires `project,read:project` token scopes. Run `gh auth refresh -s project,read:project`, then create the board. |
| Nono role/status | Done | [ROADMAP.md](./ROADMAP.md) and [GOVERNANCE.md](./GOVERNANCE.md) state that Nono is excluded from the public adapter MVP. |
| Community hub | Done | Discord channel `Zero Trust Infrastructure` is linked from [COMMUNITY.md](./COMMUNITY.md), README, and the homepage: https://discord.gg/cDS8MPX6G. |

## Narrative And Conversion

| Item | Status | Solution / Reference |
| --- | --- | --- |
| Vulnerability hook | Done | Homepage now shows the broad API key failure mode, names prompt injection as out of scope, and explains deny-before-execute as the mitigation. [CASE_STUDIES.md](./CASE_STUDIES.md) adds concrete examples. |
| Newsletter / lead capture | Done | Homepage includes a Buttondown-powered "Join the Alpha" form for `oscarmackjr`. |
| One-sentence pitch | Done | README and [LAUNCH_BRIEF.md](./LAUNCH_BRIEF.md): "Open-source identity, policy, and audit evidence for autonomous AI agents." |
| Social kit | Done | [SOCIAL_KIT.md](./SOCIAL_KIT.md) includes Hacker News, LinkedIn, X, approved claims, and claims to avoid. [LAUNCH_BRIEF.md](./LAUNCH_BRIEF.md) keeps the narrative brief. |
| Branding sync | Partial | Website and README share narrative and architecture assets. A reusable wordmark/logo remains planned. |

## Technical Trust And Security

| Item | Status | Solution / Reference |
| --- | --- | --- |
| Five-minute quickstart | Done | [README.md](./README.md) includes Node and Docker Compose paths. `docker compose config` passes. Full Compose runtime needs Docker daemon running. |
| Decentralized audit integration proof | Partial | `zt-audit verify` exists for local audit-shaped records. Public DAAL testnet proof remains planned. [EXPLORER_VERIFICATION.md](./EXPLORER_VERIFICATION.md) now defines the explorer verification acceptance criteria and claim boundaries. |
| Apache-2.0 license | Done | [LICENSE](./LICENSE), [NOTICE](./NOTICE), `package.json`, and `package-lock.json` now use Apache-2.0. README and homepage surface the license prominently. |
| SECURITY.md | Done | [SECURITY.md](./SECURITY.md) exists and GitHub private vulnerability reporting is enabled. |
| Repo cleanup | Done | Public repo excludes `.env`, `.terraform`, Terraform state, logs, and dependencies. |
| Secret scanning | Done | GitHub secret scanning and push protection are enabled. Local tracked-file scan found no obvious secrets. |
| SDK documentation | Done | README, [SDK_REVIEW.md](./SDK_REVIEW.md), and [SDK_API.md](./SDK_API.md) document usage, API shape, helper methods, and fail-closed behavior. |
| Branch protection | Done | `main` requires PR review, required `test`, stale review dismissal, admin enforcement, conversation resolution, no force pushes, and no deletions. |
| Automated scans | Done | CI includes tests, npm audit, dependency review, CodeQL, and Dependabot. |

## Latest Validation

| Check | Result |
| --- | --- |
| `npm test` | 29 tests passed |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `docker compose config` | Passed |
| `docker compose up -d` | Blocked locally because Docker daemon was not running |
| `git diff --check` | Passed |
