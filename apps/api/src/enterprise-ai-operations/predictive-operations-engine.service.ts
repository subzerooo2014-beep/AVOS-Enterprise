import { Injectable } from '@nestjs/common';
import { OperationalMetric } from './enterprise-ai-operations.types';

@Injectable()
export class PredictiveOperationsEngineService {
  forecast(metrics: OperationalMetric[]) {
    return metrics.map((metric) => ({
      process: metric.process,
      predictedThroughput: Math.round(metric.throughput * 1.08),
      predictedLatencyMs: Math.round(
        metric.latencyMs * (1 + metric.errorRate),
      ),
      capacityRisk:
        metric.latencyMs > metric.slaTargetMs * 0.9,
    }));
  }
}