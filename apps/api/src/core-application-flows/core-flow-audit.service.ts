import { Injectable } from "@nestjs/common";
import type { CoreFlowAuditEntry } from "./core-flow-operations.types";

@Injectable()
export class CoreFlowAuditService {
  private readonly entries: CoreFlowAuditEntry[] = [];

  write(operationId: string, action: string, metadata: Record<string, unknown> = {}, actor = "system") {
    const entry: CoreFlowAuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      operationId,
      action,
      actor,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  findAll(operationId?: string) {
    return this.entries
      .filter((entry) => !operationId || entry.operationId === operationId)
      .slice()
      .reverse();
  }

  stats() {
    return {
      totalEntries: this.entries.length,
      operations: new Set(this.entries.map((entry) => entry.operationId)).size,
      generatedAt: new Date().toISOString(),
    };
  }
}
