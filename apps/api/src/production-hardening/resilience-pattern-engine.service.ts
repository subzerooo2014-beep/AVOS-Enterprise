import { Injectable } from '@nestjs/common';

@Injectable()
export class ResiliencePatternEngineService {
  evaluate(input: {
    retryPolicy: boolean;
    circuitBreaker: boolean;
    bulkheadIsolation: boolean;
    timeoutPolicy: boolean;
    fallbackPolicy: boolean;
    deadLetterQueue: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      resilient: score >= 90,
    };
  }
}