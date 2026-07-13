import { Injectable } from "@nestjs/common";
import { ExecutionRecord } from "./enterprise-e2.types";

@Injectable()
export class EnterpriseExecutionHistoryService {
  private readonly records = new Map<string, ExecutionRecord>();

  start(operation: string, payload: Record<string, unknown>) {
    const now = new Date().toISOString();
    const record: ExecutionRecord = {
      id: `execution-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      operation,
      status: "STARTED",
      payload,
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return record;
  }

  complete(id: string, result: Record<string, unknown>) {
    return this.update(id, { status: "COMPLETED", result });
  }

  fail(id: string, error: string) {
    return this.update(id, { status: "FAILED", error });
  }

  list() {
    return [...this.records.values()];
  }

  private update(id: string, patch: Partial<ExecutionRecord>) {
    const current = this.records.get(id);
    if (!current) throw new Error(`Execution record not found: ${id}`);

    const updated: ExecutionRecord = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);
    return updated;
  }
}
