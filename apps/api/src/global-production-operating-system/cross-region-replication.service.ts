import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { ReplicationPlan } from "./global-production-os.types";

@Injectable()
export class CrossRegionReplicationService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  plan(
    workloadId: string,
    targetFactoryIds: string[],
    strategy: ReplicationPlan["strategy"] = "active-passive"
  ): ReplicationPlan {
    const workload = this.store.workloads.get(workloadId);
    if (!workload?.selectedFactoryId) {
      throw new Error("Workload must be routed before replication.");
    }

    const plan: ReplicationPlan = {
      id: this.store.nextId("cross-region-replication"),
      workloadId,
      sourceFactoryId: workload.selectedFactoryId,
      targetFactoryIds,
      strategy,
      assets: ["blueprint", "capabilities", "metadata", "knowledge", "runtime-package"],
      status: "planned",
      createdAt: this.store.now()
    };
    this.store.replicationPlans.set(plan.id, plan);
    return plan;
  }

  execute(planId: string): ReplicationPlan {
    const plan = this.store.replicationPlans.get(planId);
    if (!plan) throw new Error(`Replication plan not found: ${planId}`);
    plan.status = "completed";
    this.store.replicationPlans.set(plan.id, plan);
    return plan;
  }
}