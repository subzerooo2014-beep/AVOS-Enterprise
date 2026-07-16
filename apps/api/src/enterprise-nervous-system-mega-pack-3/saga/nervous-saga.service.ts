import { Injectable } from "@nestjs/common";
import { NervousSagaRecord } from "../enterprise-nervous-system-mega-pack-3.types";

@Injectable()
export class NervousSagaService {
  private readonly records =
    new Map<string, NervousSagaRecord>();

  create(input: {
    executionId: string;
    completedStepIds: string[];
    compensationStepIds: string[];
  }) {
    const now = new Date().toISOString();

    const record: NervousSagaRecord = {
      id: `nervous-saga:${Date.now()}:${this.records.size + 1}`,
      executionId: input.executionId,
      completedStepIds: Array.from(new Set(input.completedStepIds)),
      compensationStepIds:
        Array.from(new Set(input.compensationStepIds)),
      status: "ready",
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);
    return record;
  }

  updateStatus(
    id: string,
    status: NervousSagaRecord["status"]
  ) {
    const current = this.records.get(id);

    if (!current) {
      throw new Error(`Nervous saga not found: ${id}`);
    }

    const updated: NervousSagaRecord = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  list() {
    return Array.from(this.records.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      ready: items.filter((x) => x.status === "ready").length,
      compensating:
        items.filter((x) => x.status === "compensating").length,
      completed:
        items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length
    };
  }
}
