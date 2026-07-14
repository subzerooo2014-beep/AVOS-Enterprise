import { Injectable } from '@nestjs/common';
import {
  CognitiveHypothesis,
  KnowledgeFragment,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class KnowledgeSynthesisEngineService {
  synthesize(
    fragments: KnowledgeFragment[],
    hypotheses: CognitiveHypothesis[],
  ) {
    const domains = [...new Set(fragments.map((fragment) => fragment.domain))];
    const concepts = [...new Set(fragments.map((fragment) => fragment.concept))];

    return {
      domains,
      concepts,
      knowledgeCoverage: Math.min(
        100,
        domains.length * 12 + concepts.length * 5,
      ),
      synthesizedInsights: hypotheses.map((hypothesis) => ({
        hypothesisId: hypothesis.id,
        insight: hypothesis.statement,
        confidence: hypothesis.confidence,
        supportingFragments: fragments
          .filter((fragment) =>
            hypothesis.statement
              .toLowerCase()
              .includes(fragment.domain.toLowerCase()),
          )
          .map((fragment) => fragment.id),
      })),
    };
  }
}