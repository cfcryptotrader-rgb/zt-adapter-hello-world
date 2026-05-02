import assert from "node:assert/strict";
import { test } from "node:test";

import { buildDockerRunArgs, DockerLocalBroker } from "../brokers/docker-local/index.js";
import { ZeroTrustClient } from "../src/zero-trust-client.js";

function fakeFetch(decision) {
  return async () => ({
    ok: decision === "allow",
    status: decision === "allow" ? 200 : 403,
    async json() {
      return {
        actor: "hello-world-agent",
        action: "hello-world.say_hello",
        resource: "docker-local-demo",
        decision,
        reason: "test policy",
        audit: {
          previous_hash: "0".repeat(64),
          current_hash: "a".repeat(64),
          kms_signature: { algorithm: "MOCK_ECDSA_SHA_256", key_id: "mock", signature: "mock" },
        },
      };
    },
  });
}

test("DockerLocalBroker skips docker execution on deny", async () => {
  let ran = false;
  const broker = new DockerLocalBroker({
    client: new ZeroTrustClient({ fetchImpl: fakeFetch("deny") }),
    runner: async () => {
      ran = true;
      return {};
    },
  });

  const result = await broker.run({ resource: "docker-local-demo" });

  assert.equal(ran, false);
  assert.equal(result.decision, "deny");
  assert.equal(result.executionSkipped, true);
});

test("DockerLocalBroker invokes hardened docker command on allow", async () => {
  const calls = [];
  const broker = new DockerLocalBroker({
    client: new ZeroTrustClient({ fetchImpl: fakeFetch("allow") }),
    runner: async (command, args) => {
      calls.push({ command, args });
      return { command, args, exitCode: 0, stdout: "hello\n", stderr: "" };
    },
  });

  const result = await broker.run({
    resource: "docker-local-demo",
    image: "node:20-alpine",
    command: ["node", "-e", "console.log('hello')"],
  });

  assert.equal(result.decision, "allow");
  assert.equal(result.executionSkipped, false);
  assert.equal(calls[0].command, "docker");
  assert.deepEqual(calls[0].args.slice(0, 9), [
    "run",
    "--rm",
    "--network",
    "none",
    "--read-only",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
  ]);
});

test("buildDockerRunArgs rejects unsafe env names", () => {
  assert.throws(
    () => buildDockerRunArgs({ image: "node:20-alpine", command: ["node"], env: { "BAD-NAME": "x" } }),
    /invalid environment variable name/,
  );
});

