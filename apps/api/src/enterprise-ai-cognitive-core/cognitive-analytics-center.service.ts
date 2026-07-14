import { Injectable } from '@nestjs/common';
import {
  CognitiveHypothesis,
  CognitiveSignal,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class CognitiveAnalyticsCenterService {
  analyze(
    signals: CognitiveSignal[],
    hypotheses: CognitiveHypothesis[],
  ) {
    return {
      signalCount: signals.length,
      domainCount: new Set(signals.map((signal) => signal.domain)).size,
      sourceCount: new Set(signals.map((signal) => signal.source)).size,
      averageConfidence: Number(
        (
          signals.reduce(
            (sum, signal) => sum + signal.confidence,
            0,
          ) / Math.max(1, signals.length)
        ).toFixed(3),
      ),
      hypothesisCount: hypotheses.length,
      contradictionCount: hypotheses.reduce(
        (sum, hypothesis) =>
          sum + hypothesis.contradictions.length,
        0,
      ),
    };
  }
}