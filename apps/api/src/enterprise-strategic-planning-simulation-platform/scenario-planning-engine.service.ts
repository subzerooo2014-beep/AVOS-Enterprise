import { Injectable, NotFoundException } from "@nestjs/common";
import { StrategyRegistryService } from "./strategy-registry.service";
import type {
  StrategicForecastRecord,
  StrategicScenarioRecord,
} from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class ScenarioPlanningEngineService {
  private readonly scenarios = new Map<string, StrategicScenarioRecord>();
  private readonly forecasts: StrategicForecastRecord[] = [];

  constructor(private readonly strategies: StrategyRegistryService) {}

  createScenario(
    planId: string,
    name: string,
    variables: Record<string, number>,
    probability: number,
  ): StrategicScenarioRecord {
    this.strategies.get(planId);

    const scenario: StrategicScenarioRecord = {
      id: `strategic-scenario-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      planId,
      name,
      variables: { ...variables },
      probability,
      createdAt: new Date().toISOString(),
    };

    this.scenarios.set(scenario.id, scenario);
    return this.cloneScenario(scenario);
  }

  forecast(
    scenarioId: string,
    confidence: number,
  ): StrategicForecastRecord {
    const scenario = this.scenarios.get(scenarioId);

    if (!scenario) {
      throw new NotFoundException(
        `Strategic scenario '${scenarioId}' was not found.`,
      );
    }

    const revenueImpact = scenario.variables["revenueGrowth"] ?? 0;
    const costImpact = scenario.variables["costGrowth"] ?? 0;
    const growthImpact = scenario.variables["marketGrowth"] ?? 0;
    const volatility = Math.abs(
      scenario.variables["volatility"] ?? 0,
    );

    const riskScore = Math.max(
      0,
      Math.min(100, volatility + Math.max(0, costImpact - revenueImpact)),
    );

    const forecast: StrategicForecastRecord = {
      id: `strategic-forecast-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      planId: scenario.planId,
      scenarioId,
      revenueImpact,
      costImpact,
      growthImpact,
      riskScore,
      confidence,
      createdAt: new Date().toISOString(),
    };

    this.forecasts.unshift(forecast);
    return { ...forecast };
  }

  scenariosList(): StrategicScenarioRecord[] {
    return Array.from(this.scenarios.values()).map((scenario) =>
      this.cloneScenario(scenario),
    );
  }

  forecastsList(): StrategicForecastRecord[] {
    return this.forecasts.map((forecast) => ({ ...forecast }));
  }

  scenarioCount(): number {
    return this.scenarios.size;
  }

  forecastCount(): number {
    return this.forecasts.length;
  }

  private cloneScenario(
    scenario: StrategicScenarioRecord,
  ): StrategicScenarioRecord {
    return {
      ...scenario,
      variables: { ...scenario.variables },
    };
  }
}
