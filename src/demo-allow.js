import { ZeroTrustClient } from "./zero-trust-client.js";

const zt = new ZeroTrustClient();
const result = await zt.guardedCall({
  action: "hello-world.say_hello",
  resource: "local-demo",
  fn: async () => ({
    message: "Hello from a policy-approved adapter action.",
  }),
});

console.log(JSON.stringify(result, null, 2));
process.exit(result.decision === "allow" && result.executionSkipped === false ? 0 : 1);
