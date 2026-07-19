import { Injectable } from "@nestjs/common";

@Injectable()
export class PerformanceBaselineEngineService {
  assess(metrics: readonly { readonly name: string; readonly value: number }[]) {
    const total = metrics.reduce((sum, metric) => sum + metric.value, 0);

    return {
      metricCount: metrics.length,
      aggregate: total,
      status: "baseline-captured",
    };
  }
}
