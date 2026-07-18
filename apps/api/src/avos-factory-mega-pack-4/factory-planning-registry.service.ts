import { Injectable } from "@nestjs/common";
import { FactoryManufacturingPlan } from "./factory-planning.contracts";

@Injectable()
export class FactoryPlanningRegistryService {
  private readonly plans = new Map<string, FactoryManufacturingPlan>();

  save(plan: FactoryManufacturingPlan): FactoryManufacturingPlan {
    const copy = structuredClone(plan);
    this.plans.set(copy.id, copy);
    return structuredClone(copy);
  }

  findById(id: string): FactoryManufacturingPlan | undefined {
    const plan = this.plans.get(id);
    return plan ? structuredClone(plan) : undefined;
  }

  list(): FactoryManufacturingPlan[] {
    return [...this.plans.values()].map((plan) => structuredClone(plan));
  }

  count(): number {
    return this.plans.size;
  }
}
