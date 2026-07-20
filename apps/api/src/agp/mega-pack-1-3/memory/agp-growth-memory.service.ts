import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

export interface GrowthMemoryRecord {
  id: string;
  category: "decision" | "lesson" | "evidence" | "recommendation";
  subject: string;
  content: string;
  provenance: string[];
  tags: string[];
  recordedAt: string;
}

@Injectable()
export class AgpGrowthMemoryService {
  private readonly records: GrowthMemoryRecord[] = [];

  remember(
    input: Omit<GrowthMemoryRecord, "id" | "recordedAt">,
  ): GrowthMemoryRecord {
    const record: GrowthMemoryRecord = {
      ...input,
      id: `agp-memory:${randomUUID()}`,
      provenance: [...input.provenance],
      tags: [...input.tags],
      recordedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return JSON.parse(JSON.stringify(record)) as GrowthMemoryRecord;
  }

  search(query: string): GrowthMemoryRecord[] {
    const normalized = query.trim().toLowerCase();
    return this.records
      .filter((record) =>
        [
          record.subject,
          record.content,
          record.category,
          ...record.tags,
          ...record.provenance,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .map(
        (record) =>
          JSON.parse(JSON.stringify(record)) as GrowthMemoryRecord,
      );
  }

  snapshot() {
    return {
      total: this.records.length,
      byCategory: {
        decisions: this.records.filter((item) => item.category === "decision")
          .length,
        lessons: this.records.filter((item) => item.category === "lesson")
          .length,
        evidence: this.records.filter((item) => item.category === "evidence")
          .length,
        recommendations: this.records.filter(
          (item) => item.category === "recommendation",
        ).length,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}