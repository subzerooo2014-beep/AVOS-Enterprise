import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetAuditService {
  private readonly entries: Array<Record<string, unknown>> = [];
  record(action: string, entityId: string, metadata: Record<string, unknown> = {}) {
    const entry = { id: `audit_${Date.now()}`, action, entityId, metadata, createdAt: new Date().toISOString() };
    this.entries.push(entry);
    return entry;
  }
  list() { return [...this.entries]; }
}
