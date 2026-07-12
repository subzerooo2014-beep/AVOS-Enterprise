export interface MultiverseScenario {
  key: string;
  growth: number;
  resilience: number;
  governance: number;
  risk: number;
  cost: number;
}

export interface MultiverseOutcome {
  scenarioKey: string;
  score: number;
  recommended: boolean;
}

export interface StrategicMultiverseSimulationResult {
  outcomes: MultiverseOutcome[];
  bestScenarioKey: string | null;
  multiverseScore: number;
  simulatedAt: string;
}

export class StrategicMultiverseSimulator {
  simulate(
    scenarios: readonly MultiverseScenario[],
  ): StrategicMultiverseSimulationResult {
    const outcomes = scenarios.map((scenario): MultiverseOutcome => ({
      scenarioKey: scenario.key,
      score: Math.max(
        0,
        Math.min(
          100,
          Math.round(
            scenario.growth * 0.3 +
              scenario.resilience * 0.3 +
              scenario.governance * 0.2 +
              Math.max(0, 100 - scenario.risk) * 0.15 +
              Math.max(0, 100 - scenario.cost) * 0.05,
          ),
        ),
      ),
      recommended: false,
    }));

    const ranked = [...outcomes].sort((a, b) => b.score - a.score);
    const bestScenarioKey = ranked[0]?.scenarioKey ?? null;

    return {
      outcomes: outcomes.map((outcome) => ({
        ...outcome,
        recommended: outcome.scenarioKey === bestScenarioKey,
      })),
      bestScenarioKey,
      multiverseScore: ranked[0]?.score ?? 0,
      simulatedAt: new Date().toISOString(),
    };
  }
}
