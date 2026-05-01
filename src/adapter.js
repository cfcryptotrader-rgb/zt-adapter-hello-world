import { ZeroTrustClient, ZeroTrustClientError } from "./zero-trust-client.js";

export class ZeroTrustAdapterError extends ZeroTrustClientError {}

export async function checkAction(options) {
  const client = new ZeroTrustClient({
    baseUrl: options.controlPlaneUrl,
    token: options.token,
    fetchImpl: options.fetchImpl,
  });
  return client.decide({
    actor: options.actor,
    action: options.action,
    resource: options.resource,
  });
}
