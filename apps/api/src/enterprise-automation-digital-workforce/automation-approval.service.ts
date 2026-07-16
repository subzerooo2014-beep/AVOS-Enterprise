import { Injectable, NotFoundException } from "@nestjs/common";
import type { AutomationApprovalRecord } from "./enterprise-automation-digital-workforce.types";

@Injectable()
export class AutomationApprovalService {
  private readonly approvals = new Map<string, AutomationApprovalRecord>();

  request(jobId: string, approver: string): AutomationApprovalRecord {
    const approval: AutomationApprovalRecord = {
      id: `automation-approval-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      jobId,
      approver,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  approve(id: string, reason?: string): AutomationApprovalRecord {
    const approval = this.requireApproval(id);
    approval.status = "APPROVED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();
    return { ...approval };
  }

  reject(id: string, reason?: string): AutomationApprovalRecord {
    const approval = this.requireApproval(id);
    approval.status = "REJECTED";
    approval.reason = reason;
    approval.decidedAt = new Date().toISOString();
    return { ...approval };
  }

  byJob(jobId: string): AutomationApprovalRecord[] {
    return this.list().filter((approval) => approval.jobId === jobId);
  }

  list(): AutomationApprovalRecord[] {
    return Array.from(this.approvals.values()).map((approval) => ({
      ...approval,
    }));
  }

  pendingCount(): number {
    return this.list().filter((approval) => approval.status === "PENDING")
      .length;
  }

  private requireApproval(id: string): AutomationApprovalRecord {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new NotFoundException(`Automation approval '${id}' was not found.`);
    }

    return approval;
  }
}
