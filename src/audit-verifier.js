import crypto from "node:crypto";
import fs from "node:fs/promises";

const HEX_64 = /^[a-f0-9]{64}$/i;

export async function verifyAuditFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return verifyAuditDocument(parsed);
}

export function verifyAuditDocument(document) {
  const records = Array.isArray(document) ? document : [document];
  const errors = [];
  let previous = null;

  records.forEach((record, index) => {
    const normalized = normalizeRecord(record);
    const prefix = `record[${index}]`;

    if (!normalized.actor) {
      errors.push(`${prefix}: actor is required`);
    }
    if (!normalized.action) {
      errors.push(`${prefix}: action is required`);
    }
    if (!normalized.decision) {
      errors.push(`${prefix}: decision is required`);
    }
    if (!normalized.reason) {
      errors.push(`${prefix}: reason is required`);
    }
    if (!normalized.audit) {
      errors.push(`${prefix}: audit object is required`);
      return;
    }
    if (!normalized.audit.timestamp) {
      errors.push(`${prefix}: audit.timestamp is required`);
    }
    if (!HEX_64.test(normalized.audit.previous_hash || "")) {
      errors.push(`${prefix}: audit.previous_hash must be a 64-character hex string`);
    }
    if (!HEX_64.test(normalized.audit.current_hash || "")) {
      errors.push(`${prefix}: audit.current_hash must be a 64-character hex string`);
    }
    if (!normalized.audit.kms_signature?.algorithm) {
      errors.push(`${prefix}: audit.kms_signature.algorithm is required`);
    }
    if (!normalized.audit.kms_signature?.signature) {
      errors.push(`${prefix}: audit.kms_signature.signature is required`);
    }
    if (previous && normalized.audit.previous_hash !== previous.audit.current_hash) {
      errors.push(`${prefix}: previous_hash does not match prior record current_hash`);
    }

    const expectedHash = computeCurrentHash(normalized);
    if (expectedHash !== normalized.audit.current_hash) {
      errors.push(`${prefix}: current_hash does not match canonical actor/action/resource/decision/reason/timestamp payload`);
    }

    previous = normalized;
  });

  return {
    ok: errors.length === 0,
    records: records.length,
    errors,
  };
}

export function computeCurrentHash(record) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        actor: record.actor,
        action: record.action,
        resource: record.resource || "",
        result: record.decision,
        reason: record.reason,
        timestamp: record.audit.timestamp,
        previousHash: record.audit.previous_hash,
      }),
    )
    .digest("hex");
}

function normalizeRecord(record) {
  const audit = record.audit || record;
  return {
    actor: record.actor || audit.actor || "",
    action: record.action || audit.action || "",
    resource: record.resource || audit.resource || "",
    decision: record.decision || audit.decision || audit.result || "",
    reason: record.reason || audit.reason || "",
    audit,
  };
}

