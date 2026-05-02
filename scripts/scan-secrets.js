#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";

const allowlist = new Set([
  "package-lock.json",
  "recordings/agent-blocked-then-authorized.cast",
  "public/agent-blocked-then-authorized.cast",
]);

const patterns = [
  {
    name: "AWS access key",
    pattern: /AKIA[0-9A-Z]{16}/,
  },
  {
    name: "Tailscale auth key",
    pattern: /tskey-auth-[A-Za-z0-9_-]+/,
  },
  {
    name: "GitHub token",
    pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/,
  },
  {
    name: "OpenAI API key",
    pattern: /sk-[A-Za-z0-9_-]{32,}/,
  },
  {
    name: "Alchemy API URL",
    pattern: /https:\/\/[A-Za-z0-9.-]*g\.alchemy\.com\/v2\/[A-Za-z0-9_-]+/,
  },
  {
    name: "Thirdweb secret key",
    pattern: /THIRDWEB_SECRET_KEY\s*=\s*["']?[A-Za-z0-9._-]{20,}/,
  },
  {
    name: "CDP wallet secret",
    pattern: /CDP_WALLET_SECRET\s*=\s*["']?[A-Za-z0-9._-]{20,}/,
  },
  {
    name: "Private key block",
    pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
];

function trackedFiles() {
  const output = execFileSync("git", ["ls-files"], { encoding: "utf8" });
  return output.split("\n").filter(Boolean);
}

const findings = [];

for (const file of trackedFiles()) {
  if (allowlist.has(file)) {
    continue;
  }
  const buffer = fs.readFileSync(file);
  if (buffer.length > 1024 * 1024) {
    continue;
  }
  const contents = buffer.toString("utf8");
  for (const { name, pattern } of patterns) {
    if (pattern.test(contents)) {
      findings.push(`${file}: matched ${name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets found in tracked files:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("secret scan ok: no known secret patterns found in tracked files");
