import { Injectable } from "@nestjs/common";
import type { LifecycleCommandRecord } from "../contracts/platform-service-lifecycle.contracts";

@Injectable()
export class PlatformCommandHistoryService {
  private readonly records: LifecycleCommandRecord[] = [];

  add(record: LifecycleCommandRecord): LifecycleCommandRecord {
    this.records.push(record);
    return record;
  }

  list(serviceId?: string, limit = 100): LifecycleCommandRecord[] {
    return this.records
      .filter((record) => !serviceId || record.serviceId === serviceId)
      .slice()
      .reverse()
      .slice(0, Math.max(1, limit));
  }

  count(): number {
    return this.records.length;
  }
}