import assert from "node:assert/strict";
import { test } from "node:test";

import { checkAction } from "../src/adapter.js";

test("checkAction posts to the Zero Trust control plane", async () => {
  const requests = [];
  const decision = await checkAction({
    actor: "junior-dev-agent",
    action: "aws.ec2.terminate_instances",
    resource: "i-demo",
    controlPlaneUrl: "http://control-plane.local",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: false,
        status: 403,
        async json() {
          return {
            ok: false,
            actor: "junior-dev-agent",
            action: "aws.ec2.terminate_instances",
            resource: "i-demo",
            decision: "deny",
            reason: "demo action blocked",
            audit: {
              previous_hash: "0".repeat(64),
              current_hash: "a".repeat(64),
              kms_signature: { algorithm: "ECDSA_SHA_256", key_id: "test", signature: "sig" },
            },
          };
        },
      };
    },
  });

  assert.equal(requests[0].url, "http://control-plane.local/actions");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    actor: "junior-dev-agent",
    action: "aws.ec2.terminate_instances",
    resource: "i-demo",
  });
  assert.equal(decision.status, 403);
  assert.equal(decision.decision, "deny");
  assert.equal(decision.audit.kms_signature.algorithm, "ECDSA_SHA_256");
});
