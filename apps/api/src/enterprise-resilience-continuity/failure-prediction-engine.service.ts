import { Injectable } from '@nestjs/common';
import { ResilienceSignal } from './enterprise-resilience-continuity.types';

@Injectable()
export class FailurePredictionEngineService {
  predict(signals: ResilienceSignal[]) {
    const predictions = signals.map((signal) => {
      const failureProbability = Math.max(
        0,
        Math.min(
          1,
          1 -
            (signal.health * 0.5 +
              signal.redundancy * 0.2 +
              signal.recoveryReadiness * 0.3) /
              100,
        ),
      );

      return {
        domain: signal.domain,
        failureProbability: Number(failureProbability.toFixed(3)),
        riskWindow:
          failureProbability >= 0.6
            ? 'immediate'
            : failureProbability >= 0.35
              ? 'near-term'
              : 'stable',
      };
    });

    return {
      predictions,
      highestRisk: [...predictions].sort(
        (left, right) =>
          right.failureProbability - left.failureProbability,
      )[0] ?? null,
    };
  }
}