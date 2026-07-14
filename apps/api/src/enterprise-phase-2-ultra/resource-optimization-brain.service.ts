import { Injectable } from "@nestjs/common";

@Injectable()
export class ResourceOptimizationBrainService {
  optimize(demand = 75, capacity = 80) {
    const recommendedCapacity = Math.max(1, Math.ceil((demand / 70) * capacity));
    const score = Math.max(0, Math.min(100, 100 - Math.abs(recommendedCapacity - capacity)));
    return {
      demand,
      capacity,
      recommendedCapacity,
      optimizationScore: score,
      optimizedAt: new Date().toISOString(),
    };
  }
}