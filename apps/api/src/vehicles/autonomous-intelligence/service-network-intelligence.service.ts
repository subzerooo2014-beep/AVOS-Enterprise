import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceNetworkIntelligenceService {
  evaluate(input: {
    workshopCoverage: number;
    partsAvailability: number;
    responseSpeed: number;
    qualityScore: number;
  }) {
    const networkScore = Math.round(
      input.workshopCoverage * 0.25 +
        input.partsAvailability * 0.25 +
        input.responseSpeed * 0.2 +
        input.qualityScore * 0.3,
    );

    return {
      networkScore,
      tier: networkScore >= 80 ? "PREMIUM" : networkScore >= 60 ? "STANDARD" : "LIMITED",
    };
  }
}
