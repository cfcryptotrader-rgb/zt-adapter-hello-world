import { spawn } from "node:child_process";

import { ZeroTrustClient } from "../../src/zero-trust-client.js";

export class DockerLocalBroker {
  constructor({
    client = new ZeroTrustClient(),
    runner = defaultRunner,
    defaultImage = "node:20-alpine",
    actor,
  } = {}) {
    this.client = client;
    this.runner = runner;
    this.defaultImage = defaultImage;
    this.actor = actor;
  }

  async run({
    actor = this.actor,
    action = "broker.docker.run",
    resource = "docker-local",
    image = this.defaultImage,
    command = ["node", "-e", "console.log('Hello from a policy-approved Docker broker action.')"],
    env = {},
    network = "none",
  } = {}) {
    const decision = await this.client.guardedCall({
      actor,
      action,
      resource,
      fn: async () => {
        const args = buildDockerRunArgs({ image, command, env, network });
        return this.runner("docker", args);
      },
    });

    return {
      broker: "docker-local",
      image,
      command,
      network,
      ...decision,
    };
  }
}

export function buildDockerRunArgs({ image, command, env = {}, network = "none" }) {
  if (!image || typeof image !== "string") {
    throw new Error("image is required");
  }
  if (!Array.isArray(command) || command.length === 0) {
    throw new Error("command must be a non-empty array");
  }

  const args = ["run", "--rm", "--network", network, "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges"];

  for (const [key, value] of Object.entries(env)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(`invalid environment variable name: ${key}`);
    }
    args.push("-e", `${key}=${value}`);
  }

  args.push(image, ...command.map((part) => String(part)));
  return args;
}

function defaultRunner(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const result = { command, args, exitCode: code, stdout, stderr };
      if (code === 0) {
        resolve(result);
        return;
      }
      const error = new Error(`docker exited with status ${code}`);
      error.result = result;
      reject(error);
    });
  });
}

