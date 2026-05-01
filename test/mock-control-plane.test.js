import assert from "node:assert/strict";
import { test } from "node:test";

import { createMockControlPlaneState } from "../src/mock-control-plane.js";

test("mock control plane supports register, deny, allow, and execute flow", async () => {
  const state = createMockControlPlaneState();

  const registered = state.registerAgent("junior-dev-agent");
  assert.equal(registered.status, 201);

  const denied = state.decide({
    actor: "junior-dev-agent",
    action: "aws.ec2.terminate_instances",
    resource: "i-demo",
  });
  assert.equal(denied.status, 403);
  assert.equal(denied.body.decision, "deny");

  const policy = state.allowAction("hello-world.say_hello", "Quickstart policy allows hello world.");
  assert.equal(policy.status, 201);

  const allowed = state.decide({
    actor: "junior-dev-agent",
    action: "hello-world.say_hello",
    resource: "local-demo",
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.body.decision, "allow");
  assert.equal(allowed.body.audit.kms_signature.algorithm, "MOCK_ECDSA_SHA_256");
});
