import { Injectable } from "@nestjs/common";
import type { OperationsTelemetryV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsTelemetryV1Service {
  private readonly telemetry: OperationsTelemetryV1[] = [];

  record(
    source: string,
    metric: string,
    value: number,
    labels: Record<string, string> = {},
  ): OperationsTelemetryV1 {
    const point: OperationsTelemetryV1 = {
      id: `operations-telemetry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      source,
      metric,
      value,
      labels: { ...labels },
      recordedAt: new Date().toISOString(),
    };

    this.telemetry.unshift(point);
    return this.clone(point);
  }

  list(): OperationsTelemetryV1[] {
    return this.telemetry.map((item) => this.clone(item));
  }

  count(): number {
    return this.telemetry.length;
  }

  private clone(item: OperationsTelemetryV1): OperationsTelemetryV1 {
    return { ...item, labels: { ...item.labels } };
  }
}
