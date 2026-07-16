import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationBootstrapStepV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationBootstrapOrchestratorV1Service {
  private readonly steps = new Map<string, FoundationBootstrapStepV1>();

  register(
    id: string,
    name: string,
    order: number,
    dependencies: string[] = [],
  ): FoundationBootstrapStepV1 {
    const step: FoundationBootstrapStepV1 = {
      id,
      name,
      order,
      status: "PENDING",
      dependencies: [...dependencies],
    };

    this.steps.set(step.id, step);
    return this.clone(step);
  }

  run(id: string): FoundationBootstrapStepV1 {
    const step = this.requireStep(id);

    const incompleteDependencies = step.dependencies.filter((dependencyId) => {
      const dependency = this.steps.get(dependencyId);
      return !dependency || dependency.status !== "COMPLETED";
    });

    if (incompleteDependencies.length > 0) {
      step.status = "FAILED";
      step.error = `Incomplete dependencies: ${incompleteDependencies.join(", ")}`;
      return this.clone(step);
    }

    step.status = "RUNNING";
    step.startedAt = new Date().toISOString();
    step.status = "COMPLETED";
    step.completedAt = new Date().toISOString();

    return this.clone(step);
  }

  runAll(): FoundationBootstrapStepV1[] {
    return this.list()
      .sort((left, right) => left.order - right.order)
      .map((step) => this.run(step.id));
  }

  list(): FoundationBootstrapStepV1[] {
    return Array.from(this.steps.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.steps.size;
  }

  completedCount(): number {
    return this.list().filter((item) => item.status === "COMPLETED").length;
  }

  private requireStep(id: string): FoundationBootstrapStepV1 {
    const step = this.steps.get(id);

    if (!step) {
      throw new NotFoundException(`Bootstrap step '${id}' was not found.`);
    }

    return step;
  }

  private clone(item: FoundationBootstrapStepV1): FoundationBootstrapStepV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
    };
  }
}
