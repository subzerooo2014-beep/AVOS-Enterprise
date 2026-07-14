import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentAuditService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(action: string, provider: string, entityId: string, metadata: Record<string, unknown> = {}) {
    const item = {
      id: `gov_audit_${Date.now()}`,
      action,
      provider,
      entityId,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.records.push(item);
    return item;
  }
  list() { return [...this.records]; }
}
