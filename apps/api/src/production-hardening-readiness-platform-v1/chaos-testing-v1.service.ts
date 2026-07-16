import { Injectable, NotFoundException } from "@nestjs/common";
import type { ChaosExperimentV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class ChaosTestingV1Service {
  private readonly experiments = new Map<string, ChaosExperimentV1>();

  plan(
    name: string,
    faultType: ChaosExperimentV1["faultType"],
    target: string,
  ): ChaosExperimentV1 {
    const experiment: ChaosExperimentV1 = {
      id: `chaos-experiment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      faultType,
      target,
      status: "PLANNED",
      resilienceScore: 0,
      findings: [],
      createdAt: new Date().toISOString(),
    };

    this.experiments.set(experiment.id, experiment);
    return this.clone(experiment);
  }

  execute(
    id: string,
    recovered: boolean,
    recoverySeconds: number,
  ): ChaosExperimentV1 {
    const experiment = this.experiments.get(id);

    if (!experiment) {
      throw new NotFoundException(`Chaos experiment '${id}' was not found.`);
    }

    experiment.status = "RUNNING";
    experiment.resilienceScore = recovered
      ? Math.max(50, 100 - Math.min(50, recoverySeconds))
      : 0;

    experiment.findings = recovered
      ? [`Recovered in ${recoverySeconds} seconds.`]
      : ["System did not recover from injected fault."];

    experiment.status = recovered ? "COMPLETED" : "FAILED";
    experiment.completedAt = new Date().toISOString();

    return this.clone(experiment);
  }

  list(): ChaosExperimentV1[] {
    return Array.from(this.experiments.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.experiments.size;
  }

  passedCount(): number {
    return this.list().filter(
      (item) => item.status === "COMPLETED" && item.resilienceScore >= 70,
    ).length;
  }

  private clone(item: ChaosExperimentV1): ChaosExperimentV1 {
    return { ...item, findings: [...item.findings] };
  }
}
