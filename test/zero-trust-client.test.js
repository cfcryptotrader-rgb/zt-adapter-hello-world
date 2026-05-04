import assert from "node:assert/strict";
import { test } from "node:test";

import { ZeroTrustClient } from "../src/zero-trust-client.js";

function fakeFetch({ decision = "deny", requests = [] } = {}) {
  return async (url, options) => {
    const request = { url, options, body: JSON.parse(options.body) };
    requests.push(request);
    return {
      ok: decision === "allow",
      status: decision === "allow" ? 200 : 403,
      async json() {
        return {
          ok: decision === "allow",
          ...request.body,
          decision,
          reason: "test policy",
          audit: {
            previous_hash: "0".repeat(64),
            current_hash: "a".repeat(64),
            kms_signature: { algorithm: "ECDSA_SHA_256", key_id: "test", signature: "sig" },
            daal: {
              status: "submitted",
              attestation_status: "verified",
              actionHash: "0xab1347c9b9c95234aafc00921c4610711150ef4e109564c2761fda34b6d9ea80",
              txHash: "0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
              txLink:
                "https://sepolia.basescan.org/tx/0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
            },
          },
        };
      },
    };
  };
}

test("ZeroTrustClient.decide calls the current MVP /actions endpoint", async () => {
  const requests = [];
  const client = new ZeroTrustClient({
    baseUrl: "http://control-plane.local",
    token: "test-token",
    fetchImpl: fakeFetch({ requests }),
  });

  const decision = await client.decide({
    actor: "demo-agent",
    action: "aws.ec2.terminate_instances",
    resource: "i-demo",
  });

  assert.equal(requests[0].url, "http://control-plane.local/actions");
  assert.equal(requests[0].options.headers.authorization, "Bearer test-token");
  assert.deepEqual(requests[0].body, {
    actor: "demo-agent",
    action: "aws.ec2.terminate_instances",
    resource: "i-demo",
  });
  assert.equal(decision.decision, "deny");
  assert.equal(decision.audit.kms_signature.algorithm, "ECDSA_SHA_256");
});

test("auditEvidence normalizes signed and DAAL fields from a decision", async () => {
  const client = new ZeroTrustClient({ fetchImpl: fakeFetch() });
  const decision = await client.decide({ action: "aws.ec2.terminate_instances" });

  assert.deepEqual(client.auditEvidence(decision), {
    previousHash: "0".repeat(64),
    currentHash: "a".repeat(64),
    signatureAlgorithm: "ECDSA_SHA_256",
    signatureKeyId: "test",
    daalStatus: "submitted",
    daalAttestationStatus: "verified",
    daalActionHash: "0xab1347c9b9c95234aafc00921c4610711150ef4e109564c2761fda34b6d9ea80",
    daalTransactionHash: "0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
    daalTransactionLink:
      "https://sepolia.basescan.org/tx/0x9bd34a4656075869f72f4a5a9fb016c4cb4c9cf0db19b27383e787192b6becf9",
  });
});

test("auditEvidence fails closed when audit evidence is missing", () => {
  const client = new ZeroTrustClient({ fetchImpl: fakeFetch() });

  assert.throws(() => client.auditEvidence({ decision: "deny" }), /audit evidence is required/);
});

test("guardedCall skips execution on deny", async () => {
  let called = false;
  const client = new ZeroTrustClient({ fetchImpl: fakeFetch({ decision: "deny" }) });

  const result = await client.guardedCall({
    action: "dangerous.action",
    fn: async () => {
      called = true;
      return "ran";
    },
  });

  assert.equal(called, false);
  assert.equal(result.executionSkipped, true);
});

test("guardedCall executes on allow", async () => {
  const client = new ZeroTrustClient({ fetchImpl: fakeFetch({ decision: "allow" }) });

  const result = await client.guardedCall({
    action: "safe.action",
    fn: async () => "ran",
  });

  assert.equal(result.executionSkipped, false);
  assert.equal(result.result, "ran");
});

test("helper methods preserve draft SDK ergonomics while targeting /actions", async () => {
  const requests = [];
  const client = new ZeroTrustClient({ actor: "adapter-agent", fetchImpl: fakeFetch({ requests }) });

  await client.langGraph({ action: "aws.ec2.terminate_instances", nodeName: "dangerous_node" });
  await client.openAIResponses({ action: "aws.ec2.terminate_instances", responseId: "resp_123" });
  await client.mcpToolCall({ toolName: "github.create_pull_request", resource: "octo/repo" });
  await client.a2aTask({ externalAgent: "github_agent", resource: "octo/repo" });

  assert.deepEqual(
    requests.map((request) => request.body),
    [
      { actor: "adapter-agent", action: "aws.ec2.terminate_instances", resource: "dangerous_node" },
      { actor: "adapter-agent", action: "aws.ec2.terminate_instances", resource: "resp_123" },
      { actor: "adapter-agent", action: "mcp.tool.github.create_pull_request", resource: "octo/repo" },
      { actor: "adapter-agent", action: "a2a.github_agent.send_message", resource: "octo/repo" },
    ],
  );
});
