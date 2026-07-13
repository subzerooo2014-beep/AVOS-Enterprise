import { Injectable } from "@nestjs/common";

@Injectable()
export class BuyerConversionIntelligenceService {
  evaluate(input: {
    engagementScore: number;
    affordabilityScore: number;
    trustScore: number;
    urgencyScore: number;
  }) {
    const conversionScore = Math.round(
      input.engagementScore * 0.3 +
        input.affordabilityScore * 0.3 +
        input.trustScore * 0.2 +
        input.urgencyScore * 0.2,
    );

    return {
      conversionScore,
      stage:
        conversionScore >= 85
          ? "READY_TO_BUY"
          : conversionScore >= 60
            ? "NURTURE"
            : "DISCOVERY",
    };
  }
}
