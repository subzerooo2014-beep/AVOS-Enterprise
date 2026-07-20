import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpPlan } from "../contracts/agp-strategy.contracts";
import { AgpEventBusService } from "../events/agp-event-bus.service";

@Injectable()
export class AgpPlanningService {
  private readonly plans = new Map<string, AgpPlan>();

  constructor(private readonly events: AgpEventBusService) {}

  create(input: Omit<AgpPlan, "id" | "status" | "createdAt">): AgpPlan {
    const plan: AgpPlan = {
      ...input,
      id: `agp-plan:${randomUUID()}`,
      milestones: [...input.milestones],
      resources: { ...input.resources },
      dependencies: [...input.dependencies],
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    this.plans.set(plan.id, plan);
    this.events.publish("agp.plan.created", plan, {
      aggregateId: plan.id,
    });

    return this.clone(plan);
  }

  approve(planId: string, approvedBy: string): AgpPlan {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new NotFoundException(`Plan not found: ${planId}`);
    }

    plan.status = "approved";
    this.events.publish(
      "agp.plan.approved",
      { planId, approvedBy },
      { aggregateId: planId },
    );

    return this.clone(plan);
  }

  list(): AgpPlan[] {
    return [...this.plans.values()].map((plan) => this.clone(plan));
  }

  private clone(plan: AgpPlan): AgpPlan {
    return JSON.parse(JSON.stringify(plan)) as AgpPlan;
  }
}