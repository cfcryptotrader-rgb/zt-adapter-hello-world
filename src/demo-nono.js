import { NonoCliBroker } from "../brokers/nono-cli/index.js";
import { ZeroTrustClient } from "./zero-trust-client.js";

const mode = process.argv[2] || "deny";
const actor = process.env.ZT_ACTOR || "demo-agent";
const baseUrl = process.env.ZT_CONTROL_PLANE_URL || "http://127.0.0.1:3000";

if (!["deny", "allow"].includes(mode)) {
  console.error("usage: node src/demo-nono.js deny|allow");
  process.exit(2);
}

const broker = new NonoCliBroker({
  actor,
  client: new ZeroTrustClient({ actor, baseUrl }),
});

try {
  const result = await broker.run({
    actor,
    action: "broker.nono.spawn_agent",
    resource: "repo/example",
    command: ["node", "-e", "console.log('hello from a policy-approved Nono sandbox action')"],
    permissions: {
      allowCwd: true,
      blockNet: true,
      auditIntegrity: false,
      rollback: false,
    },
    sessionName: "zt-demo-agent",
  });

  console.log(JSON.stringify(summarize(result), null, 2));
  if (mode === "allow" && result.decision !== "allow") {
    process.exit(1);
  }
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message, result: error.result }, null, 2));
  process.exit(1);
}

function summarize(result) {
  return {
    broker: result.broker,
    actor: result.actor,
    action: result.action,
    resource: result.resource,
    decision: result.decision,
    reason: result.reason,
    executionSkipped: result.executionSkipped,
    permissions: result.permissions,
    audit: {
      previous_hash: result.audit?.previous_hash,
      current_hash: result.audit?.current_hash,
      kms_signature: result.audit?.kms_signature,
    },
    sandbox:
      result.result && result.executionSkipped === false
        ? {
            command: result.result.command,
            args: result.result.args,
            exitCode: result.result.exitCode,
            stdout: result.result.stdout,
          }
        : undefined,
  };
}
