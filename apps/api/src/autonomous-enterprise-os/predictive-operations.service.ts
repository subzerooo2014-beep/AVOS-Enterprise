import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveOperationsService {
  forecast(input: {
    demand?: number[];
    failures?: number[];
    resourceUsage?: number[];
  }) {
    return {
      demandForecast: this.project(input.demand ?? []),
      failureRisk: this.risk(input.failures ?? []),
      resourceForecast: this.project(input.resourceUsage ?? []),
      horizon: "next-operating-window",
      generatedAt: new Date().toISOString(),
    };
  }

  private project(values: number[]) {
    if (values.length === 0) return { value: 0, trend: "unknown" };
    if (values.length === 1) return { value: values[0], trend: "stable" };

    const delta = values[values.length - 1] - values[values.length - 2];
    const projected = values[values.length - 1] + delta;

    return {
      value: Number(projected.toFixed(4)),
      trend: delta > 0 ? "up" : delta < 0 ? "down" : "stable",
    };
  }

  private risk(values: number[]) {
    if (values.length === 0) return { score: 0, level: "low" };
    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      score: Number(Math.min(100, average).toFixed(2)),
      level:
        average >= 75
          ? "critical"
          : average >= 50
            ? "high"
            : average >= 25
              ? "medium"
              : "low",
    };
  }
}