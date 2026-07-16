import { Injectable, NotFoundException } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import type {
  TwinScenarioRecord,
  TwinSimulationResultRecord,
} from "./enterprise-advanced-digital-twin.types";

@Injectable()
export class TwinScenarioLaboratoryService {
  private readonly scenarios = new Map<string, TwinScenarioRecord>();
  private readonly simulations: TwinSimulationResultRecord[] = [];

  constructor(private readonly twins: AdvancedTwinRegistryService) {}

  createScenario(
    twinId: string,
    name: string,
    assumptions: Record<string, unknown>,
  ): TwinScenarioRecord {
    this.twins.get(twinId);

    const scenario: TwinScenarioRecord = {
      id: `twin-scenario-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      name,
      assumptions: { ...assumptions },
      createdAt: new Date().toISOString(),
    };

    this.scenarios.set(scenario.id, scenario);
    return this.cloneScenario(scenario);
  }

  simulate(
    scenarioId: string,
    runtimeInputs: Record<string, unknown> = {},
  ): TwinSimulationResultRecord {
    const scenario = this.scenarios.get(scenarioId);

    if (!scenario) {
      throw new NotFoundException(`Twin scenario '${scenarioId}' was not found.`);
    }

    const twin = this.twins.get(scenario.twinId);
    const combined = {
      ...twin.state,
      ...scenario.assumptions,
      ...runtimeInputs,
    };

    const numericValues = Object.values(combined).filter(
      (value): value is number => typeof value === "number",
    );

    const average =
      numericValues.length === 0
        ? 50
        : numericValues.reduce((total, value) => total + value, 0) /
          numericValues.length;

    const score = Math.max(0, Math.min(100, average));
    const risk = Math.max(0, Math.min(100, 100 - score));
    const impact = Math.max(0, Math.min(100, score * 0.8));

    const result: TwinSimulationResultRecord = {
      id: `twin-simulation-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId: scenario.twinId,
      scenarioId,
      score,
      risk,
      impact,
      outputs: {
        projectedState: combined,
        projectedHealth:
          score >= 70 ? "HEALTHY" : score >= 40 ? "DEGRADED" : "UNHEALTHY",
      },
      simulatedAt: new Date().toISOString(),
    };

    this.simulations.unshift(result);
    return this.cloneSimulation(result);
  }

  scenariosList(): TwinScenarioRecord[] {
    return Array.from(this.scenarios.values()).map((scenario) =>
      this.cloneScenario(scenario),
    );
  }

  simulationsList(): TwinSimulationResultRecord[] {
    return this.simulations.map((result) => this.cloneSimulation(result));
  }

  scenarioCount(): number {
    return this.scenarios.size;
  }

  simulationCount(): number {
    return this.simulations.length;
  }

  private cloneScenario(scenario: TwinScenarioRecord): TwinScenarioRecord {
    return {
      ...scenario,
      assumptions: { ...scenario.assumptions },
    };
  }

  private cloneSimulation(
    result: TwinSimulationResultRecord,
  ): TwinSimulationResultRecord {
    return {
      ...result,
      outputs: { ...result.outputs },
    };
  }
}
