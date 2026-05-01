#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${MOCK_CONTROL_PLANE_PORT:-3000}"
BASE_URL="http://127.0.0.1:${PORT}"

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

printf "Zero Trust Hello World Adapter demo\n"
printf "===================================\n"
printf "Goal: block an unsafe agent action, then authorize and run a safe Hello World action.\n"

printf "\n$ npm run zt:mock\n"
MOCK_CONTROL_PLANE_PORT="${PORT}" npm run zt:mock > /tmp/zt-adapter-mock-control-plane.log 2>&1 &
CONTROL_PLANE_PID="$!"

for _ in $(seq 1 30); do
  if curl -fsS "${BASE_URL}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

printf "mock control plane is listening at %s\n" "${BASE_URL}"

run npm test

post_json "/agents" '{"actor":"hello-world-agent"}'

printf "\n\nAttempt unauthorized execution. This must be blocked.\n"
run npm run demo:deny

printf "\nApply policy for the safe Hello World action.\n"
post_json "/policies/allow" '{"action":"hello-world.say_hello","reason":"Quickstart policy allows hello world."}'

printf "\n\nExecute authorized Hello World action.\n"
run npm run demo:allow

printf "\nDemo complete: unsafe action was denied; safe action was authorized and executed.\n"
