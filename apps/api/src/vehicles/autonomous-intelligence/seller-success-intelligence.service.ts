import { Injectable } from "@nestjs/common";

@Injectable()
export class SellerSuccessIntelligenceService {
  evaluate(input: {
    listingQuality: number;
    responseRate: number;
    trustScore: number;
    pricingScore: number;
  }) {
    const successScore = Math.round(
      input.listingQuality * 0.3 +
        input.responseRate * 0.2 +
        input.trustScore * 0.25 +
        input.pricingScore * 0.25,
    );

    return {
      successScore,
      recommendation:
        successScore >= 80
          ? "ACCELERATE"
          : successScore >= 55
            ? "OPTIMIZE"
            : "REBUILD_LISTING",
    };
  }
}
