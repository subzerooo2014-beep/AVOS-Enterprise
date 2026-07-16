import { Injectable } from "@nestjs/common";
import { ScenarioPlanningEngineService } from "./scenario-planning-engine.service";
import type { StrategicRiskSimulationRecord } from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class StrategicRiskSimulationService {
  private readonly simulations: StrategicRiskSimulationRecord[] = [];

  constructor(
    private readonly scenarios: ScenarioPlanningEngineService,
  ) {}

  simulate(
    scenarioId: string,
    downsideFactor: number,
    upsideFactor: number,
  ): StrategicRiskSimulationRecord {
    const scenario = this.scenarios
      .scenariosList()
      .find((item) => item.id === scenarioId);

    if (!scenario) {
      throw new Error(`Strategic scenario '${scenarioId}' was not found.`);
    }

    const baseValues = Object.values(scenario.variables);
    const average =
      baseValues.length === 0
        ? 50
        : baseValues.reduce((total, value) => total + value, 0) /
          baseValues.length;

    const downsideScore = Math.max(
      0,
      Math.min(100, 100 - average * downsideFactor),
    );

    const upsideScore = Math.max(
      0,
      Math.min(100, average * upsideFactor),
    );

    const resilienceScore = Math.max(
      0,
      Math.min(
        100,
        100 - downsideScore * 0.5 + upsideScore * 0.5,
      ),
    );

    const findings: string[] = [];

    if (downsideScore > 60) {
      findings.push("Downside exposure is elevated.");
    }

    if (resilienceScore < 50) {
      findings.push("Strategic resilience requires improvement.");
    }

    if (findings.length === 0) {
      findings.push("Scenario remains within acceptable strategic limits.");
    }

    const simulation: StrategicRiskSimulationRecord = {
      id: `strategic-risk-simulation-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      planId: scenario.planId,
      scenarioId,
      downsideScore,
      upsideScore,
      resilienceScore,
      findings,
      simulatedAt: new Date().toISOString(),
    };

    this.simulations.unshift(simulation);
    return this.clone(simulation);
  }

  list(): StrategicRiskSimulationRecord[] {
    return this.simulations.map((item) => this.clone(item));
  }

  count(): number {
    return this.simulations.length;
  }

  private clone(
    item: StrategicRiskSimulationRecord,
  ): StrategicRiskSimulationRecord {
    return {
      ...item,
      findings: [...item.findings],
    };
  }
}
