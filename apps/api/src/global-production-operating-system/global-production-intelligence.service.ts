import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { IntelligenceForecast } from "./global-production-os.types";

@Injectable()
export class GlobalProductionIntelligenceService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  forecast(horizonHours = 24): IntelligenceForecast {
    const factories = [...this.store.factories.values()];
    const predictedCapacity = factories.reduce(
      (sum, factory) => sum + Math.max(0, factory.capacity - factory.currentLoad),
      0
    );
    const predictedDemand =
      [...this.store.workloads.values()].reduce(
        (sum, workload) => sum + workload.requestedCapacity,
        0
      ) + Math.round(factories.length * 25 * (horizonHours / 24));

    const predictedRisk =
      predictedCapacity === 0
        ? 100
        : Math.min(100, Math.round((predictedDemand / predictedCapacity) * 100));

    const recommendations: string[] = [];
    if (predictedRisk >= 80) recommendations.push("Pre-scale regional production capacity.");
    if (predictedRisk >= 60) recommendations.push("Create additional active-passive replicas.");
    if (factories.some((factory) => factory.healthScore < 90)) {
      recommendations.push("Isolate degraded factories and activate recovery capacity.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Global capacity is healthy; continue adaptive balancing.");
    }

    const forecast: IntelligenceForecast = {
      id: this.store.nextId("global-production-forecast"),
      horizonHours,
      predictedDemand,
      predictedCapacity,
      predictedRisk,
      recommendations,
      createdAt: this.store.now()
    };
    this.store.forecasts.set(forecast.id, forecast);
    return forecast;
  }
}