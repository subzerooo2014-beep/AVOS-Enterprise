import { Injectable } from "@nestjs/common";
import {
  DealerIntelligenceInput,
  DealerIntelligenceResult,
} from "./dealer-intelligence.types";

@Injectable()
export class DealerIntelligenceService {
  evaluate(
    input: DealerIntelligenceInput,
  ): DealerIntelligenceResult {
    const disputePenalty = Math.round(input.disputeRate * 40);

    const dealerScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.trustScore * 0.35 +
            input.responseRate * 0.2 +
            input.fulfillmentRate * 0.3 +
            Math.min(input.activeListings, 100) * 0.15 -
            disputePenalty,
        ),
      ),
    );

    const tier =
      dealerScore >= 90
        ? "ELITE"
        : dealerScore >= 75
          ? "VERIFIED"
          : dealerScore >= 55
            ? "STANDARD"
            : "RESTRICTED";

    return {
      dealerId: input.dealerId,
      dealerScore,
      tier,
      actions:
        tier === "RESTRICTED"
          ? ["manual-review", "limit-listings"]
          : tier === "ELITE"
            ? ["priority-ranking", "premium-badge"]
            : ["standard-monitoring"],
    };
  }
}
