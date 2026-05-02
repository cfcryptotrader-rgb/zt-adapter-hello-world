import { spawn } from "node:child_process";

import { ZeroTrustClient } from "../../src/zero-trust-client.js";

const DEFAULT_NONO_BIN = "/usr/local/bin/nono";

export class NonoCliBroker {
  constructor({
    client = new ZeroTrustClient(),
    runner = defaultRunner,
    nonoBin = process.env.NONO_BIN || DEFAULT_NONO_BIN,
    actor,
  } = {}) {
    this.client = client;
    this.runner = runner;
    this.nonoBin = nonoBin;
    this.actor = actor;
  }

  async run({
    actor = this.actor,
    action = "broker.nono.spawn_agent",
    resource = "nono-cli",
    command = ["node", "-e", "console.log('Hello from a policy-approved Nono sandbox action.')"],
    permissions = {},
    sessionName = "zt-nono-agent",
  } = {}) {
    const decision = await this.client.guardedCall({
      actor,
      action,
      resource,
      fn: async () => {
        const args = buildNonoRunArgs({ command, permissions, sessionName });
        return this.runner(this.nonoBin, args);
      },
    });

    return {
      broker: "nono-cli",
      command,
      permissions: normalizePermissions(permissions),
      ...decision,
    };
  }
}

export function buildNonoRunArgs({ command, permissions = {}, sessionName = "zt-nono-agent" } = {}) {
  validateCommand(command);
  const normalized = normalizePermissions(permissions);
  const args = ["--silent", "run", "--name", validateFlagValue(sessionName, "sessionName")];

  appendRepeated(args, "--allow", normalized.allow);
  appendRepeated(args, "--read", normalized.read);
  appendRepeated(args, "--write", normalized.write);
  appendRepeated(args, "--allow-file", normalized.allowFile);
  appendRepeated(args, "--read-file", normalized.readFile);
  appendRepeated(args, "--write-file", normalized.writeFile);
  appendRepeated(args, "--allow-domain", normalized.allowDomain);
  appendRepeated(args, "--listen-port", normalized.listenPort);
  appendRepeated(args, "--open-port", normalized.openPort);

  if (normalized.profile) {
    args.push("--profile", normalized.profile);
  }
  if (normalized.workdir) {
    args.push("--workdir", normalized.workdir);
  }
  if (normalized.networkProfile) {
    args.push("--network-profile", normalized.networkProfile);
  }
  if (normalized.allowCwd) {
    args.push("--allow-cwd");
  }
  if (normalized.blockNet) {
    args.push("--block-net");
  }
  if (normalized.rollback) {
    args.push("--rollback", "--no-rollback-prompt");
  }
  if (normalized.auditIntegrity) {
    args.push("--audit-integrity");
  }
  if (normalized.dryRun) {
    args.push("--dry-run");
  }

  args.push("--", ...command.map((part) => String(part)));
  return args;
}

export function normalizePermissions(permissions = {}) {
  const normalized = {
    allow: normalizeStringArray(permissions.allow, "allow"),
    read: normalizeStringArray(permissions.read, "read"),
    write: normalizeStringArray(permissions.write, "write"),
    allowFile: normalizeStringArray(permissions.allowFile, "allowFile"),
    readFile: normalizeStringArray(permissions.readFile, "readFile"),
    writeFile: normalizeStringArray(permissions.writeFile, "writeFile"),
    allowDomain: normalizeDomainArray(permissions.allowDomain, "allowDomain"),
    listenPort: normalizePortArray(permissions.listenPort, "listenPort"),
    openPort: normalizePortArray(permissions.openPort, "openPort"),
    profile: optionalFlagValue(permissions.profile, "profile"),
    workdir: optionalFlagValue(permissions.workdir, "workdir"),
    networkProfile: optionalFlagValue(permissions.networkProfile, "networkProfile"),
    allowCwd: permissions.allowCwd !== false,
    blockNet: permissions.blockNet !== false,
    rollback: permissions.rollback === true,
    auditIntegrity: permissions.auditIntegrity === true,
    dryRun: permissions.dryRun === true,
  };

  if (normalized.blockNet && (normalized.allowDomain.length > 0 || normalized.networkProfile)) {
    throw new Error("blockNet cannot be combined with allowDomain or networkProfile");
  }

  return normalized;
}

function appendRepeated(args, flag, values) {
  for (const value of values) {
    args.push(flag, value);
  }
}

function validateCommand(command) {
  if (!Array.isArray(command) || command.length === 0) {
    throw new Error("command must be a non-empty array");
  }
  for (const part of command) {
    validateFlagValue(String(part), "command");
  }
}

function normalizeStringArray(value, field) {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  return value.map((item) => validateFlagValue(item, field));
}

function normalizeDomainArray(value, field) {
  return normalizeStringArray(value, field).map((item) => {
    if (!/^[A-Za-z0-9.-]+$/.test(item)) {
      throw new Error(`invalid domain in ${field}: ${item}`);
    }
    return item;
  });
}

function normalizePortArray(value, field) {
  return normalizeStringArray(value, field).map((item) => {
    if (!/^[0-9]+$/.test(item)) {
      throw new Error(`invalid port in ${field}: ${item}`);
    }
    const port = Number(item);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`invalid port in ${field}: ${item}`);
    }
    return String(port);
  });
}

function optionalFlagValue(value, field) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return validateFlagValue(value, field);
}

function validateFlagValue(value, field) {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`${field} must contain strings or numbers`);
  }
  const stringValue = String(value);
  if (stringValue.trim() === "" || /[\0\r\n]/.test(stringValue)) {
    throw new Error(`invalid value in ${field}`);
  }
  return stringValue;
}

function defaultRunner(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
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
      const error = new Error(`nono exited with status ${code}`);
      error.result = result;
      reject(error);
    });
  });
}
