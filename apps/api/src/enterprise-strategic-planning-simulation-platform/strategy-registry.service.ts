import { Injectable, NotFoundException } from "@nestjs/common";
import type { StrategicPlanRecord } from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class StrategyRegistryService {
  private readonly plans = new Map<string, StrategicPlanRecord>();

  upsert(
    input: Omit<StrategicPlanRecord, "createdAt" | "updatedAt">,
  ): StrategicPlanRecord {
    const existing = this.plans.get(input.id);
    const now = new Date().toISOString();

    const plan: StrategicPlanRecord = {
      ...input,
      priorities: [...input.priorities],
      assumptions: { ...input.assumptions },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return this.clone(plan);
  }

  get(id: string): StrategicPlanRecord {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Strategic plan '${id}' was not found.`);
    }

    return this.clone(plan);
  }

  list(): StrategicPlanRecord[] {
    return Array.from(this.plans.values()).map((plan) => this.clone(plan));
  }

  count(): number {
    return this.plans.size;
  }

  activeCount(): number {
    return this.list().filter((plan) => plan.status === "ACTIVE").length;
  }

  private clone(plan: StrategicPlanRecord): StrategicPlanRecord {
    return {
      ...plan,
      priorities: [...plan.priorities],
      assumptions: { ...plan.assumptions },
    };
  }
}
