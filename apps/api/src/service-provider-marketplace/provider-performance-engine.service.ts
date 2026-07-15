import { Injectable } from '@nestjs/common';
import { ProviderMetric } from './service-provider-marketplace.types';

@Injectable()
export class ProviderPerformanceEngineService {
  analyze(metrics: ProviderMetric[]) {
    return [...metrics]
      .map((metric) => ({
        ...metric,
        performanceScore: Math.round(
          metric.averageRating * 10 +
          metric.onTimeRate * 0.25 +
          metric.slaCompliance * 0.25,
        ),
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore);
  }
}