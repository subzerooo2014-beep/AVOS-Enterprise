import { Injectable } from '@nestjs/common';
import {
  CognitionSignal,
  ReasoningHypothesis,
} from './enterprise-cognition.types';

@Injectable()
export class EnterpriseCognitiveEngineService {
  createHypotheses(signals: CognitionSignal[]): ReasoningHypothesis[] {
    const domains = [...new Set(signals.map((signal) => signal.domain))];

    return domains.map((domain, index) => {
      const domainSignals = signals.filter((signal) => signal.domain === domain);
      const weighted =
        domainSignals.reduce(
          (sum, signal) => sum + signal.value * signal.confidence,
          0,
        ) /
        Math.max(
          1,
          domainSignals.reduce((sum, signal) => sum + signal.confidence, 0),
        );

      return {
        id: `hyp-${index + 1}-${domain}`,
        statement: `${domain} is operating at ${Math.round(weighted)}% effectiveness`,
        supportingSignals: domainSignals
          .filter((signal) => signal.value >= 60)
          .map((signal) => signal.id),
        contradictingSignals: domainSignals
          .filter((signal) => signal.value < 60)
          .map((signal) => signal.id),
        confidence:
          domainSignals.reduce((sum, signal) => sum + signal.confidence, 0) /
          Math.max(1, domainSignals.length),
      };
    });
  }
}