import { Injectable } from '@nestjs/common';
import { RuntimeMetric } from '../contracts/runtime.contracts';
import { nowIso } from '../shared/runtime.utils';

@Injectable()
export class RuntimeMetricsService {
  private readonly metrics: RuntimeMetric[] = [];

  record(
    metric: Omit<RuntimeMetric, 'observedAt'>,
  ): RuntimeMetric {
    const stored: RuntimeMetric = {
      ...metric,
      observedAt: nowIso(),
      tags: { ...metric.tags },
    };
    this.metrics.push(stored);
    return structuredClone(stored);
  }

  latest(name?: string): RuntimeMetric[] {
    return this.metrics
      .filter((metric) => !name || metric.name === name)
      .map((metric) => structuredClone(metric));
  }

  count(): number {
    return this.metrics.length;
  }
}