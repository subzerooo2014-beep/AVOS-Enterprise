import { Injectable } from "@nestjs/common";
import { EnterpriseTelemetryService } from "./enterprise-telemetry.service";

@Injectable()
export class OperationalInsightsService {
  constructor(private readonly telemetry: EnterpriseTelemetryService) {}

  generate() {
    const signals = this.telemetry.recent(200);
    const total = signals.length;
    const unhealthy = signals.filter((item) => item.healthy === false).length;
    const averageLatencyMs = total
      ? Math.round(signals.reduce((sum, item) => sum + (item.latencyMs ?? 0), 0) / total)
      : 0;

    return {
      totalSignals: total,
      unhealthySignals: unhealthy,
      averageLatencyMs,
      insight:
        unhealthy > 0
          ? "Operational degradation detected. Recovery coordination is recommended."
          : "No active degradation detected in the current telemetry window.",
      generatedAt: new Date().toISOString(),
    };
  }
}