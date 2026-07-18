import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AiGeneratorHistoryRecord
} from "./ai-generator.contracts";

@Injectable()
export class AiGeneratorHistoryService {
  private readonly records:
    AiGeneratorHistoryRecord[] = [];

  record(
    entry: Omit<
      AiGeneratorHistoryRecord,
      "id" | "timestamp"
    >
  ): AiGeneratorHistoryRecord {
    const record:
      AiGeneratorHistoryRecord = {
      ...structuredClone(entry),
      id: randomUUID(),
      timestamp:
        new Date().toISOString()
    };

    this.records.unshift(record);

    return structuredClone(record);
  }

  list(
    limit = 100
  ): AiGeneratorHistoryRecord[] {
    return this.records
      .slice(
        0,
        Math.max(
          1,
          Math.min(limit, 1000)
        )
      )
      .map((record) =>
        structuredClone(record)
      );
  }

  listByRequest(
    requestId: string
  ): AiGeneratorHistoryRecord[] {
    return this.records
      .filter(
        (record) =>
          record.requestId === requestId
      )
      .map((record) =>
        structuredClone(record)
      );
  }

  count(): number {
    return this.records.length;
  }
}
