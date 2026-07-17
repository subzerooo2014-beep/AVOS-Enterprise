
import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeApprovalRecord } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeApprovalService {
  private readonly records = new Map<string, KnowledgeApprovalRecord>();

  request(knowledgeId: string, requestedBy: string, reason?: string): KnowledgeApprovalRecord {
    const record: KnowledgeApprovalRecord = { id: randomUUID(), knowledgeId, requestedBy, status: "PENDING", reason, createdAt: new Date().toISOString() };
    this.records.set(record.id, record);
    return { ...record };
  }

  decide(id: string, approverId: string, approved: boolean, reason?: string): KnowledgeApprovalRecord {
    const current = this.records.get(id);
    if (!current) throw new NotFoundException(`Approval ${id} was not found.`);
    const updated: KnowledgeApprovalRecord = { ...current, approverId, status: approved ? "APPROVED" : "REJECTED", reason: reason ?? current.reason, decidedAt: new Date().toISOString() };
    this.records.set(id, updated);
    return { ...updated };
  }

  get(id: string): KnowledgeApprovalRecord | undefined {
    const record = this.records.get(id);
    return record ? { ...record } : undefined;
  }

  list(status?: KnowledgeApprovalRecord["status"]): KnowledgeApprovalRecord[] {
    return [...this.records.values()].filter((record) => !status || record.status === status).map((record) => ({ ...record }));
  }
}