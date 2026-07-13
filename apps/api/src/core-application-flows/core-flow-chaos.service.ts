import { Injectable } from "@nestjs/common";

type ChaosExperiment = {
  id: string;
  name: string;
  mode: "latency" | "failure" | "timeout" | "throttle";
  probability: number;
  active: boolean;
  createdAt: string;
};

@Injectable()
export class CoreFlowChaosService {
  private readonly experiments = new Map<string, ChaosExperiment>();

  create(dto: any) {
    const experiment: ChaosExperiment = {
      id: `chaos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(dto?.name ?? "core-flow-chaos"),
      mode: ["latency", "failure", "timeout", "throttle"].includes(dto?.mode)
        ? dto.mode
        : "failure",
      probability: Math.min(Math.max(Number(dto?.probability ?? 0.1), 0), 1),
      active: Boolean(dto?.active ?? true),
      createdAt: new Date().toISOString(),
    };

    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  list() {
    return Array.from(this.experiments.values()).slice().reverse();
  }

  stop(id: string) {
    const experiment = this.experiments.get(id);
    if (!experiment) return null;
    experiment.active = false;
    return experiment;
  }

  evaluate(id: string) {
    const experiment = this.experiments.get(id);
    if (!experiment || !experiment.active) {
      return { injected: false };
    }

    return {
      injected: Math.random() < experiment.probability,
      mode: experiment.mode,
      experimentId: experiment.id,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
