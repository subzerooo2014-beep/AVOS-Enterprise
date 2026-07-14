import { Injectable } from "@nestjs/common";
@Injectable()
export class AnalyticsAuditService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(action: string, entityId: string) {
    const record = { id: `analytics_audit_${Date.now()}`, action, entityId, createdAt: new Date().toISOString() };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
