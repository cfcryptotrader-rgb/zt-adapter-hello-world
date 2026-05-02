#!/usr/bin/env node

import { verifyAuditFile } from "../src/audit-verifier.js";

const [, , command, filePath] = process.argv;

if (command !== "verify" || !filePath) {
  console.error("usage: zt-audit verify audit.json");
  process.exit(2);
}

try {
  const result = await verifyAuditFile(filePath);
  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}

