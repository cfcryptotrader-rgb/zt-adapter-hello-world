import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

import { verifyAuditDocument } from "../src/audit-verifier.js";

const execFileAsync = promisify(execFile);

function auditRecord(overrides = {}) {
  const base = {
    actor: "hello-world-agent",
    action: "hello-world.say_hello",
    resource: "local-demo",
    decision: "allow",
    reason: "Mock policy allows the hello world action.",
    timestamp: "2026-05-01T00:00:00.000Z",
    previousHash: "0".repeat(64),
  };
  const data = { ...base, ...overrides };
  const currentHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        actor: data.actor,
        action: data.action,
        resource: data.resource,
        result: data.decision,
        reason: data.reason,
        timestamp: data.timestamp,
        previousHash: data.previousHash,
      }),
    )
    .digest("hex");

  return {
    actor: data.actor,
    action: data.action,
    resource: data.resource,
    decision: data.decision,
    reason: data.reason,
    audit: {
      timestamp: data.timestamp,
      previous_hash: data.previousHash,
      current_hash: currentHash,
      kms_signature: {
        algorithm: "MOCK_ECDSA_SHA_256",
        key_id: "mock-key",
        signature: "mock-signature",
      },
    },
  };
}

test("verifyAuditDocument validates a canonical audit response", () => {
  const result = verifyAuditDocument(auditRecord());

  assert.equal(result.ok, true);
  assert.equal(result.records, 1);
  assert.deepEqual(result.errors, []);
});

test("verifyAuditDocument detects tampering", () => {
  const record = auditRecord();
  record.reason = "tampered";

  const result = verifyAuditDocument(record);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /current_hash does not match/);
});

test("zt-audit verify validates files", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "zt-audit-"));
  const auditPath = path.join(dir, "audit.json");
  await fs.writeFile(auditPath, JSON.stringify(auditRecord(), null, 2));

  const { stdout } = await execFileAsync(process.execPath, ["bin/zt-audit.js", "verify", auditPath]);
  const result = JSON.parse(stdout);

  assert.equal(result.ok, true);
  assert.equal(result.records, 1);
});

test("zt-audit prints usage and expected input shape when arguments are missing", async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ["bin/zt-audit.js"]),
    (error) => {
      assert.equal(error.code, 2);
      assert.match(error.stderr, /Usage:/);
      assert.match(error.stderr, /zt-audit verify audit\.json/);
      assert.match(error.stderr, /Expected input shape \(top-level required fields: actor, action, decision, reason, audit; resource is optional\):/);
      assert.match(error.stderr, /missing required actor\/action\/decision\/reason\/audit fields/);
      assert.match(error.stderr, /Common failures:/);
      assert.match(error.stderr, /current_hash does not match/);
      return true;
    },
  );
});
