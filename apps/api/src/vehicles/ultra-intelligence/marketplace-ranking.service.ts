import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketplaceRankingService {
  rank(input: {
    qualityScore: number;
    demandScore: number;
    trustScore: number;
    freshnessScore: number;
  }) {
    const rankingScore = Math.round(
      input.qualityScore * 0.3 +
        input.demandScore * 0.3 +
        input.trustScore * 0.25 +
        input.freshnessScore * 0.15,
    );

    return {
      rankingScore,
      tier:
        rankingScore >= 85
          ? "PREMIUM"
          : rankingScore >= 65
            ? "STANDARD"
            : "LIMITED",
    };
  }
}
