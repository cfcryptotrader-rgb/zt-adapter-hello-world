# Engagement Strategy

This document turns launch attention into measurable community learning.

## Channels

| Channel | Purpose | Measurement |
| --- | --- | --- |
| GitHub Traffic | Measure repository visits, clones, and referring sites after launch. | Weekly review during alpha. |
| GitHub Issues | Capture reproducible bugs, docs gaps, Good First Issues, and broker proposals. | Time to first maintainer response. |
| Discord | Fast feedback and onboarding help. | Question themes and recurring friction. |
| Buttondown | Capture alpha updates without requiring an app account. | Subscriber count and click-through rate. |
| npm | Package discoverability if the adapter SDK is published. | Downloads, versions, and downstream issue reports. |
| Vercel Analytics | Website page interest and conversion paths. | Homepage to quickstart and docs clicks. |

## Developer Hub Plan

1. Keep the five-minute quickstart visible on the homepage and README.
2. Publish tagged releases before broad launch posts.
3. Link every launch post to:
   - `/quickstart`;
   - `/docs/threat-model`;
   - `/docs/phase1-ready`;
   - `/docs/community`.
4. Review GitHub Traffic weekly for the first month.
5. Convert repeated Discord questions into docs or Good First Issues.

## Package Manager Plan

The repo is package-ready, but npm publication should wait until:

- API docs are stable;
- the package name is selected;
- `CHANGELOG.md` has a release entry;
- CI produces tests, SAST, dependency review, secret scan, and SBOM artifacts.

## Authority Positioning

ZT-Infra should be positioned as an agent action control point aligned with Zero Trust principles: explicit authorization, least privilege, and resource-focused protection. The project should reference NIST SP 800-207 carefully as an architectural influence, not as a certification or endorsement.

