import { Injectable } from "@nestjs/common";
import type { FlowSimulation } from "./core-flow-federation.types";

@Injectable()
export class CoreFlowSimulationService {
  private readonly simulations = new Map<string, FlowSimulation>();

  run(flow: string, dto: any = {}) {
    const assumptions = dto?.assumptions ?? {};
    const volume = Number(assumptions.volume ?? 100);
    const failureRate = Math.min(Math.max(Number(assumptions.failureRate ?? 0.01), 0), 1);
    const durationMs = Math.max(Number(assumptions.durationMs ?? 1000), 1);
    const parallelism = Math.max(Number(assumptions.parallelism ?? 1), 1);

    const successfulExecutions = Math.round(volume * (1 - failureRate));
    const failedExecutions = volume - successfulExecutions;
    const projectedDurationMs = Math.round((volume * durationMs) / parallelism);
    const projectedThroughput = Number(
      ((successfulExecutions / projectedDurationMs) * 1000).toFixed(4),
    );

    const simulation: FlowSimulation = {
      id: `simulation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      scenario: String(dto?.scenario ?? "baseline"),
      assumptions,
      result: {
        volume,
        successfulExecutions,
        failedExecutions,
        projectedDurationMs,
        projectedThroughput,
        projectedSuccessRate: Number(((successfulExecutions / Math.max(volume, 1)) * 100).toFixed(2)),
      },
      status: "completed",
      executedAt: new Date().toISOString(),
    };

    this.simulations.set(simulation.id, simulation);
    return simulation;
  }

  findAll(flow?: string) {
    return Array.from(this.simulations.values())
      .filter((simulation) => !flow || simulation.flow === flow)
      .slice()
      .reverse();
  }

  compare(ids: string[]) {
    const simulations = ids
      .map((id) => this.simulations.get(id))
      .filter((item): item is FlowSimulation => Boolean(item));

    return {
      simulations,
      best: simulations
        .slice()
        .sort(
          (a, b) =>
            Number(b.result.projectedSuccessRate ?? 0) -
              Number(a.result.projectedSuccessRate ?? 0) ||
            Number(a.result.projectedDurationMs ?? 0) -
              Number(b.result.projectedDurationMs ?? 0),
        )[0] ?? null,
      comparedAt: new Date().toISOString(),
    };
  }
}
