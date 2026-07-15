import { Injectable } from '@nestjs/common';
import { DecisionExecution } from './enterprise-ai-operations.types';

@Injectable()
export class DecisionExplainabilityEngineService {
  explain(decision: DecisionExecution) {
    return {
      decisionId: decision.id,
      recommendation: decision.recommendation,
      confidence: decision.confidence,
      approved: decision.approved,
      executed: decision.executed,
      explanation: decision.explanation,
      summary: `${decision.decisionType}:${decision.recommendation}:${decision.executed}`,
    };
  }
}