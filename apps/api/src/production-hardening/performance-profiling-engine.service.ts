import { Injectable } from '@nestjs/common';
import { PerformanceMetric } from './production-hardening.types';

@Injectable()
export class PerformanceProfilingEngineService {
  analyze(metrics: PerformanceMetric[]) {
    const evaluated = metrics.map((metric) => {
      const latencyScore = Math.max(
        0,
        100 -
          Math.max(
            0,
            ((metric.latencyMs - metric.targetLatencyMs) /
              Math.max(1, metric.targetLatencyMs)) *
              100,
          ),
      );
      const errorScore = Math.max(0, 100 - metric.errorRate * 1000);
      const resourceScore = Math.max(
        0,
        100 -
          Math.max(0, metric.cpuPercent - 70) * 2 -
          Math.max(0, metric.memoryMb - 1024) / 20,
      );

      return {
        ...metric,
        score: Math.round(
          latencyScore * 0.45 +
            errorScore * 0.35 +
            resourceScore * 0.2,
        ),
        withinTarget:
          metric.latencyMs <= metric.targetLatencyMs &&
          metric.errorRate <= 0.01,
      };
    });

    return {
      metrics: evaluated,
      score: Math.round(
        evaluated.reduce((sum, metric) => sum + metric.score, 0) /
          Math.max(1, evaluated.length),
      ),
      violations: evaluated
        .filter((metric) => !metric.withinTarget)
        .map((metric) => metric.id),
    };
  }
}