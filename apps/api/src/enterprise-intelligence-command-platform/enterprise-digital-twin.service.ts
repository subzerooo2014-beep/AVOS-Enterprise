import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  DigitalTwinRecord,
  TwinSimulationRecord,
} from "./enterprise-intelligence-command.types";

@Injectable()
export class EnterpriseDigitalTwinService {
  private readonly twins = new Map<string, DigitalTwinRecord>();
  private readonly simulations: TwinSimulationRecord[] = [];

  upsertTwin(
    input: Omit<DigitalTwinRecord, "version" | "createdAt" | "updatedAt">,
  ): DigitalTwinRecord {
    const existing = this.twins.get(input.id);
    const now = new Date().toISOString();

    const twin: DigitalTwinRecord = {
      ...input,
      state: { ...input.state },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.twins.set(twin.id, twin);
    return this.cloneTwin(twin);
  }

  simulate(
    twinId: string,
    scenario: string,
    inputs: Record<string, unknown>,
  ): TwinSimulationRecord {
    const twin = this.requireTwin(twinId);

    const numericInputs = Object.values(inputs).filter(
      (value): value is number => typeof value === "number",
    );

    const score =
      numericInputs.length === 0
        ? 50
        : Math.max(
            0,
            Math.min(
              100,
              numericInputs.reduce((total, value) => total + value, 0) /
                numericInputs.length,
            ),
          );

    const simulation: TwinSimulationRecord = {
      id: `twin-simulation-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      scenario,
      inputs: { ...inputs },
      outputs: {
        projectedHealth:
          score >= 70
            ? "HEALTHY"
            : score >= 40
              ? "DEGRADED"
              : "UNHEALTHY",
        sourceTwinHealth: twin.health,
      },
      score,
      simulatedAt: new Date().toISOString(),
    };

    this.simulations.unshift(simulation);
    return this.cloneSimulation(simulation);
  }

  listTwins(): DigitalTwinRecord[] {
    return Array.from(this.twins.values()).map((item) => this.cloneTwin(item));
  }

  listSimulations(): TwinSimulationRecord[] {
    return this.simulations.map((item) => this.cloneSimulation(item));
  }

  twinCount(): number {
    return this.twins.size;
  }

  simulationCount(): number {
    return this.simulations.length;
  }

  private requireTwin(id: string): DigitalTwinRecord {
    const twin = this.twins.get(id);

    if (!twin) {
      throw new NotFoundException(`Digital twin '${id}' was not found.`);
    }

    return twin;
  }

  private cloneTwin(item: DigitalTwinRecord): DigitalTwinRecord {
    return { ...item, state: { ...item.state } };
  }

  private cloneSimulation(item: TwinSimulationRecord): TwinSimulationRecord {
    return {
      ...item,
      inputs: { ...item.inputs },
      outputs: { ...item.outputs },
    };
  }
}
