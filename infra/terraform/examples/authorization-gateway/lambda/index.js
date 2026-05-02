const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.requestContext?.http?.method !== "POST") {
    return response(404, { ok: false, error: "not found" });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { ok: false, error: "invalid json" });
  }

  const actor = String(body.actor || "").trim();
  const action = String(body.action || "").trim();
  const resource = String(body.resource || "").trim();

  if (!actor || !action) {
    return response(400, { ok: false, error: "actor and action are required" });
  }

  const allowed = action === "hello-world.say_hello";
  const decision = allowed ? "allow" : "deny";
  const reason = allowed
    ? "Example policy allows only the Hello World action."
    : "Example policy denies actions not explicitly allowed.";
  const timestamp = new Date().toISOString();
  const previousHash = "0".repeat(64);
  const currentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ actor, action, resource, result: decision, reason, timestamp, previousHash }))
    .digest("hex");

  return response(allowed ? 200 : 403, {
    ok: allowed,
    actor,
    action,
    resource,
    decision,
    reason,
    audit: {
      timestamp,
      previous_hash: previousHash,
      current_hash: currentHash,
      kms_signature: {
        algorithm: "EXAMPLE_UNSIGNED",
        key_id: "replace-with-kms-key",
        signature: "replace-with-kms-signature",
      },
    },
  });
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body, null, 2),
  };
}

