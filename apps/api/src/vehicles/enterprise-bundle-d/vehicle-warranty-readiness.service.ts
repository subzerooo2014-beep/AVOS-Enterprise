import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleWarrantyReadinessService {
  evaluate(input: {
    ageScore: number;
    maintenanceScore: number;
    conditionScore: number;
    reliabilityScore: number;
  }) {
    const score = Math.round(
      input.ageScore * 0.2 +
      input.maintenanceScore * 0.25 +
      input.conditionScore * 0.25 +
      input.reliabilityScore * 0.3,
    );

    return {
      score,
      eligible: score >= 70,
    };
  }
}
