import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { DisasterRecoveryPlan } from "./global-production-os.types";

@Injectable()
export class DisasterRecoveryGridService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  createPlan(
    primaryFactoryId: string,
    recoveryFactoryIds: string[],
    rpoMinutes = 5,
    rtoMinutes = 15
  ): DisasterRecoveryPlan {
    const plan: DisasterRecoveryPlan = {
      id: this.store.nextId("disaster-recovery"),
      primaryFactoryId,
      recoveryFactoryIds,
      recoveryPointObjectiveMinutes: rpoMinutes,
      recoveryTimeObjectiveMinutes: rtoMinutes,
      status: "ready",
      lastTestedAt: this.store.now()
    };
    this.store.recoveryPlans.set(plan.id, plan);
    return plan;
  }

  activate(planId: string): DisasterRecoveryPlan {
    const plan = this.store.recoveryPlans.get(planId);
    if (!plan) throw new Error(`Recovery plan not found: ${planId}`);
    plan.status = "activated";
    plan.lastTestedAt = this.store.now();
    this.store.recoveryPlans.set(plan.id, plan);
    return plan;
  }
}