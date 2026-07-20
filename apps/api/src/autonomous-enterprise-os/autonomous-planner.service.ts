import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AeosPlan } from "./aeos.contracts";
import { EnterpriseGoalManagerService } from "./enterprise-goal-manager.service";

@Injectable()
export class AutonomousPlannerService {
  private readonly plans = new Map<string, AeosPlan[]>();

  constructor(private readonly goals: EnterpriseGoalManagerService) {}

  generate(goalId: string) {
    const goal = this.goals.get(goalId);
    const previous = this.plans.get(goalId) ?? [];

    const steps: AeosPlan["steps"] = [
      {
        id: "aeos-step:" + randomUUID(),
        name: "Analyze enterprise context",
        targetUnit: "knowledge-fabric",
        action: "enterprise.context.analyze",
        dependencies: [],
        estimatedCost: 10,
        estimatedValue: 20,
        risk: "low" as const,
        requiresHumanApproval: false,
      },
      {
        id: "aeos-step:" + randomUUID(),
        name: "Generate decision alternatives",
        targetUnit: "intelligence-fabric",
        action: "enterprise.options.generate",
        dependencies: [],
        estimatedCost: 15,
        estimatedValue: 35,
        risk: "medium" as const,
        requiresHumanApproval: false,
      },
      {
        id: "aeos-step:" + randomUUID(),
        name: "Coordinate capability execution",
        targetUnit: "capability-fabric",
        action: "enterprise.capabilities.coordinate",
        dependencies: [],
        estimatedCost: 25,
        estimatedValue: 55,
        risk: "medium" as const,
        requiresHumanApproval: true,
      },
      {
        id: "aeos-step:" + randomUUID(),
        name: "Execute approved enterprise action",
        targetUnit: "execution-core",
        action: "enterprise.action.execute",
        dependencies: [],
        estimatedCost: 35,
        estimatedValue: 80,
        risk: "high" as const,
        requiresHumanApproval: true,
      },
    ];

    for (let index = 1; index < steps.length; index += 1) {
      steps[index].dependencies.push(steps[index - 1].id);
    }

    const plan: AeosPlan = {
      id: "aeos-plan:" + randomUUID(),
      goalId,
      version: previous.length + 1,
      status: "proposed",
      steps,
      score: this.score(steps),
      createdAt: new Date().toISOString(),
    };

    this.plans.set(goalId, [...previous, plan]);
    return { goal, plan };
  }

  approve(planId: string, approvedBy: string) {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Plan approval requires Human Final Authority.");
    }

    const plan = this.find(planId);
    plan.status = "approved";
    return plan;
  }

  find(planId: string) {
    for (const plans of this.plans.values()) {
      const plan = plans.find((item) => item.id === planId);
      if (plan) return plan;
    }
    throw new Error("AEOS plan not found: " + planId);
  }

  list() {
    return [...this.plans.values()].flat();
  }

  private score(steps: AeosPlan["steps"]) {
    const value = steps.reduce((sum, step) => sum + step.estimatedValue, 0);
    const cost = steps.reduce((sum, step) => sum + step.estimatedCost, 0);
    return Math.max(0, Math.min(100, Math.round(value - cost / 2)));
  }
}