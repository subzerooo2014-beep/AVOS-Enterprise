import { Injectable } from '@nestjs/common';

@Injectable()
export class PerformanceBenchmarkEngineService {
  benchmark(
    actual: Record<string, number>,
    benchmark: Record<string, number>,
  ) {
    const keys = [...new Set([...Object.keys(actual), ...Object.keys(benchmark)])];

    const comparisons = keys.map((key) => {
      const actualValue = actual[key] ?? 0;
      const benchmarkValue = benchmark[key] ?? 0;
      const variance = actualValue - benchmarkValue;
      const variancePercent =
        benchmarkValue === 0
          ? 0
          : (variance / benchmarkValue) * 100;

      return {
        metric: key,
        actual: actualValue,
        benchmark: benchmarkValue,
        variance,
        variancePercent: Number(variancePercent.toFixed(2)),
      };
    });

    return {
      comparisons,
      outperforming: comparisons
        .filter((item) => item.variance > 0)
        .map((item) => item.metric),
      underperforming: comparisons
        .filter((item) => item.variance < 0)
        .map((item) => item.metric),
    };
  }
}