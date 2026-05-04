# Nono CLI Execution Broker

This broker wraps the `nono` CLI so the Zero Trust Control Plane can approve or deny an agent action before a sandboxed process is spawned.

Flow:

```text
agent request -> ZT Control Plane /actions -> allow -> nono run -> sandboxed agent command
agent request -> ZT Control Plane /actions -> deny  -> skip execution
```

## Requirements

- `nono` available on `PATH`, or set `NONO_BIN` to an approved local executable path.
- Node.js 20 or newer.
- A reachable ZT-Infra Control Plane or the local mock from this repository.

Nono documentation:

- usage overview: <https://docs.nono.sh/usage>
- CLI flags: <https://docs.nono.sh/usage/flags>
- product site: <https://nono.sh/>

## Example

```js
import { NonoCliBroker } from "zt-adapter-hello-world/brokers/nono-cli";

const broker = new NonoCliBroker({
  actor: "demo-agent",
});

const result = await broker.run({
  action: "broker.nono.spawn_agent",
  resource: "repo/example",
  command: ["node", "-e", "console.log('sandboxed work')"],
  permissions: {
    read: ["./src"],
    write: ["./tmp"],
    blockNet: true,
    auditIntegrity: true,
    rollback: true,
  },
});

console.log(result);
```

The broker executes only when the control plane returns `decision: "allow"`.

## Permission Mapping

| Broker field | Nono flag | Meaning |
| --- | --- | --- |
| `permissions.allow` | `--allow` | Recursive read/write directory access. |
| `permissions.read` | `--read` | Recursive read-only directory access. |
| `permissions.write` | `--write` | Recursive write-only directory access. |
| `permissions.allowFile` | `--allow-file` | Read/write access to one file. |
| `permissions.readFile` | `--read-file` | Read-only access to one file. |
| `permissions.writeFile` | `--write-file` | Write-only access to one file. |
| `permissions.blockNet` | `--block-net` | Block outbound network access. Defaults to `true`. |
| `permissions.allowDomain` | `--allow-domain` | Allow listed domains. Cannot be combined with `blockNet: true`. |
| `permissions.networkProfile` | `--network-profile` | Use a named network profile. Cannot be combined with `blockNet: true`. |
| `permissions.listenPort` | `--listen-port` | Allow listening on specific TCP ports. |
| `permissions.openPort` | `--open-port` | Allow bidirectional localhost TCP on specific ports. |
| `permissions.profile` | `--profile` | Use a named Nono profile. |
| `permissions.workdir` | `--workdir` | Working directory for profile expansion. |
| `permissions.allowCwd` | `--allow-cwd` | Allow current working directory access in non-interactive runs. Defaults to `true`. |
| `permissions.rollback` | `--rollback --no-rollback-prompt` | Enable rollback snapshots without interactive prompt. |
| `permissions.auditIntegrity` | `--audit-integrity` | Add filesystem-state hashing over writable paths. |
| `permissions.dryRun` | `--dry-run` | Show capabilities without executing. |

## Policy Example

```json
{
  "actor": "demo-agent",
  "action": "broker.nono.spawn_agent",
  "resource": "repo/example"
}
```

The ZT-Infra dashboard should grant the actor only the specific action/resource pair needed for the sandboxed job. The broker then converts the approved job's capability manifest into Nono CLI flags.

## Safety Notes

- Network is blocked by default.
- Current working directory access is enabled by default because Nono requires an explicit `--allow-cwd` decision in non-interactive runs. Pair it with narrow `read`, `write`, `allow`, or `profile` settings for production jobs.
- The broker validates flag values and rejects newlines, empty values, invalid ports, and invalid domains.
- `allowDomain` and `networkProfile` require `blockNet: false` because Nono treats full network blocking and network allowlisting as separate modes.
- Do not pass secrets as command arguments. Use Nono credential features or a production secret manager.
