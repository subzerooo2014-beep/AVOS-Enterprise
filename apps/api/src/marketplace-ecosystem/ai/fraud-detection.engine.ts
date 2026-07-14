import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceFraudDetectionEngine {
  evaluate(input: { trustScore: number; disputeCount: number; refundRate: number; suspiciousSignals: number }) {
    const risk = Math.min(
      100,
      Math.round(
        (100 - input.trustScore) * 0.4 +
        input.disputeCount * 12 +
        input.refundRate * 0.25 +
        input.suspiciousSignals * 8,
      ),
    );
    return {
      risk,
      decision: risk >= 70 ? "BLOCK" : risk >= 40 ? "REVIEW" : "ALLOW",
    };
  }
}
