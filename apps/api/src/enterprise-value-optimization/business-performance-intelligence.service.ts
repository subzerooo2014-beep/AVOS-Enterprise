import { Injectable } from '@nestjs/common';
import { PerformanceMetric } from './enterprise-value-optimization.types';

@Injectable()
export class BusinessPerformanceIntelligenceService {
  analyze(metrics: PerformanceMetric[]) {
    const normalized = metrics.map((metric) => ({
      ...metric,
      attainment:
        metric.target === 0
          ? 100
          : Math.max(
              0,
              Math.min(100, (metric.actual / metric.target) * 100),
            ),
    }));

    const weightedScore =
      normalized.reduce(
        (sum, metric) => sum + metric.attainment * metric.weight,
        0,
      ) /
      Math.max(
        1,
        normalized.reduce((sum, metric) => sum + metric.weight, 0),
      );

    return {
      score: Math.round(weightedScore),
      metrics: normalized,
      underperforming: normalized
        .filter((metric) => metric.attainment < 70)
        .map((metric) => metric.id),
    };
  }
}