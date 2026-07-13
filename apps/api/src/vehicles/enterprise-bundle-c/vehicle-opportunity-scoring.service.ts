import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleOpportunityScoringService {
  score(input: {
    demandScore: number;
    marginScore: number;
    trustScore: number;
    conversionScore: number;
  }) {
    const opportunityScore = Math.round(
      input.demandScore * 0.3 +
      input.marginScore * 0.25 +
      input.trustScore * 0.2 +
      input.conversionScore * 0.25,
    );

    return {
      opportunityScore,
      priority:
        opportunityScore >= 80
          ? "HIGH"
          : opportunityScore >= 60
            ? "MEDIUM"
            : "LOW",
    };
  }
}
