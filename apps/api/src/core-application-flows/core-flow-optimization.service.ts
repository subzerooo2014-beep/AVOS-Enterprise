import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowOptimizationPlan } from "./core-flow-intelligence.types";

@Injectable()
export class CoreFlowOptimizationService {
  private readonly plans = new Map<string, FlowOptimizationPlan>();

  create(flow: string, objective: string, signals: any = {}) {
    const actions: string[] = [];

    if (Number(signals.durationMs ?? 0) > Number(signals.targetMs ?? 0)) {
      actions.push("parallelize-independent-nodes");
      actions.push("cache-stable-dependencies");
    }

    if (Number(signals.failureRate ?? 0) > 0.05) {
      actions.push("review-circuit-breaker-thresholds");
      actions.push("strengthen-compensation-paths");
    }

    if (Number(signals.cost ?? 0) > Number(signals.costTarget ?? 0)) {
      actions.push("reduce-resource-units");
      actions.push("apply-batch-processing");
    }

    if (actions.length === 0) {
      actions.push("maintain-current-profile");
    }

    const expectedImprovementPercent = Math.min(
      40,
      5 + actions.length * 6,
    );

    const plan: FlowOptimizationPlan = {
      id: `optimization_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      objective,
      actions,
      expectedImprovementPercent,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  findAll() {
    return Array.from(this.plans.values()).slice().reverse();
  }

  findOne(id: string) {
    const plan = this.plans.get(id);
    if (!plan) throw new NotFoundException("Optimization plan not found");
    return plan;
  }

  approve(id: string) {
    const plan = this.findOne(id);
    plan.status = "approved";
    return plan;
  }

  execute(id: string) {
    const plan = this.findOne(id);
    plan.status = "executed";
    return {
      plan,
      actionsExecuted: plan.actions.length,
      executedAt: new Date().toISOString(),
    };
  }
}
