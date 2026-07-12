export interface SimulationScenario {
  key: string;
  loadMultiplier: number;
  failureProbability: number;
  costMultiplier: number;
  changeMagnitude: number;
}

export interface SimulationOutcome {
  scenarioKey: string;
  resilienceScore: number;
  performanceScore: number;
  costScore: number;
  riskScore: number;
  recommended: boolean;
}

export interface EnterpriseSimulationResult {
  outcomes: SimulationOutcome[];
  bestScenarioKey: string | null;
  simulatedAt: string;
}

export class EnterpriseSimulationEngine {
  simulate(
    scenarios: readonly SimulationScenario[],
  ): EnterpriseSimulationResult {
    const outcomes = scenarios.map((scenario): SimulationOutcome => {
      const resilienceScore = Math.max(
        0,
        Math.min(100, Math.round(100 - scenario.failureProbability)),
      );
      const performanceScore = Math.max(
        0,
        Math.min(100, Math.round(110 - scenario.loadMultiplier * 20)),
      );
      const costScore = Math.max(
        0,
        Math.min(100, Math.round(120 - scenario.costMultiplier * 25)),
      );
      const riskScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            scenario.failureProbability * 0.5 +
              scenario.changeMagnitude * 0.3 +
              scenario.loadMultiplier * 10,
          ),
        ),
      );

      return {
        scenarioKey: scenario.key,
        resilienceScore,
        performanceScore,
        costScore,
        riskScore,
        recommended: false,
      };
    });

    const ranked = [...outcomes].sort((a, b) => {
      const left =
        a.resilienceScore + a.performanceScore + a.costScore - a.riskScore;
      const right =
        b.resilienceScore + b.performanceScore + b.costScore - b.riskScore;
      return right - left;
    });

    const bestScenarioKey = ranked[0]?.scenarioKey ?? null;

    return {
      outcomes: outcomes.map((outcome) => ({
        ...outcome,
        recommended: outcome.scenarioKey === bestScenarioKey,
      })),
      bestScenarioKey,
      simulatedAt: new Date().toISOString(),
    };
  }
}
