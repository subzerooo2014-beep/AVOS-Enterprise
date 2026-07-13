import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleActionRecommendationService {
  recommend(input: {
    riskScore: number;
    opportunityScore: number;
    qualityScore: number;
  }) {
    if (input.riskScore >= 80) {
      return {
        action: "BLOCK",
        reason: "critical-risk",
      };
    }

    if (
      input.opportunityScore >= 75 &&
      input.qualityScore >= 70
    ) {
      return {
        action: "ACCELERATE",
        reason: "high-opportunity",
      };
    }

    return {
      action: "OPTIMIZE",
      reason: "improvement-required",
    };
  }
}
