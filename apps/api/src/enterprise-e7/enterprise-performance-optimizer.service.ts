import { Injectable } from "@nestjs/common";
import { EnterpriseWorkloadTelemetryService } from "./enterprise-workload-telemetry.service";

@Injectable()
export class EnterprisePerformanceOptimizerService {
  constructor(
    private readonly telemetry: EnterpriseWorkloadTelemetryService,
  ) {}

  evaluate(source = "avos-enterprise-api") {
    const sample = this.telemetry.latest(source) || this.telemetry.record({ source });
    const resourcePenalty =
      Math.max(0, sample.cpuPercent - 65) * 0.6 +
      Math.max(0, sample.memoryPercent - 70) * 0.4;
    const errorPenalty = sample.errorRate * 3;
    const score = Math.max(0, Math.round(100 - resourcePenalty - errorPenalty));

    return {
      source,
      score,
      bottleneck:
        sample.cpuPercent >= sample.memoryPercent ? "CPU" : "MEMORY",
      actions: [
        ...(sample.cpuPercent > 65 ? ["rebalance-compute-workload"] : []),
        ...(sample.memoryPercent > 70 ? ["optimize-memory-retention"] : []),
        ...(sample.errorRate > 2 ? ["reduce-runtime-error-rate"] : []),
        ...(score >= 90 ? ["maintain-current-performance-profile"] : []),
      ],
      evaluatedAt: new Date().toISOString(),
    };
  }
}