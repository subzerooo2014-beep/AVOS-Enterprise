import {
  EvolutionImpactForecast,
  RecoveryStrategy,
  ResilienceDecision,
  ResilienceDecisionResult,
  ResilienceSimulationResult,
} from "./contracts";

export class GenesisResilienceDecisionEngine {
  decide(
    simulation:
      ResilienceSimulationResult,
    recovery:
      RecoveryStrategy,
    forecast:
      EvolutionImpactForecast,
  ): ResilienceDecisionResult {
    const reasons: string[] = [];
    const controls =
      new Set<string>(
        forecast.requiredControls,
      );

    const score =
      Math.round(
        (
          simulation.aggregateScore +
          forecast.projectedScore +
          recovery.automationCoverage
        ) /
          3,
      );

    if (
      simulation.criticalFindings.length > 0
    ) {
      reasons.push(
        "Simulation produced critical resilience findings.",
      );

      controls.add(
        "critical-findings-remediation",
      );
    }

    if (
      recovery.estimatedRecoveryMinutes >
      240
    ) {
      reasons.push(
        "Estimated recovery time exceeds four hours.",
      );

      controls.add(
        "recovery-time-reduction",
      );
    }

    if (forecast.confidence < 50) {
      reasons.push(
        "Evolution forecast confidence is low.",
      );

      return {
        decision:
          ResilienceDecision.REQUIRE_REDESIGN,
        approved: false,
        score,
        confidence:
          forecast.confidence,
        reasons,
        controls:
          Array.from(controls),
        decidedAt:
          new Date().toISOString(),
      };
    }

    if (score < 45) {
      reasons.push(
        "Aggregate resilience score is unacceptable.",
      );

      return {
        decision:
          ResilienceDecision.REJECT,
        approved: false,
        score,
        confidence:
          forecast.confidence,
        reasons,
        controls:
          Array.from(controls),
        decidedAt:
          new Date().toISOString(),
      };
    }

    const decision =
      controls.size > 0
        ? ResilienceDecision.ACCEPT_WITH_CONTROLS
        : ResilienceDecision.ACCEPT;

    return {
      decision,
      approved: true,
      score,
      confidence:
        forecast.confidence,
      reasons:
        reasons.length > 0
          ? reasons
          : [
              "Simulation, recovery, and forecast checks passed.",
            ],
      controls:
        Array.from(controls),
      decidedAt:
        new Date().toISOString(),
    };
  }
}
