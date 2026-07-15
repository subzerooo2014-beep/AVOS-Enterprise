import { Injectable } from '@nestjs/common';
import { OperationalMetric } from './enterprise-ai-operations.types';

@Injectable()
export class OperationsIntelligenceEngineService {
  analyze(metrics: OperationalMetric[]) {
    return {
      throughput: metrics.reduce(
        (sum, metric) => sum + metric.throughput,
        0,
      ),
      averageLatency: Math.round(
        metrics.reduce(
          (sum, metric) => sum + metric.latencyMs,
          0,
        ) / Math.max(1, metrics.length),
      ),
      averageErrorRate: Number(
        (
          metrics.reduce(
            (sum, metric) => sum + metric.errorRate,
            0,
          ) / Math.max(1, metrics.length)
        ).toFixed(4),
      ),
    };
  }
}