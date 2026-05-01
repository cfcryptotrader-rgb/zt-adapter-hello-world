import { checkAction } from "./adapter.js";

const decision = await checkAction({
  action: "aws.ec2.terminate_instances",
  resource: "i-demo",
});

console.log(JSON.stringify(decision, null, 2));
process.exit(decision.decision === "deny" ? 0 : 1);
