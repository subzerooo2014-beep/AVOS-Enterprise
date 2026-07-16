import { Injectable, NotFoundException } from "@nestjs/common";
import type { DecisionApprovalV2 } from "./enterprise-decision-intelligence-v2.types";

@Injectable()
export class DecisionApprovalWorkflowV2Service {
  private readonly approvals = new Map<string, DecisionApprovalV2>();

  request(decisionId: string, approver: string): DecisionApprovalV2 {
    const approval: DecisionApprovalV2 = {
      id: `decision-approval-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      decisionId,
      approver,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  approve(id: string, reason?: string): DecisionApprovalV2 {
    const approval = this.requireApproval(id);
    approval.status = "APPROVED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();
    return { ...approval };
  }

  reject(id: string, reason?: string): DecisionApprovalV2 {
    const approval = this.requireApproval(id);
    approval.status = "REJECTED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();
    return { ...approval };
  }

  list(): DecisionApprovalV2[] {
    return Array.from(this.approvals.values()).map((item) => ({ ...item }));
  }

  pendingCount(): number {
    return this.list().filter((item) => item.status === "PENDING").length;
  }

  private requireApproval(id: string): DecisionApprovalV2 {
    const approval = this.approvals.get(id);
    if (!approval) {
      throw new NotFoundException(`Decision approval '${id}' was not found.`);
    }
    return approval;
  }
}
