import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityDependencyPlan
} from "./capability-production.contracts";

@Injectable()
export class CapabilityDependencyPlannerService {
  private readonly items = new Map<string, CapabilityDependencyPlan>();

  plan(blueprint: CapabilityBlueprint): CapabilityDependencyPlan {
    const uniqueDependencies = [...new Set(blueprint.dependencies)];
    const unresolvedDependencies = uniqueDependencies.filter(
      (dependency) => dependency.trim().length === 0
    );

    const item: CapabilityDependencyPlan = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      orderedDependencies: uniqueDependencies.filter(Boolean).sort(),
      unresolvedDependencies,
      hasCycle: uniqueDependencies.includes(blueprint.name),
      generatedAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilityDependencyPlan[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
