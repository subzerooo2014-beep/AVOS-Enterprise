import { Injectable } from "@nestjs/common";
import { EnterpriseTelemetryRecord } from "./enterprise-e3.types";

@Injectable()
export class EnterpriseTelemetryService {
  private readonly records: EnterpriseTelemetryRecord[] = [];

  record(input: {
    category: string;
    metric: string;
    value: number;
    metadata?: Record<string, unknown>;
  }) {
    const record: EnterpriseTelemetryRecord = {
      id: `telemetry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      category: input.category,
      metric: input.metric,
      value: input.value,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records].reverse();
  }

  summary() {
    const count = this.records.length;
    const total = this.records.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    return {
      count,
      average: count > 0 ? total / count : 0,
    };
  }
}
