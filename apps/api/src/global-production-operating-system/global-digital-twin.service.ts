import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { DigitalTwinSnapshot } from "./global-production-os.types";

@Injectable()
export class GlobalDigitalTwinService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  snapshot(): DigitalTwinSnapshot {
    const factories = [...this.store.factories.values()];
    const operationalFactories = factories.filter(
      (factory) => factory.status === "operational"
    ).length;
    const globalHealthScore = Number(
      (
        factories.reduce((sum, factory) => sum + factory.healthScore, 0) /
        Math.max(1, factories.length)
      ).toFixed(2)
    );

    const snapshot: DigitalTwinSnapshot = {
      id: this.store.nextId("global-digital-twin"),
      factories: factories.length,
      operationalFactories,
      workloads: this.store.workloads.size,
      activeReplications: [...this.store.replicationPlans.values()].filter(
        (plan) => plan.status === "executing" || plan.status === "planned"
      ).length,
      recoveryPlansReady: [...this.store.recoveryPlans.values()].filter(
        (plan) => plan.status === "ready"
      ).length,
      globalHealthScore,
      createdAt: this.store.now()
    };
    this.store.digitalTwinSnapshots.set(snapshot.id, snapshot);
    return snapshot;
  }
}