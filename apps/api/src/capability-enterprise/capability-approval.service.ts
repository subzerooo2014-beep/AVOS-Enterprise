import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityApprovalRequest } from "./capability-enterprise.types";

@Injectable()
export class CapabilityApprovalService {
  private readonly requests = new Map<string, CapabilityApprovalRequest>();

  request(input: {
    capabilityKey: string;
    requestedBy: string;
    requestedAction: CapabilityApprovalRequest["requestedAction"];
    justification: string;
  }) {
    const request: CapabilityApprovalRequest = {
      id: randomUUID(),
      capabilityKey: input.capabilityKey.toLowerCase(),
      requestedBy: input.requestedBy,
      requestedAction: input.requestedAction,
      justification: input.justification,
      status: "PENDING",
      requestedAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);
    return { success: true, request: structuredClone(request) };
  }

  decide(
    requestId: string,
    input: {
      status: "APPROVED" | "REJECTED";
      decidedBy: string;
      decisionReason: string;
    },
  ) {
    const request = this.require(requestId);
    if (request.status !== "PENDING") {
      return { success: false, reason: "APPROVAL_ALREADY_DECIDED" };
    }

    request.status = input.status;
    request.decidedBy = input.decidedBy;
    request.decisionReason = input.decisionReason;
    request.decidedAt = new Date().toISOString();

    return { success: true, request: structuredClone(request) };
  }

  get(requestId: string) {
    const request = this.requests.get(requestId);
    return request ? structuredClone(request) : null;
  }

  list() {
    return [...this.requests.values()].map((request) =>
      structuredClone(request),
    );
  }

  isApproved(
    capabilityKey: string,
    action: CapabilityApprovalRequest["requestedAction"],
  ) {
    return [...this.requests.values()].some(
      (request) =>
        request.capabilityKey === capabilityKey.toLowerCase() &&
        request.requestedAction === action &&
        request.status === "APPROVED",
    );
  }

  private require(requestId: string) {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Approval request not found: ${requestId}`);
    return request;
  }
}