import {
  GenesisDecisionOutcome,
  GenesisDecisionResult,
  GenesisIntelligentPlan,
  GenesisValidationReport,
} from "./contracts";

export class GenesisIntelligenceDecisionEngine {
  decide(
    plan: GenesisIntelligentPlan,
    validation:
      GenesisValidationReport,
  ): GenesisDecisionResult {
    const controls = new Set<string>();
    const reasons: string[] = [];

    if (!validation.passed) {
      reasons.push(
        "Autonomous validation failed.",
      );

      return {
        outcome:
          GenesisDecisionOutcome.REJECT,
        approved: false,
        score:
          Math.min(
            plan.score,
            validation.score,
          ),
        reasons,
        controls: [],
        decidedAt:
          new Date().toISOString(),
      };
    }

    const highRiskActions =
      plan.actions.filter(
        (action) =>
          action.riskScore >= 70,
      );

    if (
      highRiskActions.length > 0
    ) {
      controls.add(
        "architecture-review",
      );

      controls.add(
        "tested-rollback-plan",
      );

      reasons.push(
        "Plan contains high-risk actions.",
      );
    }

    if (
      validation.issues.length > 0
    ) {
      controls.add(
        "validation-evidence",
      );

      reasons.push(
        "Validation produced non-blocking issues.",
      );
    }

    const score =
      Math.round(
        (
          plan.score +
          validation.score
        ) /
          2,
      );

    const outcome =
      controls.size > 0
        ? GenesisDecisionOutcome.APPROVE_WITH_CONTROLS
        : GenesisDecisionOutcome.APPROVE;

    return {
      outcome,
      approved: true,
      score,
      reasons:
        reasons.length > 0
          ? reasons
          : [
              "Plan passed all autonomous checks.",
            ],
      controls:
        Array.from(controls),
      decidedAt:
        new Date().toISOString(),
    };
  }
}
