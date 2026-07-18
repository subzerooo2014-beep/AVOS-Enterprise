import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RecoveryPlan,
  RootCauseAnalysis,
} from "./factory-knowledge.contracts";

@Injectable()
export class AutonomousFactoryRecoveryService {
  private readonly plans = new Map<string, RecoveryPlan>();

  createPlan(analysis: RootCauseAnalysis): RecoveryPlan {
    const now = new Date().toISOString();
    const plan: RecoveryPlan = {
      id: randomUUID(),
      workItemId: analysis.workItemId,
      status: "awaiting-approval",
      actions: analysis.recommendedRecovery,
      requiresHumanApproval: true,
      executionLog: ["Recovery plan created from root cause analysis."],
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return structuredClone(plan);
  }

  approve(id: string, approvedBy: string): RecoveryPlan {
    const plan = this.requirePlan(id);
    if (!approvedBy?.trim()) {
      throw new BadRequestException(
        "Human Final Authority is required for autonomous recovery.",
      );
    }

    plan.approvedBy = approvedBy.trim();
    plan.status = "approved";
    plan.updatedAt = new Date().toISOString();
    plan.executionLog.push(`Approved by ${plan.approvedBy}.`);
    return structuredClone(plan);
  }

  execute(id: string): RecoveryPlan {
    const plan = this.requirePlan(id);
    if (!plan.approvedBy || plan.status !== "approved") {
      throw new BadRequestException(
        "Recovery execution is blocked until human approval is recorded.",
      );
    }

    plan.status = "executing";
    plan.executionLog.push("Recovery execution started.");
    for (const action of plan.actions) {
      plan.executionLog.push(`Executed: ${action}`);
    }
    plan.status = "completed";
    plan.updatedAt = new Date().toISOString();
    plan.executionLog.push("Recovery execution completed.");
    return structuredClone(plan);
  }

  all(): RecoveryPlan[] {
    return structuredClone([...this.plans.values()]);
  }

  count(): number {
    return this.plans.size;
  }

  private requirePlan(id: string): RecoveryPlan {
    const plan = this.plans.get(id);
    if (!plan) {
      throw new BadRequestException(`Recovery plan ${id} was not found.`);
    }
    return plan;
  }
}
