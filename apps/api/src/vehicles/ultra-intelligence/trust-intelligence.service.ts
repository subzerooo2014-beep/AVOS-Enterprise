import { Injectable } from "@nestjs/common";

@Injectable()
export class TrustIntelligenceService {
  evaluate(input: {
    identityVerified: boolean;
    transactionSuccessRate: number;
    disputeRate: number;
    responseRate: number;
  }) {
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (input.identityVerified ? 30 : 0) +
            input.transactionSuccessRate * 0.35 +
            input.responseRate * 0.25 -
            input.disputeRate * 20,
        ),
      ),
    );

    return {
      score,
      level:
        score >= 85
          ? "HIGH"
          : score >= 60
            ? "MEDIUM"
            : "LOW",
    };
  }
}
