import {
  ValidationGateResult,
  ValidationGateStatus,
} from "./contracts";

export interface PromotionDecision {
  approved: boolean;
  strategy: "promote" | "promote-with-controls" | "rollback";
  qualityScore: number;
  failedRequiredGates: string[];
  controls: string[];
  decidedAt: string;
}

export class PromotionDecisionEngine {
  decide(results: readonly ValidationGateResult[]): PromotionDecision {
    const totalWeight = Math.max(1, results.length);
    const qualityScore = Math.round(
      results.reduce((sum, result) => sum + result.score, 0) / totalWeight,
    );

    const failedRequiredGates = results
      .filter(
        (result) =>
          result.required &&
          result.status !== ValidationGateStatus.PASSED,
      )
      .map((result) => result.key);

    const approved = failedRequiredGates.length === 0 && qualityScore >= 75;

    return {
      approved,
      strategy: !approved
        ? "rollback"
        : qualityScore >= 90
          ? "promote"
          : "promote-with-controls",
      qualityScore,
      failedRequiredGates,
      controls:
        qualityScore >= 90
          ? ["continuous-observability"]
          : approved
            ? [
                "progressive-promotion",
                "continuous-observability",
                "automatic-rollback",
              ]
            : ["rollback-required", "human-review"],
      decidedAt: new Date().toISOString(),
    };
  }
}
