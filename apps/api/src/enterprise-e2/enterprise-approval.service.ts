import { Injectable } from "@nestjs/common";
import { ApprovalRecord, ApprovalStatus } from "./enterprise-e2.types";

@Injectable()
export class EnterpriseApprovalService {
  private readonly records = new Map<string, ApprovalRecord>();

  request(input: { subject: string; requestedBy?: string }) {
    const now = new Date().toISOString();
    const record: ApprovalRecord = {
      id: `approval-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      subject: input.subject,
      status: "PENDING",
      requestedBy: input.requestedBy,
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return record;
  }

  decide(
    id: string,
    status: Exclude<ApprovalStatus, "PENDING">,
    approvedBy?: string,
    reason?: string,
  ) {
    const current = this.records.get(id);
    if (!current) throw new Error(`Approval record not found: ${id}`);

    const updated: ApprovalRecord = {
      ...current,
      status,
      approvedBy,
      reason,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);
    return updated;
  }

  list() {
    return [...this.records.values()];
  }
}
