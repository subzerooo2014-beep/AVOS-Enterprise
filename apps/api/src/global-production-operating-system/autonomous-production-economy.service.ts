import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { EconomySnapshot } from "./global-production-os.types";

@Injectable()
export class AutonomousProductionEconomyService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  snapshot(): EconomySnapshot {
    const factories = [...this.store.factories.values()];
    const totalCapacity = factories.reduce((sum, factory) => sum + factory.capacity, 0);
    const usedCapacity = factories.reduce((sum, factory) => sum + factory.currentLoad, 0);
    const utilizationRate =
      totalCapacity === 0 ? 0 : Number(((usedCapacity / totalCapacity) * 100).toFixed(2));
    const totalEstimatedCost = factories.reduce(
      (sum, factory) => sum + factory.currentLoad * factory.operationalCostIndex,
      0
    );
    const efficiencyScore = Number(
      (
        factories.reduce((sum, factory) => sum + factory.healthScore, 0) /
        Math.max(1, factories.length)
      ).toFixed(2)
    );
    const sustainabilityScore = Number(
      (
        100 -
        factories.reduce((sum, factory) => sum + factory.carbonIntensityIndex, 0) /
          Math.max(1, factories.length)
      ).toFixed(2)
    );

    const snapshot: EconomySnapshot = {
      id: this.store.nextId("production-economy"),
      totalEstimatedCost,
      utilizationRate,
      efficiencyScore,
      sustainabilityScore,
      createdAt: this.store.now()
    };
    this.store.economySnapshots.set(snapshot.id, snapshot);
    return snapshot;
  }
}