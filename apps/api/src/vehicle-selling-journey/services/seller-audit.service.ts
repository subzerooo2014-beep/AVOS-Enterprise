import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerAuditService {
  private readonly entries: Array<Record<string, unknown>> = [];
  record(action: string, journeyId: string, metadata: Record<string, unknown> = {}) {
    const entry = { id: `audit_${Date.now()}`, action, journeyId, metadata, createdAt: new Date().toISOString() };
    this.entries.push(entry);
    return entry;
  }
  list() { return [...this.entries]; }
}
