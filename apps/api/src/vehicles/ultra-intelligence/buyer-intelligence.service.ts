import { Injectable } from "@nestjs/common";
import {
  BuyerIntelligenceInput,
  BuyerIntelligenceResult,
} from "./buyer-intelligence.types";

@Injectable()
export class BuyerIntelligenceService {
  evaluate(input: BuyerIntelligenceInput): BuyerIntelligenceResult {
    const affinityScore = Math.min(
      100,
      Math.round(
        Math.min(input.budget / 1000, 50) +
          input.preferredBrands.length * 12 +
          input.preferredBodyTypes.length * 8,
      ),
    );

    return {
      buyerId: input.buyerId,
      affinityScore,
      intent:
        affinityScore >= 75
          ? "HIGH"
          : affinityScore >= 45
            ? "MEDIUM"
            : "LOW",
      reasons: [`buyer-affinity:${affinityScore}`],
    };
  }
}
