import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueReadinessEngineService {
  evaluate(input: {
    configured: boolean;
    retryPolicy: boolean;
    deadLetterQueue: boolean;
    visibilityTimeout: boolean;
    idempotency: boolean;
    metricsEnabled: boolean;
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