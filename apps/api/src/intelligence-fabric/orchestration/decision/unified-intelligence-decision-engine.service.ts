import { Injectable } from "@nestjs/common";
import {
  IntelligenceEngineResult,
  UnifiedIntelligenceDecision,
  UnifiedIntelligenceRequest,
  UnifiedIntelligenceRoute,
} from "../contracts/unified-intelligence-orchestration.contracts";

@Injectable()
export class UnifiedIntelligenceDecisionEngineService {
  resolve(
    request: UnifiedIntelligenceRequest,
    route: UnifiedIntelligenceRoute,
    results: readonly IntelligenceEngineResult[],
  ): UnifiedIntelligenceDecision {
    const confidence =
      results.length === 0
        ? 0
        : results.reduce((sum, item) => sum + item.confidence, 0) /
          results.length;

    const conflicts = this.detectConflicts(results);
    const best = [...results].sort(
      (a, b) => b.confidence - a.confidence,
    )[0];

    const requiresHumanApproval =
      request.requireHumanApproval === true ||
      confidence < 0.7 ||
      conflicts.length > 0 ||
      (request.constraints ?? []).some((constraint) =>
        /human|approval|manual|بشري|موافقة/iu.test(constraint),
      );

    return {
      id: `if2-decision:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      correlationId: route.correlationId,
      objective: request.objective,
      selectedEngines: route.selectedEngineIds,
      recommendation:
        best?.recommendation ??
        `No engine recommendation was available for "${request.objective}".`,
      confidence: Number(confidence.toFixed(4)),
      rationale: results.flatMap((item) => item.rationale),
      conflicts,
      requiresHumanApproval,
      engineResults: results,
      createdAt: new Date().toISOString(),
    };
  }

  private detectConflicts(
    results: readonly IntelligenceEngineResult[],
  ): readonly string[] {
    if (results.length < 2) return [];

    const max = Math.max(...results.map((item) => item.confidence));
    const min = Math.min(...results.map((item) => item.confidence));

    if (max - min >= 0.3) {
      return [
        `Engine confidence divergence detected: maximum=${max.toFixed(
          4,
        )}, minimum=${min.toFixed(4)}.`,
      ];
    }

    return [];
  }
}