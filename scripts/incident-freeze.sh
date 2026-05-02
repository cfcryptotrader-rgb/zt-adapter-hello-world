#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
ZT-Infra incident freeze checklist

1. Stop publishing new releases until the incident commander clears release.
2. Move discussion to a private advisory, security email thread, or private maintainer channel.
3. Rotate affected cloud, wallet, API, Tailscale, GitHub, npm, Vercel, or provider credentials.
4. Disable unsafe Vercel environment variables or roll back the deployment if the website is affected.
5. Pause or remove any policy that allows the exploited action family.
6. Preserve audit logs, command output, and affected decision records for review.
7. Run:
   npm test
   npm run security:secrets
   npm audit --omit=dev
8. Update SECURITY.md, RISK_REGISTER.md, and release notes before reopening normal changes.
EOF

