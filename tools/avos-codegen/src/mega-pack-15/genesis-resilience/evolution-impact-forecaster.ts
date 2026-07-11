import {
  EvolutionForecastInput,
  EvolutionImpactForecast,
} from "./contracts";

export class GenesisEvolutionImpactForecaster {
  forecast(
    input:
      EvolutionForecastInput,
  ): EvolutionImpactForecast {
    const benefits =
      input.proposedChanges.map(
        (change) =>
          `${change.key}: expected benefit ${change.expectedBenefit}`,
      );

    const risks =
      input.proposedChanges
        .filter(
          (change) =>
            change.expectedRisk >= 50,
        )
        .map(
          (change) =>
            `${change.key}: elevated risk ${change.expectedRisk}`,
        );

    const benefitAverage =
      input.proposedChanges.length === 0
        ? 0
        : input.proposedChanges.reduce(
            (total, change) =>
              total +
              change.expectedBenefit,
            0,
          ) /
          input.proposedChanges.length;

    const riskAverage =
      input.proposedChanges.length === 0
        ? 0
        : input.proposedChanges.reduce(
            (total, change) =>
              total +
              change.expectedRisk,
            0,
          ) /
          input.proposedChanges.length;

    const reversibilityAverage =
      input.proposedChanges.length === 0
        ? 100
        : input.proposedChanges.reduce(
            (total, change) =>
              total +
              change.reversibility,
            0,
          ) /
          input.proposedChanges.length;

    const projectedScore =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            input.currentScore +
              benefitAverage * 0.25 -
              riskAverage * 0.2,
          ),
        ),
      );

    const confidence =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            60 +
              reversibilityAverage * 0.25 -
              input.simulation
                .criticalFindings.length *
                8,
          ),
        ),
      );

    const requiredControls =
      new Set<string>();

    if (riskAverage >= 50) {
      requiredControls.add(
        "architecture-review",
      );
    }

    if (reversibilityAverage < 60) {
      requiredControls.add(
        "tested-rollback-plan",
      );
    }

    if (
      input.simulation.aggregateScore < 70
    ) {
      requiredControls.add(
        "resilience-remediation",
      );
    }

    return {
      systemKey:
        input.systemKey,
      projectedScore,
      confidence,
      risks,
      benefits,
      requiredControls:
        Array.from(
          requiredControls,
        ),
      forecastedAt:
        new Date().toISOString(),
    };
  }
}
