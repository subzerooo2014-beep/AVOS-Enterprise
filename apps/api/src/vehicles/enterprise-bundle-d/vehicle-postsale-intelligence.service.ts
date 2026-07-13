import { Injectable } from "@nestjs/common";

@Injectable()
export class VehiclePostSaleIntelligenceService {
  evaluate(input: {
    satisfactionScore: number;
    supportScore: number;
    retentionScore: number;
    referralScore: number;
  }) {
    const score = Math.round(
      input.satisfactionScore * 0.3 +
      input.supportScore * 0.25 +
      input.retentionScore * 0.25 +
      input.referralScore * 0.2,
    );

    return {
      score,
      action: score >= 80 ? "ADVOCACY" : score >= 60 ? "NURTURE" : "RECOVER",
    };
  }
}
