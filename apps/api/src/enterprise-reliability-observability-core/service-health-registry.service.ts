import { Injectable } from "@nestjs/common";
import type { ServiceHealthRecord } from "./reliability-observability.types";

@Injectable()
export class ServiceHealthRegistryService {
  private readonly records = new Map<string, ServiceHealthRecord>();

  report(
    input: Omit<ServiceHealthRecord, "id" | "checkedAt">,
  ): ServiceHealthRecord {
    const record: ServiceHealthRecord = {
      ...input,
      id: `health-${input.service}`,
      metadata: { ...input.metadata },
      checkedAt: new Date().toISOString(),
    };

    this.records.set(record.id, record);
    return this.clone(record);
  }

  get(service: string): ServiceHealthRecord | undefined {
    const record = this.records.get(`health-${service}`);
    return record ? this.clone(record) : undefined;
  }

  list(): ServiceHealthRecord[] {
    return Array.from(this.records.values()).map((record) =>
      this.clone(record),
    );
  }

  count(): number {
    return this.records.size;
  }

  private clone(record: ServiceHealthRecord): ServiceHealthRecord {
    return {
      ...record,
      metadata: { ...record.metadata },
    };
  }
}
