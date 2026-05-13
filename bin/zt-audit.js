#!/usr/bin/env node

import { verifyAuditFile } from "../src/audit-verifier.js";

const usage = `Usage:
  zt-audit verify audit.json

Verifies an audit-shaped JSON response from the demo adapter.

Expected input shape (top-level required fields: actor, action, decision, reason, audit; resource is optional):
  {
    "actor": "hello-world-agent",
    "action": "hello-world.say_hello",
    "resource": "local-demo",
    "decision": "allow" | "deny",
    "reason": "...",
    "audit": {
      "timestamp": "2026-05-01T00:00:00.000Z",
      "previous_hash": "<64 hex chars>",
      "current_hash": "<64 hex chars>",
      "kms_signature": {
        "algorithm": "MOCK_ECDSA_SHA_256",
        "key_id": "mock-key",
        "signature": "mock-signature"
      }
    }
  }

Common failures:
  - missing or unreadable audit file
  - missing required actor/action/decision/reason/audit fields
  - current_hash does not match the canonical audit payload
  - missing KMS signature metadata
`;

const [, , command, filePath] = process.argv;

if (command !== "verify" || !filePath) {
  console.error(usage.trimEnd());
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
