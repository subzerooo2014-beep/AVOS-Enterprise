import { Injectable } from '@nestjs/common';
import { CognitionSignal } from './enterprise-cognition.types';

@Injectable()
export class PredictiveOrganizationalIntelligenceService {
  predict(signals: CognitionSignal[]) {
    const domainScores = new Map<string, number[]>();

    for (const signal of signals) {
      const values = domainScores.get(signal.domain) ?? [];
      values.push(signal.value * signal.confidence);
      domainScores.set(signal.domain, values);
    }

    const predictions = [...domainScores.entries()].map(([domain, values]) => {
      const score =
        values.reduce((sum, value) => sum + value, 0) /
        Math.max(1, values.length);

      return {
        domain,
        readiness: Math.round(score),
        trend: score >= 75 ? 'accelerating' : score >= 55 ? 'stable' : 'at-risk',
      };
    });

    return {
      predictions,
      organizationalReadiness: Math.round(
        predictions.reduce((sum, item) => sum + item.readiness, 0) /
          Math.max(1, predictions.length),
      ),
    };
  }
}