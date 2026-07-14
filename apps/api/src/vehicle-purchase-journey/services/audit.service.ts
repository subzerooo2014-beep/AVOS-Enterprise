import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyAuditService {
  private readonly entries: any[] = [];
  record(action: string, journeyId: string, metadata: Record<string, unknown> = {}) {
    const entry = { id: `audit_${Date.now()}`, action, journeyId, metadata, createdAt: new Date().toISOString() };
    this.entries.push(entry);
    return entry;
  }
  list() { return [...this.entries]; }
}
