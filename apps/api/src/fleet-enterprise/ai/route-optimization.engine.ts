import { Injectable } from "@nestjs/common";
@Injectable()
export class RouteOptimizationEngine {
  optimize(input: { estimatedDistanceKm: number; trafficScore: number; fuelCostPerKm: number }) {
    const adjustedDistance =
      input.estimatedDistanceKm * (1 + Math.min(0.35, input.trafficScore / 300));
    return {
      optimizedDistanceKm: Math.round(adjustedDistance * 100) / 100,
      estimatedFuelCost: Math.round(adjustedDistance * input.fuelCostPerKm * 100) / 100,
      routeScore: Math.max(0, 100 - Math.round(input.trafficScore * 0.6)),
    };
  }
}
