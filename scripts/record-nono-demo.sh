#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${MOCK_CONTROL_PLANE_PORT:-3001}"
BASE_URL="http://127.0.0.1:${PORT}"
NONO_BIN="${NONO_BIN:-/usr/local/bin/nono}"

cd "${ROOT_DIR}"

CONTROL_PLANE_PID=""
cleanup() {
  if [ -n "${CONTROL_PLANE_PID}" ] && kill -0 "${CONTROL_PLANE_PID}" 2>/dev/null; then
    kill "${CONTROL_PLANE_PID}" 2>/dev/null || true
    wait "${CONTROL_PLANE_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

run() {
  printf "\n$ %s\n" "$*"
  "$@"
}

post_json() {
  local path="$1"
  local payload="$2"
  printf "\n$ curl -sS -X POST %s%s -H 'content-type: application/json' -d '%s'\n" "${BASE_URL}" "${path}" "${payload}"
  curl -sS -X POST "${BASE_URL}${path}" \
    -H 'content-type: application/json' \
    -d "${payload}"
}

printf "Zero Trust Nono Execution Broker demo\n"
printf "=====================================\n"
printf "Goal: deny a sandbox spawn request, then approve the same action and launch it through nono.\n"

run "${NONO_BIN}" --version

printf "\n$ npm run zt:mock\n"
MOCK_CONTROL_PLANE_PORT="${PORT}" npm run zt:mock > /tmp/zt-adapter-nono-mock-control-plane.log 2>&1 &
CONTROL_PLANE_PID="$!"

for _ in $(seq 1 30); do
  if curl -fsS "${BASE_URL}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

printf "mock control plane is listening at %s\n" "${BASE_URL}"

post_json "/agents" '{"actor":"demo-agent"}'

printf "\n\nAttempt to spawn a sandboxed agent before policy allows it. This must be blocked.\n"
run env ZT_CONTROL_PLANE_URL="${BASE_URL}" ZT_ACTOR="demo-agent" NONO_BIN="${NONO_BIN}" npm run demo:nono:deny

printf "\nApply policy for the Nono sandbox broker action.\n"
post_json "/policies/allow" '{"action":"broker.nono.spawn_agent","reason":"Policy allows this actor to spawn the demo Nono sandbox."}'

printf "\n\nSpawn the approved sandbox through Nono with network blocked.\n"
run env ZT_CONTROL_PLANE_URL="${BASE_URL}" ZT_ACTOR="demo-agent" NONO_BIN="${NONO_BIN}" npm run demo:nono:allow

printf "\nDemo complete: the broker skipped Nono on deny, then invoked Nono only after policy returned allow.\n"
