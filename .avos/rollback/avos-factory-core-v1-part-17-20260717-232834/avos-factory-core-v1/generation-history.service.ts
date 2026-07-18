import { Injectable } from "@nestjs/common";
import {
  GenerationExecutionRecord
} from "./code-generation.contracts";

@Injectable()
export class GenerationHistoryService {
  private readonly records:
    GenerationExecutionRecord[] = [];

  add(
    record: GenerationExecutionRecord
  ): GenerationExecutionRecord {
    const stored =
      structuredClone(record);

    this.records.unshift(stored);

    return structuredClone(stored);
  }

  list(
    limit = 100
  ): GenerationExecutionRecord[] {
    const safeLimit =
      Math.max(
        1,
        Math.min(limit, 1000)
      );

    return this.records
      .slice(0, safeLimit)
      .map((record) =>
        structuredClone(record)
      );
  }

  listByBlueprint(
    blueprintId: string,
    limit = 100
  ): GenerationExecutionRecord[] {
    return this.records
      .filter(
        (record) =>
          record.blueprintId ===
          blueprintId
      )
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

  listByGeneration(
    generationId: string
  ): GenerationExecutionRecord[] {
    return this.records
      .filter(
        (record) =>
          record.generationId ===
          generationId
      )
      .map((record) =>
        structuredClone(record)
      );
  }

  count(): number {
    return this.records.length;
  }
}
