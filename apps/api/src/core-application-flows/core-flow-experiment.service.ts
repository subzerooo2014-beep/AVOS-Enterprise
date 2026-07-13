import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowExperiment } from "./core-flow-autonomy.types";

@Injectable()
export class CoreFlowExperimentService {
  private readonly experiments = new Map<string, FlowExperiment>();

  create(dto: any) {
    const experiment: FlowExperiment = {
      id: `experiment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      hypothesis: String(dto?.hypothesis ?? "Optimization will improve outcomes."),
      variants: Array.isArray(dto?.variants) ? dto.variants.map(String) : ["control", "variant-a"],
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  findAll() { return Array.from(this.experiments.values()).slice().reverse(); }

  findOne(id: string) {
    const experiment = this.experiments.get(id);
    if (!experiment) throw new NotFoundException("Flow experiment not found");
    return experiment;
  }

  start(id: string) {
    const experiment = this.findOne(id);
    experiment.status = "running";
    return experiment;
  }

  complete(id: string, winner: string) {
    const experiment = this.findOne(id);
    experiment.status = "completed";
    experiment.winner = winner;
    experiment.completedAt = new Date().toISOString();
    return experiment;
  }

  cancel(id: string) {
    const experiment = this.findOne(id);
    experiment.status = "cancelled";
    experiment.completedAt = new Date().toISOString();
    return experiment;
  }
}
