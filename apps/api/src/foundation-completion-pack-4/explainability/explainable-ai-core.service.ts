import { Injectable, NotFoundException } from "@nestjs/common";
import { ExplainabilityRecord } from "../foundation-pack-4.types";

@Injectable()
export class ExplainableAiCoreService {
  private readonly records = new Map<string, ExplainabilityRecord>();

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Explainability record not found: ${id}`);
    }

    return record;
  }

  register(
    input: Omit<ExplainabilityRecord, "id" | "createdAt">
  ) {
    const id = `explainability:${Date.now()}`;

    const record: ExplainabilityRecord = {
      ...input,
      id,
      confidence: Math.max(0, Math.min(100, input.confidence)),
      rationale: Array.from(new Set(input.rationale)),
      evidenceIds: Array.from(new Set(input.evidenceIds)),
      limitations: Array.from(new Set(input.limitations)),
      createdAt: new Date().toISOString()
    };

    this.records.set(id, record);
    return record;
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      averageConfidence:
        records.length === 0
          ? 0
          : Number(
              (
                records.reduce((sum, record) => sum + record.confidence, 0) /
                records.length
              ).toFixed(2)
            )
    };
  }
}
