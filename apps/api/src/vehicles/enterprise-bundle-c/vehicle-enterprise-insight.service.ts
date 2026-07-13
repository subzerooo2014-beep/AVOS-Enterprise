import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleEnterpriseInsightService {
  compose(input: {
    riskScore: number;
    opportunityScore: number;
    qualityScore: number;
    conversionScore: number;
  }) {
    const enterpriseScore = Math.round(
      input.opportunityScore * 0.3 +
      input.qualityScore * 0.25 +
      input.conversionScore * 0.25 +
      Math.max(0, 100 - input.riskScore) * 0.2,
    );

    return {
      enterpriseScore,
      decision:
        enterpriseScore >= 80
          ? "SCALE"
          : enterpriseScore >= 60
            ? "OPTIMIZE"
            : "REVIEW",
    };
  }
}
