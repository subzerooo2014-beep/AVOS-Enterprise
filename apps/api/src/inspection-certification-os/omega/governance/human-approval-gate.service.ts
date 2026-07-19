import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

export interface ApprovalRequest {
  readonly requestId: string;
  readonly subjectId: string;
  readonly requestedAt: string;
  readonly status: "pending" | "approved" | "rejected";
  readonly decidedAt?: string;
  readonly decidedBy?: string;
}

@Injectable()
export class HumanApprovalGateService {
  private readonly requests = new Map<string, ApprovalRequest>();

  request(subjectId: string): ApprovalRequest {
    const request: ApprovalRequest = {
      requestId: `OMEGA-APPROVAL-${randomUUID()}`,
      subjectId,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    this.requests.set(request.requestId, request);
    return request;
  }

  decide(input: {
    readonly requestId: string;
    readonly approved: boolean;
    readonly decidedBy: string;
  }): ApprovalRequest {
    const current = this.requests.get(input.requestId);

    if (!current) {
      throw new Error(`Approval request not found: ${input.requestId}`);
    }

    const updated: ApprovalRequest = {
      ...current,
      status: input.approved ? "approved" : "rejected",
      decidedAt: new Date().toISOString(),
      decidedBy: input.decidedBy,
    };

    this.requests.set(input.requestId, updated);
    return updated;
  }

  all(): readonly ApprovalRequest[] {
    return [...this.requests.values()];
  }
}

