import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ProductionMemoryRecord } from "./factory-knowledge.contracts";

@Injectable()
export class ProductionMemoryService {
  private readonly records: ProductionMemoryRecord[] = [];

  remember(input: Omit<ProductionMemoryRecord, "id" | "timestamp">):
    ProductionMemoryRecord {
    const record: ProductionMemoryRecord = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      ...input,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  all(): ProductionMemoryRecord[] {
    return structuredClone(this.records);
  }

  byWorkItem(workItemId: string): ProductionMemoryRecord[] {
    return this.all().filter((record) => record.workItemId === workItemId);
  }

  successful(): ProductionMemoryRecord[] {
    return this.all().filter((record) => record.outcome === "success");
  }

  failed(): ProductionMemoryRecord[] {
    return this.all().filter((record) => record.outcome === "failure");
  }

  count(): number {
    return this.records.length;
  }
}
