import { Injectable } from '@nestjs/common';
import { StrategyScenario } from './enterprise-strategic-governance.types';

@Injectable()
export class StrategySimulationEngineService {
  simulate(scenarios: StrategyScenario[]) {
    const results = scenarios
      .map((scenario) => {
        const assumptionImpact = Object.values(scenario.assumptions).reduce(
          (sum, value) => sum + value,
          0,
        );

        const adjustedValue =
          scenario.expectedValue +
          assumptionImpact * scenario.confidence -
          scenario.riskScore;

        return {
          ...scenario,
          adjustedValue: Math.round(adjustedValue),
          viability:
            adjustedValue >= 75
              ? 'high'
              : adjustedValue >= 50
                ? 'medium'
                : 'low',
        };
      })
      .sort((left, right) => right.adjustedValue - left.adjustedValue);

    return {
      results,
      recommendedScenario: results[0] ?? null,
    };
  }
}