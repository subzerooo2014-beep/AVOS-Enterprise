import { Injectable } from "@nestjs/common";
import {
  EnterpriseDemandForecast,
  EnterpriseForecastTrend,
} from "./enterprise-e7.types";
import { EnterpriseWorkloadTelemetryService } from "./enterprise-workload-telemetry.service";

@Injectable()
export class EnterpriseDemandForecastService {
  private readonly forecasts: EnterpriseDemandForecast[] = [];

  constructor(
    private readonly telemetry: EnterpriseWorkloadTelemetryService,
  ) {}

  forecast(source = "avos-enterprise-api", horizonMinutes = 60): EnterpriseDemandForecast {
    const samples = this.telemetry.list(source);
    const recent = samples.slice(-5);

    if (recent.length === 0) {
      this.telemetry.record({ source });
      return this.forecast(source, horizonMinutes);
    }

    const first = recent[0];
    const last = recent[recent.length - 1];
    const delta = last.requestsPerMinute - first.requestsPerMinute;
    const trend: EnterpriseForecastTrend =
      delta > 10 ? "RISING" : delta < -10 ? "FALLING" : "STABLE";
    const multiplier = trend === "RISING" ? 1.18 : trend === "FALLING" ? 0.9 : 1.05;

    const result: EnterpriseDemandForecast = {
      source,
      horizonMinutes: Math.max(5, horizonMinutes),
      predictedRequestsPerMinute: Math.round(last.requestsPerMinute * multiplier),
      predictedCpuPercent: this.clamp(last.cpuPercent * multiplier),
      predictedMemoryPercent: this.clamp(last.memoryPercent * (multiplier > 1 ? 1.08 : 0.96)),
      trend,
      confidence: Math.min(98, 72 + recent.length * 5),
      generatedAt: new Date().toISOString(),
    };

    this.forecasts.push(result);
    return result;
  }

  list(): EnterpriseDemandForecast[] {
    return [...this.forecasts];
  }

  count(): number {
    return this.forecasts.length;
  }

  private clamp(value: number): number {
    return Math.min(100, Math.max(0, Math.round(value)));
  }
}