import { Injectable } from '@nestjs/common';
import { OperationalMetric } from './enterprise-ai-operations.types';

@Injectable()
export class SlaOperationalRiskEngineService {
  evaluate(metrics: OperationalMetric[]) {
    return metrics.map((metric) => {
      const latencyRisk =
        metric.latencyMs <= metric.slaTargetMs
          ? 0
          : Math.min(
              100,
              ((metric.latencyMs - metric.slaTargetMs) /
                Math.max(1, metric.slaTargetMs)) *
                100,
            );

      const risk = Math.min(
        100,
        Math.round(latencyRisk * 0.6 + metric.errorRate * 100 * 0.4),
      );

      return {
        process: metric.process,
        risk,
        level: risk >= 70 ? 'critical' : risk >= 40 ? 'warning' : 'normal',
      };
    });
  }
}