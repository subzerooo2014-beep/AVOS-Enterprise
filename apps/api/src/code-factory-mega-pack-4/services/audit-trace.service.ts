import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { AuditRecord } from "../types/persistence.types";

@Injectable()
export class AuditTraceService {
  constructor(private readonly repository: PersistentFactoryRepository) {}

  async record(
    action: string,
    payload: Record<string, unknown>,
    workspaceId?: string,
    actor = "system:code-factory",
    traceId = randomUUID()
  ): Promise<AuditRecord> {
    const record: AuditRecord = {
      id: `audit:${Date.now()}:${randomUUID()}`,
      workspaceId,
      action,
      actor,
      traceId,
      payload,
      createdAt: new Date().toISOString()
    };

    await this.repository.saveAudit(record);
    return record;
  }
}