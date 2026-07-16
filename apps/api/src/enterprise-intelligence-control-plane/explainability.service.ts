import { Injectable } from "@nestjs/common";
import type { DecisionResult } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class ExplainabilityService {
  explain(result: DecisionResult) {
    return {
      decisionId: result.id,
      outcome: result.outcome,
      confidence: result.confidence,
      reasons: [...result.reasons],
      appliedRules: [...result.appliedRules],
      modelId: result.modelId,
      explanation: [
        `Outcome: ${result.outcome}`,
        `Confidence: ${result.confidence}`,
        ...result.reasons,
      ].join(" | "),
      generatedAt: new Date().toISOString(),
    };
  }
}
