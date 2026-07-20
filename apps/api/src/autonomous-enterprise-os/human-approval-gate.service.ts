import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class HumanApprovalGateService {
  private readonly requests = new Map<string, Record<string, unknown>>();

  request(input: {
    action: string;
    reason: string;
    requestedBy: string;
    payload?: unknown;
  }) {
    const request = {
      id: "aeos-approval:" + randomUUID(),
      action: input.action,
      reason: input.reason,
      requestedBy: input.requestedBy,
      payload: input.payload ?? {},
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    this.requests.set(String(request.id), request);
    return request;
  }

  decide(id: string, decision: "approved" | "rejected", decidedBy: string) {
    if (!decidedBy.startsWith("human:")) {
      throw new Error("Approval decisions require Human Final Authority.");
    }

    const request = this.requests.get(id);
    if (!request) throw new Error("Approval request not found: " + id);

    const updated = {
      ...request,
      status: decision,
      decidedBy,
      decidedAt: new Date().toISOString(),
    };

    this.requests.set(id, updated);
    return updated;
  }

  get(id: string) {
    const request = this.requests.get(id);
    if (!request) throw new Error("Approval request not found: " + id);
    return request;
  }

  list() {
    return [...this.requests.values()];
  }
}