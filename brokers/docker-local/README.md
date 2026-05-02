# Docker Local Execution Broker

This broker demonstrates the Execution Broker contract without requiring cloud credentials.

The broker asks the Zero Trust Control Plane for a decision before it starts a local Docker container. If policy returns `deny`, Docker is not invoked.

## Security Defaults

The default Docker command uses:

- `--network none`
- `--read-only`
- `--cap-drop ALL`
- `--security-opt no-new-privileges`
- `--rm`

These defaults are intentionally conservative for a starter example. They do not make Docker a complete production sandbox.

## Usage

```js
import { DockerLocalBroker } from "./brokers/docker-local/index.js";

const broker = new DockerLocalBroker();

const result = await broker.run({
  actor: "hello-world-agent",
  action: "hello-world.say_hello",
  resource: "docker-local-demo",
  image: "node:20-alpine",
  command: ["node", "-e", "console.log('hello from broker')"],
});

console.log(result);
```

## Policy

Minimum allow rule:

```json
{
  "id": "allow-docker-local-hello-world",
  "effect": "allow",
  "subjects": {
    "actors": ["hello-world-agent"]
  },
  "actions": ["hello-world.say_hello"],
  "resources": {
    "ids": ["docker-local-demo"]
  },
  "conditions": {
    "broker": "docker-local",
    "network": "none"
  }
}
```

Dangerous actions should remain denied by default:

```json
{
  "id": "deny-docker-infra-destruction",
  "effect": "deny",
  "actions": ["aws.ec2.terminate_instances"],
  "reason": "Infrastructure changes require a production broker and human approval."
}
```

