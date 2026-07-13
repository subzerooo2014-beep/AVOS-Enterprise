import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowRollbackPlan } from "./core-flow-change.types";

@Injectable()
export class CoreFlowRollbackPlanService {
  private readonly plans = new Map<string, FlowRollbackPlan>();

  create(changeId: string, actions: string[]) {
    const plan: FlowRollbackPlan = {
      id: `rollback_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      changeId,
      actions: Array.isArray(actions) ? actions.map(String) : [],
      tested: false,
      createdAt: new Date().toISOString(),
    };
    this.plans.set(plan.id, plan);
    return plan;
  }

  findAll(changeId?: string) {
    return Array.from(this.plans.values())
      .filter((item) => !changeId || item.changeId === changeId)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const plan = this.plans.get(id);
    if (!plan) throw new NotFoundException("Rollback plan not found");
    return plan;
  }

  test(id: string) {
    const plan = this.findOne(id);
    plan.tested = plan.actions.length > 0;
    plan.testedAt = new Date().toISOString();
    return plan;
  }
}
