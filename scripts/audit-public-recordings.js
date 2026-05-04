#!/usr/bin/env node

import fs from "node:fs";

const files = [
  "public/agent-blocked-then-authorized.cast",
  "public/nono-sandbox-demo.cast",
];

const patterns = [
  { name: "AWS ARN", pattern: /arn:aws:[A-Za-z0-9:/._+=,@-]+/ },
  { name: "AWS account id", pattern: /\b[0-9]{12}\b/ },
  { name: "AWS resource id", pattern: /\b(?:i|vpc|subnet|sg|rtb|igw|vol)-[0-9a-f]{8,}\b/ },
  { name: "Tailscale auth key", pattern: /tskey-auth-[A-Za-z0-9_-]+/ },
  { name: "API key", pattern: /\b(?:sk|gh[pousr])_[A-Za-z0-9_-]{20,}\b/ },
  { name: "EVM address or transaction hash", pattern: /\b0x[0-9a-fA-F]{40,64}\b/ },
  { name: "local home path", pattern: /\/Users\/[A-Za-z0-9._-]+\// },
  { name: "email address", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
];

const findings = [];

for (const file of files) {
  if (!fs.existsSync(file)) {
    findings.push(`${file}: missing expected recording`);
    continue;
  }
  const contents = fs.readFileSync(file, "utf8");
  for (const { name, pattern } of patterns) {
    if (pattern.test(contents)) {
      findings.push(`${file}: matched ${name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential disclosure found in public terminal recordings:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("recording audit ok: no high-risk disclosure patterns found");
