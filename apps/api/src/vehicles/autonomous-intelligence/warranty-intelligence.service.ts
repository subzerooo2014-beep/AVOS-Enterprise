import { Injectable } from "@nestjs/common";

@Injectable()
export class WarrantyIntelligenceService {
  evaluate(input: {
    ageScore: number;
    conditionScore: number;
    reliabilityScore: number;
    maintenanceScore: number;
  }) {
    const warrantyScore = Math.round(
      input.ageScore * 0.2 +
        input.conditionScore * 0.3 +
        input.reliabilityScore * 0.3 +
        input.maintenanceScore * 0.2,
    );

    return {
      warrantyScore,
      eligible: warrantyScore >= 65,
    };
  }
}
