import { Injectable } from "@nestjs/common";
import type { AuditRecord } from "./zero-trust-security.types";

@Injectable()
export class AuditCenterService {
  private readonly records: AuditRecord[] = [];

  record(
    actor: string,
    action: string,
    resource: string,
    outcome: string,
    metadata: Record<string, unknown> = {},
  ): AuditRecord {
    const record: AuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      actor,
      action,
      resource,
      outcome,
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    if (this.records.length > 5000) this.records.length = 5000;

    return this.clone(record);
  }

  list(actor?: string): AuditRecord[] {
    return this.records
      .filter((record) => (actor ? record.actor === actor : true))
      .map((record) => this.clone(record));
  }

  count(): number {
    return this.records.length;
  }

  private clone(record: AuditRecord): AuditRecord {
    return { ...record, metadata: { ...record.metadata } };
  }
}
