import { Injectable } from "@nestjs/common";

@Injectable()
export class AuctionIntelligenceService {
  evaluate(input: {
    demandScore: number;
    rarityScore: number;
    sellerUrgency: number;
    reservePriceScore: number;
  }) {
    const auctionScore = Math.round(
      input.demandScore * 0.3 +
        input.rarityScore * 0.25 +
        input.sellerUrgency * 0.2 +
        input.reservePriceScore * 0.25,
    );

    return {
      auctionScore,
      recommended: auctionScore >= 70,
    };
  }
}
