import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  BlueprintHistoryRecord
} from "./blueprint.contracts";

@Injectable()
export class BlueprintHistoryService {
  private readonly records:
    BlueprintHistoryRecord[] = [];

  record(
    entry: Omit<
      BlueprintHistoryRecord,
      "id" | "timestamp"
    >
  ): BlueprintHistoryRecord {
    const record:
      BlueprintHistoryRecord = {
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
  ): BlueprintHistoryRecord[] {
    const safeLimit =
      Number.isFinite(limit)
        ? Math.max(
            1,
            Math.min(limit, 1000)
          )
        : 100;

    return this.records
      .slice(0, safeLimit)
      .map((record) =>
        structuredClone(record)
      );
  }

  listByBlueprint(
    blueprintId: string,
    limit = 100
  ): BlueprintHistoryRecord[] {
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

  count(): number {
    return this.records.length;
  }

  clear(): void {
    this.records.length = 0;
  }
}
