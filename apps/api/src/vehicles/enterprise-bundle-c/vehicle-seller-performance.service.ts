import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleSellerPerformanceService {
  evaluate(input: {
    responseRate: number;
    completionRate: number;
    disputeRate: number;
    trustScore: number;
  }) {
    const performanceScore = Math.max(
      0,
      Math.round(
        input.responseRate * 0.25 +
        input.completionRate * 0.35 +
        input.trustScore * 0.3 -
        input.disputeRate * 0.1,
      ),
    );

    return {
      performanceScore,
      tier:
        performanceScore >= 85
          ? "ELITE"
          : performanceScore >= 65
            ? "VERIFIED"
            : "STANDARD",
    };
  }
}
