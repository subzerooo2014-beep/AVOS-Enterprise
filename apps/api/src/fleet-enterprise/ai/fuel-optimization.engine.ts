import { Injectable } from "@nestjs/common";
@Injectable()
export class FuelOptimizationEngine {
  evaluate(input: { distanceKm: number; litersUsed: number; idleMinutes: number }) {
    const efficiency = input.litersUsed > 0 ? input.distanceKm / input.litersUsed : 0;
    const idlePenalty = Math.min(30, input.idleMinutes / 5);
    return {
      kmPerLiter: Math.round(efficiency * 100) / 100,
      optimizationScore: Math.max(0, Math.round(efficiency * 8 - idlePenalty)),
      actions: input.idleMinutes > 30 ? ["reduce_idle_time"] : ["maintain_driving_pattern"],
    };
  }
}
