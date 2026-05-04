export class ZeroTrustClientError extends Error {}

export class ZeroTrustClient {
  constructor({
    baseUrl = process.env.ZT_CONTROL_PLANE_URL || "http://127.0.0.1:3000",
    token = process.env.ZT_TOKEN || "",
    actor = process.env.ZT_ACTOR || "hello-world-agent",
    fetchImpl = globalThis.fetch,
  } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.actor = actor;
    this.fetchImpl = fetchImpl;
  }

  async decide({ actor = this.actor, action, resource = "" }) {
    if (!action) {
      throw new ZeroTrustClientError("action is required");
    }
    if (!this.fetchImpl) {
      throw new ZeroTrustClientError("fetch is required; use Node 20 or provide fetchImpl");
    }

    const headers = {
      "content-type": "application/json",
      accept: "application/json",
    };
    if (this.token) {
      headers.authorization = `Bearer ${this.token}`;
    }

    const response = await this.fetchImpl(`${this.baseUrl}/actions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ actor, action, resource }),
    });
    const body = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      actor: body.actor || actor,
      action: body.action || action,
      resource: body.resource || resource,
      decision: body.decision,
      reason: body.reason,
      audit: body.audit,
      raw: body,
    };
  }

  async guardedCall({ actor = this.actor, action, resource = "", fn }) {
    if (typeof fn !== "function") {
      throw new ZeroTrustClientError("fn is required");
    }

    const decision = await this.decide({ actor, action, resource });
    if (decision.decision !== "allow") {
      return {
        ...decision,
        executionSkipped: true,
      };
    }

    return {
      ...decision,
      executionSkipped: false,
      result: await fn(),
    };
  }

  langGraph({ actor = this.actor, action, nodeName = "", resource = "" }) {
    return this.decide({
      actor,
      action,
      resource: resource || nodeName,
    });
  }

  openAIResponses({ actor = this.actor, action, responseId = "", resource = "" }) {
    return this.decide({
      actor,
      action,
      resource: resource || responseId,
    });
  }

  mcpToolCall({ actor = this.actor, toolName, action, resource = "" }) {
    return this.decide({
      actor,
      action: action || `mcp.tool.${safeSegment(toolName || "unknown")}`,
      resource,
    });
  }

  a2aTask({ actor = this.actor, externalAgent, action, resource = "" }) {
    return this.decide({
      actor,
      action: action || `a2a.${safeSegment(externalAgent || "external_agent")}.send_message`,
      resource,
    });
  }

  auditEvidence(decision) {
    const audit = decision?.audit;
    if (!audit) {
      throw new ZeroTrustClientError("audit evidence is required");
    }

    const daal = audit.daal || {};
    return {
      previousHash: audit.previous_hash || "",
      currentHash: audit.current_hash || "",
      signatureAlgorithm: audit.kms_signature?.algorithm || "",
      signatureKeyId: audit.kms_signature?.key_id || "",
      daalStatus: daal.status || "",
      daalAttestationStatus: daal.attestation_status || "",
      daalActionHash: daal.actionHash || "",
      daalTransactionHash: daal.blockchain_tx_hash || daal.txHash || "",
      daalTransactionLink: daal.txLink || "",
    };
  }
}

function safeSegment(value) {
  return String(value).trim().replace(/[^A-Za-z0-9_.-]+/g, "_").replace(/^[_\-.]+|[_\-.]+$/g, "") || "unknown";
}
