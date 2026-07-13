import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesIntelligenceService {
  forecast(input: {
    demandScore: number;
    priceCompetitiveness: number;
    buyerInterest: number;
  }) {
    const conversionProbability = Math.round(
      input.demandScore * 0.35 +
        input.priceCompetitiveness * 0.3 +
        input.buyerInterest * 0.35,
    );

    return {
      conversionProbability,
      recommendation:
        conversionProbability >= 80
          ? "ACCELERATE"
          : conversionProbability >= 55
            ? "OPTIMIZE"
            : "REPRICE",
    };
  }
}
