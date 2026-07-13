import { Injectable } from "@nestjs/common";
import {
  DealerIntelligenceInput,
  DealerIntelligenceResult,
} from "./dealer-intelligence.types";

@Injectable()
export class DealerIntelligenceService {
  evaluate(input: DealerIntelligenceInput): DealerIntelligenceResult {
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.trustScore * 0.4 +
            input.responseRate * 0.2 +
            input.fulfillmentRate * 0.3 -
            input.disputeRate * 20,
        ),
      ),
    );

    return {
      dealerId: input.dealerId,
      score,
      tier:
        score >= 90
          ? "ELITE"
          : score >= 75
            ? "VERIFIED"
            : score >= 55
              ? "STANDARD"
              : "RESTRICTED",
    };
  }
}
