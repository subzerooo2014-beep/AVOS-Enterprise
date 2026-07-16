import { Injectable, NotFoundException } from "@nestjs/common";
import { DataProvenanceRecord } from "../foundation-pack-4.types";

@Injectable()
export class DataProvenanceService {
  private readonly records = new Map<string, DataProvenanceRecord>();

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Data provenance record not found: ${id}`);
    }

    return record;
  }

  register(
    input: Omit<DataProvenanceRecord, "id" | "updatedAt">
  ) {
    const id = `provenance:${Date.now()}`;

    const record: DataProvenanceRecord = {
      ...input,
      id,
      trustLevel: Math.max(0, Math.min(100, input.trustLevel)),
      transformations: Array.from(new Set(input.transformations)),
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, record);
    return record;
  }

  byAsset(assetId: string) {
    return this.list().filter((record) => record.assetId === assetId);
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      trustedSources: records.filter((record) => record.trustLevel >= 80).length,
      averageTrustLevel:
        records.length === 0
          ? 0
          : Number(
              (
                records.reduce((sum, record) => sum + record.trustLevel, 0) /
                records.length
              ).toFixed(2)
            )
    };
  }
}
