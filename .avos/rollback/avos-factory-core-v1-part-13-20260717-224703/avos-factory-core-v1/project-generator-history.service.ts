import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ProjectGeneratorHistoryRecord } from "./project-generator.contracts";

@Injectable()
export class ProjectGeneratorHistoryService {
  private readonly records: ProjectGeneratorHistoryRecord[] = [];

  record(entry: Omit<ProjectGeneratorHistoryRecord, "id" | "timestamp">): ProjectGeneratorHistoryRecord {
    const record = { ...structuredClone(entry), id: randomUUID(), timestamp: new Date().toISOString() };
    this.records.unshift(record);
    return structuredClone(record);
  }

  list(limit = 100): ProjectGeneratorHistoryRecord[] {
    return this.records.slice(0, Math.max(1, Math.min(limit, 1000))).map((item) => structuredClone(item));
  }

  count(): number { return this.records.length; }
}
