export class ZeroTrustAdapterError extends Error {}

export async function checkAction({
  actor = process.env.ZT_ACTOR || "hello-world-agent",
  action,
  resource = "",
  controlPlaneUrl = process.env.ZT_CONTROL_PLANE_URL || "http://127.0.0.1:3000",
  fetchImpl = globalThis.fetch,
}) {
  if (!action) {
    throw new ZeroTrustAdapterError("action is required");
  }
  if (!fetchImpl) {
    throw new ZeroTrustAdapterError("fetch is required; use Node 20 or provide fetchImpl");
  }

  const response = await fetchImpl(`${controlPlaneUrl.replace(/\/$/, "")}/actions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ actor, action, resource }),
  });

  const body = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    decision: body.decision,
    reason: body.reason,
    audit: body.audit,
    raw: body,
  };
}
