import { Injectable } from '@nestjs/common';
import {
  CognitiveHypothesis,
  CognitiveSignal,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class EnterpriseCognitiveEngineService {
  generateHypotheses(signals: CognitiveSignal[]): CognitiveHypothesis[] {
    const domains = [...new Set(signals.map((signal) => signal.domain))];

    return domains.map((domain, index) => {
      const domainSignals = signals.filter(
        (signal) => signal.domain === domain,
      );
      const confidence =
        domainSignals.reduce(
          (sum, signal) => sum + signal.confidence,
          0,
        ) / Math.max(1, domainSignals.length);
      const weightedValue =
        domainSignals.reduce(
          (sum, signal) => sum + signal.value * signal.confidence,
          0,
        ) /
        Math.max(
          1,
          domainSignals.reduce(
            (sum, signal) => sum + signal.confidence,
            0,
          ),
        );

      return {
        id: `hypothesis-${index + 1}-${domain}`,
        statement: `${domain} operates at ${Math.round(weightedValue)}% cognitive effectiveness`,
        evidence: domainSignals
          .filter((signal) => signal.value >= 60)
          .map((signal) => signal.id),
        contradictions: domainSignals
          .filter((signal) => signal.value < 60)
          .map((signal) => signal.id),
        confidence,
        score: Math.round(weightedValue),
      };
    });
  }
}