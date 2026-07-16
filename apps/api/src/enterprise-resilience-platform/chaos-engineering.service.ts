import { Injectable } from "@nestjs/common";
import type { ChaosExperimentRecord } from "./enterprise-resilience.types";

@Injectable()
export class ChaosEngineeringService {
  private readonly experiments = new Map<string, ChaosExperimentRecord>();

  register(
    input: Omit<ChaosExperimentRecord, "id" | "createdAt"> & { id?: string },
  ): ChaosExperimentRecord {
    const experiment: ChaosExperimentRecord = {
      ...input,
      id:
        input.id ??
        `chaos-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };

    this.experiments.set(experiment.id, experiment);
    return { ...experiment };
  }

  evaluate(target: string) {
    const experiments = this.list().filter(
      (item) => item.enabled && item.target === target,
    );

    return {
      target,
      experiments,
      effects: experiments.map((item) => ({
        type: item.type,
        magnitude: item.magnitude,
      })),
    };
  }

  list(): ChaosExperimentRecord[] {
    return Array.from(this.experiments.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.experiments.size;
  }
}
