import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseWorkloadSample } from "./enterprise-e7.types";

@Injectable()
export class EnterpriseWorkloadTelemetryService {
  private readonly samples: EnterpriseWorkloadSample[] = [];

  record(input: {
    source?: string;
    requestsPerMinute?: number;
    cpuPercent?: number;
    memoryPercent?: number;
    errorRate?: number;
  }): EnterpriseWorkloadSample {
    const sample: EnterpriseWorkloadSample = {
      id: randomUUID(),
      source: input.source?.trim() || "avos-enterprise-api",
      requestsPerMinute: Math.max(0, input.requestsPerMinute ?? 120),
      cpuPercent: this.clamp(input.cpuPercent ?? 42),
      memoryPercent: this.clamp(input.memoryPercent ?? 48),
      errorRate: this.clamp(input.errorRate ?? 0.5),
      recordedAt: new Date().toISOString(),
    };

    this.samples.push(sample);
    return sample;
  }

  list(source?: string): EnterpriseWorkloadSample[] {
    return source
      ? this.samples.filter((sample) => sample.source === source)
      : [...this.samples];
  }

  latest(source?: string): EnterpriseWorkloadSample | null {
    const samples = this.list(source);
    return samples.length > 0 ? samples[samples.length - 1] : null;
  }

  count(): number {
    return this.samples.length;
  }

  private clamp(value: number): number {
    return Math.min(100, Math.max(0, Number(value.toFixed(2))));
  }
}