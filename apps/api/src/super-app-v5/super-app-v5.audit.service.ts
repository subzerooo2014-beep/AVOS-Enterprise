import { Injectable } from "@nestjs/common";
import { AuditEntry } from "./super-app-v5.types";

@Injectable()
export class SuperAppV5AuditService {
  private readonly entries: AuditEntry[] = [];

  record(input: {
    action: string;
    entityType: string;
    entityId: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }): AuditEntry {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      correlationId: input.correlationId,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString(),
    };

    this.entries.push(entry);
    return entry;
  }

  list(): AuditEntry[] {
    return [...this.entries];
  }
}
