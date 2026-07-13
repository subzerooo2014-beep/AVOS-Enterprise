import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleAuctionReadinessService {
  evaluate(input: {
    demandScore: number;
    reserveScore: number;
    rarityScore: number;
    sellerUrgency: number;
  }) {
    const score = Math.round(
      input.demandScore * 0.3 +
      input.reserveScore * 0.25 +
      input.rarityScore * 0.25 +
      input.sellerUrgency * 0.2,
    );

    return {
      score,
      recommended: score >= 70,
    };
  }
}
