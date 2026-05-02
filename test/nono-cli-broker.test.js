import assert from "node:assert/strict";
import { test } from "node:test";

import { buildNonoRunArgs, NonoCliBroker, normalizePermissions } from "../brokers/nono-cli/index.js";
import { ZeroTrustClient } from "../src/zero-trust-client.js";

function fakeFetch(decision) {
  return async () => ({
    ok: decision === "allow",
    status: decision === "allow" ? 200 : 403,
    async json() {
      return {
        actor: "demo-agent",
        action: "broker.nono.spawn_agent",
        resource: "repo/example",
        decision,
        reason: "test policy",
        audit: {
          previous_hash: "0".repeat(64),
          current_hash: "b".repeat(64),
          kms_signature: { algorithm: "MOCK_ECDSA_SHA_256", key_id: "mock", signature: "mock" },
        },
      };
    },
  });
}

test("NonoCliBroker skips nono execution on deny", async () => {
  let ran = false;
  const broker = new NonoCliBroker({
    client: new ZeroTrustClient({ actor: "demo-agent", fetchImpl: fakeFetch("deny") }),
    runner: async () => {
      ran = true;
      return {};
    },
  });

  const result = await broker.run({ resource: "repo/example" });

  assert.equal(ran, false);
  assert.equal(result.broker, "nono-cli");
  assert.equal(result.decision, "deny");
  assert.equal(result.executionSkipped, true);
});

test("NonoCliBroker invokes nono with least-privilege capability flags on allow", async () => {
  const calls = [];
  const broker = new NonoCliBroker({
    client: new ZeroTrustClient({ actor: "demo-agent", fetchImpl: fakeFetch("allow") }),
    nonoBin: "/usr/local/bin/nono",
    runner: async (command, args) => {
      calls.push({ command, args });
      return { command, args, exitCode: 0, stdout: "sandboxed\n", stderr: "" };
    },
  });

  const result = await broker.run({
    actor: "demo-agent",
    resource: "repo/example",
    command: ["node", "-e", "console.log('sandboxed')"],
    permissions: {
      read: ["./src"],
      write: ["./tmp"],
      allowFile: ["./package.json"],
      blockNet: true,
      rollback: true,
      auditIntegrity: true,
    },
    sessionName: "zt-demo-agent",
  });

  assert.equal(result.decision, "allow");
  assert.equal(result.executionSkipped, false);
  assert.equal(calls[0].command, "/usr/local/bin/nono");
  assert.deepEqual(calls[0].args, [
    "--silent",
    "run",
    "--name",
    "zt-demo-agent",
    "--read",
    "./src",
    "--write",
    "./tmp",
    "--allow-file",
    "./package.json",
    "--allow-cwd",
    "--block-net",
    "--rollback",
    "--no-rollback-prompt",
    "--audit-integrity",
    "--",
    "node",
    "-e",
    "console.log('sandboxed')",
  ]);
});

test("buildNonoRunArgs supports explicit network allowlisting when network is not blocked", () => {
  const args = buildNonoRunArgs({
    command: ["agent"],
    permissions: {
      allow: ["."],
      blockNet: false,
      allowDomain: ["api.openai.com"],
      openPort: [8080],
    },
  });

  assert.deepEqual(args, [
    "--silent",
    "run",
    "--name",
    "zt-nono-agent",
    "--allow",
    ".",
    "--allow-domain",
    "api.openai.com",
    "--open-port",
    "8080",
    "--allow-cwd",
    "--",
    "agent",
  ]);
});

test("normalizePermissions rejects unsafe Nono capability values", () => {
  assert.throws(() => normalizePermissions({ allow: ["./ok\n--read /"] }), /invalid value/);
  assert.throws(() => normalizePermissions({ allowDomain: ["api.openai.com/evil"] }), /invalid domain/);
  assert.throws(() => normalizePermissions({ listenPort: [70000] }), /invalid port/);
  assert.throws(
    () => normalizePermissions({ blockNet: true, allowDomain: ["api.openai.com"] }),
    /blockNet cannot be combined/,
  );
});
