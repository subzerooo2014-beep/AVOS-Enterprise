import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionAuditService {
  private readonly entries: Array<Record<string, unknown>> = [];
  record(action: string, auctionId: string, metadata: Record<string, unknown> = {}) {
    const entry = { id: `audit_${Date.now()}`, action, auctionId, metadata, createdAt: new Date().toISOString() };
    this.entries.push(entry);
    return entry;
  }
  list() { return [...this.entries]; }
}
