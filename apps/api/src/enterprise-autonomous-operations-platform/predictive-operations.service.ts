import { Injectable } from "@nestjs/common";
import type {
  CapacityForecastRecord,
  CostOptimizationRecord,
} from "./enterprise-autonomous-operations.types";

@Injectable()
export class PredictiveOperationsService {
  private readonly forecasts: CapacityForecastRecord[] = [];
  private readonly optimizations: CostOptimizationRecord[] = [];

  forecast(
    resource: string,
    currentUsage: number,
    growthRate: number,
    horizonHours: number,
  ): CapacityForecastRecord {
    const projectedUsage = currentUsage * (1 + growthRate * horizonHours);
    const recommendedCapacity = Math.ceil(projectedUsage * 1.2);

    const record: CapacityForecastRecord = {
      id: `capacity-forecast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      resource,
      currentUsage,
      projectedUsage,
      recommendedCapacity,
      horizonHours,
      createdAt: new Date().toISOString(),
    };

    this.forecasts.unshift(record);
    return { ...record };
  }

  optimizeCost(
    resource: string,
    currentCost: number,
    reductionPercent: number,
  ): CostOptimizationRecord {
    const projectedCost = currentCost * (1 - reductionPercent / 100);

    const record: CostOptimizationRecord = {
      id: `cost-optimization-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      resource,
      currentCost,
      projectedCost,
      savings: currentCost - projectedCost,
      recommendation: `Reduce projected cost by ${reductionPercent}%.`,
      createdAt: new Date().toISOString(),
    };

    this.optimizations.unshift(record);
    return { ...record };
  }

  forecastsList(): CapacityForecastRecord[] {
    return this.forecasts.map((item) => ({ ...item }));
  }

  optimizationsList(): CostOptimizationRecord[] {
    return this.optimizations.map((item) => ({ ...item }));
  }

  forecastCount(): number {
    return this.forecasts.length;
  }

  optimizationCount(): number {
    return this.optimizations.length;
  }
}
