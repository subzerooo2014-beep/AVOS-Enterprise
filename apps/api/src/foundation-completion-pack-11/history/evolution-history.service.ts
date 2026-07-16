import { Injectable } from "@nestjs/common";
import { EvolutionHistoryRecord } from "../foundation-pack-11.types";

@Injectable()
export class EvolutionHistoryService {
  private readonly records: EvolutionHistoryRecord[] = [];

  record(
    input: Omit<EvolutionHistoryRecord, "id" | "occurredAt">
  ) {
    const record: EvolutionHistoryRecord = {
      ...input,
      id: `evolution-history:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  byRequest(requestId: string) {
    return this.records
      .filter((record) => record.requestId === requestId)
      .sort((left, right) =>
        left.occurredAt.localeCompare(right.occurredAt)
      );
  }

  byBlueprint(blueprintId: string) {
    return this.records
      .filter((record) => record.blueprintId === blueprintId)
      .sort((left, right) =>
        left.occurredAt.localeCompare(right.occurredAt)
      );
  }

  summary() {
    return {
      total: this.records.length,
      requests: new Set(
        this.records.map((record) => record.requestId)
      ).size,
      blueprints: new Set(
        this.records.map((record) => record.blueprintId)
      ).size
    };
  }
}
