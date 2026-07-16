import { Injectable, NotFoundException } from "@nestjs/common";
import { IntelligenceAgentRegistryV2Service } from "./intelligence-agent-registry-v2.service";
import type { IntelligencePlanV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class AutonomousPlanningV2Service {
  private readonly plans = new Map<string, IntelligencePlanV2>();

  constructor(private readonly agents: IntelligenceAgentRegistryV2Service) {}

  create(
    objective: string,
    steps: string[],
    agentIds: string[],
    context: Record<string, unknown> = {},
  ): IntelligencePlanV2 {
    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId);

      if (agent.status !== "ACTIVE") {
        throw new Error(`Intelligence agent '${agentId}' is not active.`);
      }
    }

    const now = new Date().toISOString();

    const plan: IntelligencePlanV2 = {
      id: `intelligence-plan-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      objective,
      status: "DRAFT",
      steps: [...steps],
      currentStep: steps[0],
      agentIds: [...agentIds],
      context: { ...context },
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return this.clone(plan);
  }

  start(id: string): IntelligencePlanV2 {
    const plan = this.requirePlan(id);
    plan.status = "ACTIVE";
    plan.updatedAt = new Date().toISOString();
    return this.clone(plan);
  }

  advance(id: string): IntelligencePlanV2 {
    const plan = this.requirePlan(id);
    const index = plan.currentStep ? plan.steps.indexOf(plan.currentStep) : -1;
    const nextStep = plan.steps[index + 1];

    if (nextStep) {
      plan.currentStep = nextStep;
      plan.status = "ACTIVE";
    } else {
      plan.currentStep = undefined;
      plan.status = "COMPLETED";
    }

    plan.updatedAt = new Date().toISOString();
    return this.clone(plan);
  }

  fail(id: string, error: string): IntelligencePlanV2 {
    const plan = this.requirePlan(id);
    plan.status = "FAILED";
    plan.error = error;
    plan.updatedAt = new Date().toISOString();
    return this.clone(plan);
  }

  get(id: string): IntelligencePlanV2 {
    return this.clone(this.requirePlan(id));
  }

  list(): IntelligencePlanV2[] {
    return Array.from(this.plans.values()).map((plan) => this.clone(plan));
  }

  count(): number {
    return this.plans.size;
  }

  activeCount(): number {
    return this.list().filter((plan) => plan.status === "ACTIVE").length;
  }

  failedCount(): number {
    return this.list().filter((plan) => plan.status === "FAILED").length;
  }

  private requirePlan(id: string): IntelligencePlanV2 {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Intelligence plan '${id}' was not found.`);
    }

    return plan;
  }

  private clone(plan: IntelligencePlanV2): IntelligencePlanV2 {
    return {
      ...plan,
      steps: [...plan.steps],
      agentIds: [...plan.agentIds],
      context: { ...plan.context },
    };
  }
}
