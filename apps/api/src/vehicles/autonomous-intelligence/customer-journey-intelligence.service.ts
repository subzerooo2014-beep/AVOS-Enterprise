import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerJourneyIntelligenceService {
  evaluate(input: {
    discoveryScore: number;
    engagementScore: number;
    trustScore: number;
    transactionReadiness: number;
  }) {
    const journeyScore = Math.round(
      input.discoveryScore * 0.15 +
        input.engagementScore * 0.25 +
        input.trustScore * 0.25 +
        input.transactionReadiness * 0.35,
    );

    return {
      journeyScore,
      nextBestAction:
        journeyScore >= 80
          ? "CONVERT"
          : journeyScore >= 55
            ? "NURTURE"
            : "EDUCATE",
    };
  }
}
