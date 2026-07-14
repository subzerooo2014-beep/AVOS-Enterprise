import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceAuditService {
  private readonly records: Array<Record<string, unknown>> = [];
  record(action: string, entityId: string, metadata: Record<string, unknown> = {}) {
    const record = { id: `audit_${Date.now()}`, action, entityId, metadata, createdAt: new Date().toISOString() };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
