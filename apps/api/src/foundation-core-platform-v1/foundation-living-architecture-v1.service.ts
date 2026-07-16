import { Injectable } from "@nestjs/common";
import type { LivingArchitectureRecordV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationLivingArchitectureV1Service {
  private readonly records = new Map<string, LivingArchitectureRecordV1>();

  upsert(
    input: Omit<LivingArchitectureRecordV1, "updatedAt">,
  ): LivingArchitectureRecordV1 {
    const record: LivingArchitectureRecordV1 = {
      ...input,
      relationships: [...input.relationships],
      metadata: { ...input.metadata },
      updatedAt: new Date().toISOString(),
    };

    this.records.set(record.id, record);
    return this.clone(record);
  }

  list(): LivingArchitectureRecordV1[] {
    return Array.from(this.records.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.records.size;
  }

  private clone(item: LivingArchitectureRecordV1): LivingArchitectureRecordV1 {
    return {
      ...item,
      relationships: [...item.relationships],
      metadata: { ...item.metadata },
    };
  }
}
