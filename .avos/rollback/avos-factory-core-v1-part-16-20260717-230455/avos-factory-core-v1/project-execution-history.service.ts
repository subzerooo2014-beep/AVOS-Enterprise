import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ProjectExecutionHistoryRecord
} from "./project-execution.contracts";

@Injectable()
export class ProjectExecutionHistoryService {
  private readonly records: ProjectExecutionHistoryRecord[] = [];

  record(
    entry: Omit<ProjectExecutionHistoryRecord, "id" | "timestamp">
  ): ProjectExecutionHistoryRecord {
    const record: ProjectExecutionHistoryRecord = {
      ...structuredClone(entry),
      id: randomUUID(),
      timestamp: new Date().toISOString()
    };

    this.records.unshift(record);
    return structuredClone(record);
  }

  list(limit = 100): ProjectExecutionHistoryRecord[] {
    return this.records
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((record) => structuredClone(record));
  }

  listByProject(projectId: string): ProjectExecutionHistoryRecord[] {
    return this.records
      .filter((record) => record.projectId === projectId)
      .map((record) => structuredClone(record));
  }

  listByTransaction(transactionId: string): ProjectExecutionHistoryRecord[] {
    return this.records
      .filter((record) => record.transactionId === transactionId)
      .map((record) => structuredClone(record));
  }

  count(): number {
    return this.records.length;
  }
}
