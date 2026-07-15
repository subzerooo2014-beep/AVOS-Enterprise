import { Injectable } from '@nestjs/common';

@Injectable()
export class TracingReadinessEngineService {
  evaluate(input: {
    opentelemetryConfigured: boolean;
    tracePropagation: boolean;
    databaseSpans: boolean;
    queueSpans: boolean;
    samplingConfigured: boolean;
    exporterConfigured: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}