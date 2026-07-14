import { Injectable } from "@nestjs/common";
@Injectable()
export class DriverPerformanceService {
  evaluate(input: { safetyScore: number; onTimeRate: number; fuelEfficiencyScore: number }) {
    const score = Math.round(input.safetyScore * 0.5 + input.onTimeRate * 0.3 + input.fuelEfficiencyScore * 0.2);
    return { score, band: score >= 85 ? "EXCELLENT" : score >= 70 ? "GOOD" : score >= 55 ? "REVIEW" : "POOR" };
  }
}
