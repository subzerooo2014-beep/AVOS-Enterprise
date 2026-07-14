import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseDemandForecastService } from "./enterprise-demand-forecast.service";
import { EnterpriseCapacityPlan } from "./enterprise-e7.types";

@Injectable()
export class EnterpriseCapacityPlannerService {
  private readonly plans: EnterpriseCapacityPlan[] = [];

  constructor(
    private readonly forecasting: EnterpriseDemandForecastService,
  ) {}

  plan(source = "avos-enterprise-api", currentUnits = 2) {
    const forecast = this.forecasting.forecast(source, 60);
    const utilizationTarget = 65;
    const pressure = Math.max(
      forecast.predictedCpuPercent,
      forecast.predictedMemoryPercent,
    );

    const recommendedUnits = Math.max(
      1,
      Math.ceil((Math.max(1, currentUnits) * pressure) / utilizationTarget),
    );

    const plan: EnterpriseCapacityPlan = {
      id: randomUUID(),
      source,
      currentUnits: Math.max(1, currentUnits),
      recommendedUnits,
      utilizationTarget,
      reason:
        recommendedUnits > currentUnits
          ? "Predicted utilization exceeds target."
          : recommendedUnits < currentUnits
            ? "Predicted utilization permits consolidation."
            : "Current capacity matches forecast demand.",
      generatedAt: new Date().toISOString(),
    };

    this.plans.push(plan);
    return { plan, forecast };
  }

  list(): EnterpriseCapacityPlan[] {
    return [...this.plans];
  }

  count(): number {
    return this.plans.length;
  }
}