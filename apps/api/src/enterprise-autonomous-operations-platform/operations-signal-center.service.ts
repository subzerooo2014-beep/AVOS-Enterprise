import { Injectable } from "@nestjs/common";
import type { OperationsSignalRecord } from "./enterprise-autonomous-operations.types";

@Injectable()
export class OperationsSignalCenterService {
  private readonly signals: OperationsSignalRecord[] = [];

  ingest(
    source: string,
    metric: string,
    value: number,
    threshold: number,
  ): OperationsSignalRecord {
    const ratio = threshold === 0 ? 0 : value / threshold;
    const severity: OperationsSignalRecord["severity"] =
      ratio >= 1.5 ? "CRITICAL" : ratio >= 1.2 ? "HIGH" : ratio >= 1 ? "WARNING" : "INFO";

    const signal: OperationsSignalRecord = {
      id: `ops-signal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      source,
      metric,
      value,
      threshold,
      severity,
      createdAt: new Date().toISOString(),
    };

    this.signals.unshift(signal);
    if (this.signals.length > 10000) this.signals.length = 10000;
    return { ...signal };
  }

  list(): OperationsSignalRecord[] {
    return this.signals.map((item) => ({ ...item }));
  }

  count(): number {
    return this.signals.length;
  }

  criticalCount(): number {
    return this.signals.filter((item) => item.severity === "CRITICAL").length;
  }
}
