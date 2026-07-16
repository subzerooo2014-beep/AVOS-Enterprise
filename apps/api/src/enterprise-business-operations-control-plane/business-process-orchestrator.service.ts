import { Injectable, NotFoundException } from "@nestjs/common";
import { BusinessRulesCenterService } from "./business-rules-center.service";
import type { BusinessProcessRecord } from "./enterprise-business-operations.types";

@Injectable()
export class BusinessProcessOrchestratorService {
  private readonly processes = new Map<string, BusinessProcessRecord>();

  constructor(private readonly rules: BusinessRulesCenterService) {}

  start(
    name: string,
    domain: string,
    steps: string[],
    context: Record<string, unknown> = {},
  ): BusinessProcessRecord {
    const now = new Date().toISOString();
    const matchedRules = this.rules.evaluate(domain, context);

    const process: BusinessProcessRecord = {
      id: `business-process-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      name,
      domain,
      status: steps.length > 0 ? "RUNNING" : "COMPLETED",
      currentStep: steps[0],
      steps: [...steps],
      context: {
        ...context,
        matchedRuleIds: matchedRules.map((rule) => rule.id),
      },
      createdAt: now,
      updatedAt: now,
      completedAt: steps.length === 0 ? now : undefined,
    };

    this.processes.set(process.id, process);
    return this.clone(process);
  }

  advance(id: string): BusinessProcessRecord {
    const process = this.get(id);
    const currentIndex = process.currentStep
      ? process.steps.indexOf(process.currentStep)
      : -1;

    const nextStep = process.steps[currentIndex + 1];

    if (!nextStep) {
      process.status = "COMPLETED";
      process.currentStep = undefined;
      process.completedAt = new Date().toISOString();
    } else {
      process.status = "RUNNING";
      process.currentStep = nextStep;
    }

    process.updatedAt = new Date().toISOString();
    this.processes.set(process.id, process);

    return this.clone(process);
  }

  fail(id: string, error: string): BusinessProcessRecord {
    const process = this.get(id);
    process.status = "FAILED";
    process.error = error;
    process.updatedAt = new Date().toISOString();
    this.processes.set(process.id, process);
    return this.clone(process);
  }

  get(id: string): BusinessProcessRecord {
    const process = this.processes.get(id);
    if (!process) {
      throw new NotFoundException(`Business process '${id}' was not found.`);
    }

    return this.clone(process);
  }

  list(): BusinessProcessRecord[] {
    return Array.from(this.processes.values())
      .map((item) => this.clone(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  count(): number {
    return this.processes.size;
  }

  private clone(item: BusinessProcessRecord): BusinessProcessRecord {
    return {
      ...item,
      steps: [...item.steps],
      context: { ...item.context },
    };
  }
}
