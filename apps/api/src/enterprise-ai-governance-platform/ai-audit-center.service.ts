import { Injectable } from "@nestjs/common";
import type { AiAuditRecord } from "./enterprise-ai-governance.types";

@Injectable()
export class AiAuditCenterService {
  private readonly records: AiAuditRecord[] = [];

  record(
    actor: string,
    action: string,
    targetType: string,
    targetId: string,
    outcome: string,
    metadata: Record<string, unknown> = {},
  ): AiAuditRecord {
    const record: AiAuditRecord = {
      id: `ai-audit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      actor,
      action,
      targetType,
      targetId,
      outcome,
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);

    if (this.records.length > 10000) {
      this.records.length = 10000;
    }

    return this.clone(record);
  }

  list(actor?: string): AiAuditRecord[] {
    return this.records
      .filter((record) => (actor ? record.actor === actor : true))
      .map((record) => this.clone(record));
  }

  count(): number {
    return this.records.length;
  }

  private clone(record: AiAuditRecord): AiAuditRecord {
    return {
      ...record,
      metadata: { ...record.metadata },
    };
  }
}
