const readinessItems = [
  {
    id: "phase1-ready-criteria",
    area: "governance",
    status: "done",
    title: "Phase 1 ready criteria",
    evidence: "/docs/phase1-ready",
  },
  {
    id: "contribution-framework",
    area: "governance",
    status: "done",
    title: "Contribution framework",
    evidence: "/docs/contributing",
  },
  {
    id: "risk-register",
    area: "governance",
    status: "done",
    title: "Risk register",
    evidence: "/docs/risk-register",
  },
  {
    id: "phase2-roadmap",
    area: "governance",
    status: "done",
    title: "Phase 2 mTLS/SPIFFE roadmap",
    evidence: "/docs/roadmap",
  },
  {
    id: "core-maintainers",
    area: "governance",
    status: "done",
    title: "Core maintenance roles",
    evidence: "/docs/governance",
  },
  {
    id: "use-case-catalog",
    area: "marketing",
    status: "done",
    title: "Use case catalog",
    evidence: "/docs/case-studies",
  },
  {
    id: "roi-metrics",
    area: "marketing",
    status: "done",
    title: "ROI metrics",
    evidence: "/docs/roi-metrics",
  },
  {
    id: "five-minute-poc",
    area: "marketing",
    status: "done",
    title: "Five-minute PoC quickstart",
    evidence: "/quickstart",
  },
  {
    id: "engagement-strategy",
    area: "marketing",
    status: "done",
    title: "Engagement strategy",
    evidence: "/docs/engagement-strategy",
  },
  {
    id: "nist-positioning",
    area: "marketing",
    status: "done",
    title: "NIST SP 800-207 positioning",
    evidence: "/docs/why-iam-fails",
  },
  {
    id: "security-policy",
    area: "security",
    status: "done",
    title: "Security reporting policy",
    evidence: "/docs/security",
  },
  {
    id: "daal-explorer-verification",
    area: "security",
    status: "done",
    title: "Verified DAAL contract address",
    evidence: "/docs/explorer-verification",
  },
  {
    id: "sast",
    area: "security",
    status: "done",
    title: "SAST through CodeQL",
    evidence: "/docs/security-artifacts",
  },
  {
    id: "sbom",
    area: "security",
    status: "done",
    title: "SBOM generation",
    evidence: "/docs/security-artifacts",
  },
  {
    id: "incident-response",
    area: "security",
    status: "done",
    title: "Incident response plan",
    evidence: "/docs/incident-response",
  },
  {
    id: "secret-management",
    area: "security",
    status: "done",
    title: "Secret scanning and push-protection guidance",
    evidence: "/docs/security-artifacts",
  },
  {
    id: "api-docs-release-notes",
    area: "security",
    status: "done",
    title: "API docs and release notes",
    evidence: "/docs/sdk-api",
  },
];

const riskItems = [
  {
    id: "policy-bypass",
    severity: "high",
    status: "open",
    title: "Policy bypass in an adapter",
    mitigation: "Require guardedCall or equivalent policy-before-execution checks in every adapter.",
  },
  {
    id: "actor-spoofing",
    severity: "high",
    status: "planned",
    title: "Actor spoofing in mock control plane",
    mitigation: "Phase 2 mTLS/SPIFFE identity binding and server-side actor binding.",
  },
  {
    id: "performance-overhead",
    severity: "medium",
    status: "open",
    title: "Control-plane decision overhead",
    mitigation: "Benchmark p95 decision latency and keep DAAL writes asynchronous.",
  },
  {
    id: "sandbox-leak",
    severity: "high",
    status: "planned",
    title: "MicroVM or sandbox isolation leak",
    mitigation: "Document broker isolation assumptions and add broker-specific hardening tests.",
  },
  {
    id: "secret-exposure",
    severity: "high",
    status: "active-control",
    title: "Secret exposure in examples or CI",
    mitigation: "Run local secret scanning in CI and keep GitHub push protection enabled.",
  },
];

const securityEvidence = [
  {
    id: "codeql",
    status: "done",
    title: "CodeQL SAST",
    command: "GitHub Actions codeql workflow",
  },
  {
    id: "dependency-review",
    status: "done",
    title: "Dependency review",
    command: "GitHub dependency-review-action",
  },
  {
    id: "npm-audit",
    status: "done",
    title: "npm audit",
    command: "npm audit --omit=dev",
  },
  {
    id: "secret-scan",
    status: "done",
    title: "Local secret scan",
    command: "npm run security:secrets",
  },
  {
    id: "sbom",
    status: "done",
    title: "CycloneDX SBOM",
    command: "npm run sbom",
  },
  {
    id: "daal-explorer",
    status: "done",
    title: "DAAL explorer verification",
    command: "Base Sepolia contract and example AWS smoke transactions are published",
  },
];

export function getReadinessChecklist() {
  return readinessItems.map((item) => ({ ...item }));
}

export function getRiskSummary() {
  return riskItems.map((item) => ({ ...item }));
}

export function getSecurityEvidence() {
  return securityEvidence.map((item) => ({ ...item }));
}

export function getLaunchStatus() {
  const checklist = getReadinessChecklist();
  const done = checklist.filter((item) => item.status === "done").length;
  const pending = checklist.filter((item) => item.status === "pending").length;
  const openRisks = riskItems.filter((item) => item.status === "open").length;

  return {
    phase: "phase-1-public-adapter-mvp",
    verdict: pending === 0 ? "ready" : "ready-with-bounded-gaps",
    done,
    pending,
    total: checklist.length,
    openRisks,
    claimBoundary:
      "The public MVP demonstrates deny-before-execute agent policy enforcement and published Base Sepolia DAAL smoke evidence; production all-log guarantees remain bounded until reconciliation, alerting, and verifier automation are complete.",
  };
}

export function getLaunchReadiness() {
  return {
    ok: true,
    generated_at: new Date().toISOString(),
    status: getLaunchStatus(),
    checklist: getReadinessChecklist(),
    risks: getRiskSummary(),
    security_evidence: getSecurityEvidence(),
  };
}
