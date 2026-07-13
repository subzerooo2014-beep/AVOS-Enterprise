import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleFinanceReadinessService {
  evaluate(input: {
    affordabilityScore: number;
    vehicleScore: number;
    buyerTrustScore: number;
    lenderFitScore: number;
  }) {
    const score = Math.round(
      input.affordabilityScore * 0.3 +
      input.vehicleScore * 0.25 +
      input.buyerTrustScore * 0.25 +
      input.lenderFitScore * 0.2,
    );

    return {
      score,
      status: score >= 80 ? "READY" : score >= 60 ? "REVIEW" : "NOT_READY",
    };
  }
}
