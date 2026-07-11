import {
  ArchitectureEvolutionDecision,
  ArchitectureEvolutionDecisionResult,
  ArchitectureEvolutionSimulation,
  ArchitectureHealingPlan,
} from "./contracts";

export class ArchitectureEvolutionApprovalPipeline {
  decide(
    simulation:
      ArchitectureEvolutionSimulation,
    healing:
      ArchitectureHealingPlan,
  ): ArchitectureEvolutionDecisionResult {
    const controls =
      new Set<string>();

    const reasons: string[] = [];

    if (
      !simulation.compatibility.compatible
    ) {
      reasons.push(
        "Architecture compatibility validation failed.",
      );

      return {
        decision:
          ArchitectureEvolutionDecision.REJECT,
        approved: false,
        score:
          simulation.projectedScore,
        confidence:
          simulation.confidence,
        reasons,
        controls: [],
        decidedAt:
          new Date().toISOString(),
      };
    }

    if (simulation.confidence < 50) {
      reasons.push(
        "Simulation confidence is below the approval threshold.",
      );

      controls.add(
        "human-architecture-review",
      );

      return {
        decision:
          ArchitectureEvolutionDecision.REQUIRE_REVIEW,
        approved: false,
        score:
          simulation.projectedScore,
        confidence:
          simulation.confidence,
        reasons,
        controls:
          Array.from(
            controls,
          ),
        decidedAt:
          new Date().toISOString(),
      };
    }

    if (
      simulation.risks.length > 0
    ) {
      controls.add(
        "tested-rollback-plan",
      );

      controls.add(
        "progressive-rollout",
      );

      reasons.push(
        "Evolution plan contains elevated-risk mutations.",
      );
    }

    if (
      healing.automationCoverage < 70
    ) {
      controls.add(
        "manual-recovery-runbook",
      );

      reasons.push(
        "Self-healing automation coverage is limited.",
      );
    }

    const decision =
      controls.size > 0
        ? ArchitectureEvolutionDecision.APPROVE_WITH_CONTROLS
        : ArchitectureEvolutionDecision.APPROVE;

    return {
      decision,
      approved: true,
      score:
        simulation.projectedScore,
      confidence:
        simulation.confidence,
      reasons:
        reasons.length > 0
          ? reasons
          : [
              "Architecture evolution passed all approval checks.",
            ],
      controls:
        Array.from(
          controls,
        ),
      decidedAt:
        new Date().toISOString(),
    };
  }
}
