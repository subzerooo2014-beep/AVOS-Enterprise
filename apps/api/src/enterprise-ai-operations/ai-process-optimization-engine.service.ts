import { Injectable } from '@nestjs/common';
import { OperationalMetric } from './enterprise-ai-operations.types';

@Injectable()
export class AiProcessOptimizationEngineService {
  optimize(metrics: OperationalMetric[]) {
    return metrics.map((metric) => ({
      process: metric.process,
      optimizationScore: Math.max(
        0,
        Math.round(
          100 -
            metric.errorRate * 100 -
            Math.max(
              0,
              ((metric.latencyMs - metric.slaTargetMs) /
                Math.max(1, metric.slaTargetMs)) *
                50,
            ),
        ),
      ),
      recommendation:
        metric.errorRate > 0.05
          ? 'reduce-errors'
          : metric.latencyMs > metric.slaTargetMs
            ? 'reduce-latency'
            : 'maintain',
    }));
  }
}