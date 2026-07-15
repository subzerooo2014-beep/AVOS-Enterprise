import { Injectable } from '@nestjs/common';
import {
  AiTask,
  OperationalMetric,
} from './enterprise-ai-operations.types';

@Injectable()
export class AiOperationsEngineService {
  evaluate(tasks: AiTask[], metrics: OperationalMetric[]) {
    const queued = tasks.filter((task) => task.status === 'queued');
    const running = tasks.filter((task) => task.status === 'running');
    const failures = tasks.filter((task) => task.status === 'failed');

    const slaCompliance =
      metrics.filter((metric) => metric.latencyMs <= metric.slaTargetMs)
        .length / Math.max(1, metrics.length);

    return {
      queued: queued.length,
      running: running.length,
      failed: failures.length,
      slaCompliance: Number((slaCompliance * 100).toFixed(2)),
      healthy:
        failures.length === 0 &&
        slaCompliance >= 0.9,
    };
  }
}