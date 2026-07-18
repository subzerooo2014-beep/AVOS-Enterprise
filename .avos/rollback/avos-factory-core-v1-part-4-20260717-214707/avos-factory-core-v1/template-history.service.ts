import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  TemplateHistoryRecord
} from "./template.contracts";

@Injectable()
export class TemplateHistoryService {
  private readonly records:
    TemplateHistoryRecord[] = [];

  record(
    entry: Omit<
      TemplateHistoryRecord,
      "id" | "timestamp"
    >
  ): TemplateHistoryRecord {
    const record:
      TemplateHistoryRecord = {
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
  ): TemplateHistoryRecord[] {
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

  listByTemplate(
    templateId: string,
    limit = 100
  ): TemplateHistoryRecord[] {
    return this.records
      .filter(
        (record) =>
          record.templateId ===
          templateId
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
}
