import { Injectable } from "@nestjs/common";
@Injectable()
export class TrustPolicy {
  evaluate(input: { verified: boolean; reviewAverage: number; completedTransactions: number; disputeCount: number }) {
    let score = 50;
    if (input.verified) score += 20;
    score += Math.min(20, input.reviewAverage * 4);
    score += Math.min(10, input.completedTransactions / 10);
    score -= Math.min(40, input.disputeCount * 10);
    score = Math.max(0, Math.min(100, Math.round(score)));
    return { score, band: score >= 80 ? "HIGH" : score >= 60 ? "MEDIUM" : "LOW" };
  }
}
