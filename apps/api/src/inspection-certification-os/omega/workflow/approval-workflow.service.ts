import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ApprovalRequest } from "./omega-workflow.types";

@Injectable()
export class ApprovalWorkflowService {
  private readonly approvals = new Map<string, ApprovalRequest>();

  request(input: {
    readonly workflowId: string;
    readonly requestedBy: string;
  }): ApprovalRequest {
    const approval: ApprovalRequest = {
      approvalId: `OMEGA-APPROVAL-${randomUUID()}`,
      workflowId: input.workflowId,
      requestedBy: input.requestedBy,
      requestedAt: new Date().toISOString(),
      decision: "pending",
      humanFinalAuthority: true,
    };

    this.approvals.set(approval.approvalId, approval);
    return approval;
  }

  decide(input: {
    readonly approvalId: string;
    readonly decision: "approved" | "rejected" | "changes-requested";
    readonly decidedBy: string;
    readonly reason: string;
  }): ApprovalRequest {
    const current = this.approvals.get(input.approvalId);

    if (!current) {
      throw new Error(`Approval request not found: ${input.approvalId}`);
    }

    if (current.decision !== "pending") {
      throw new Error("Approval request has already been decided.");
    }

    const updated: ApprovalRequest = {
      ...current,
      decision: input.decision,
      decidedBy: input.decidedBy,
      decidedAt: new Date().toISOString(),
      reason: input.reason,
      humanFinalAuthority: true,
    };

    this.approvals.set(updated.approvalId, updated);
    return updated;
  }

  get(approvalId: string): ApprovalRequest | null {
    return this.approvals.get(approvalId) ?? null;
  }

  all(): readonly ApprovalRequest[] {
    return [...this.approvals.values()];
  }
}
