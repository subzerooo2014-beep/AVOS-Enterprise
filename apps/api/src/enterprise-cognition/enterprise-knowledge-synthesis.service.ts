import { Injectable } from '@nestjs/common';
import {
  CognitionSignal,
  ReasoningHypothesis,
} from './enterprise-cognition.types';

@Injectable()
export class EnterpriseKnowledgeSynthesisService {
  synthesize(signals: CognitionSignal[], hypotheses: ReasoningHypothesis[]) {
    const domains = [...new Set(signals.map((signal) => signal.domain))];
    const sources = [...new Set(signals.map((signal) => signal.source))];

    return {
      domains,
      sources,
      knowledgeCoverage: Math.min(100, domains.length * 12 + sources.length * 4),
      synthesizedInsights: hypotheses.map((hypothesis) => ({
        statement: hypothesis.statement,
        confidence: hypothesis.confidence,
        evidenceCount:
          hypothesis.supportingSignals.length +
          hypothesis.contradictingSignals.length,
      })),
    };
  }
}