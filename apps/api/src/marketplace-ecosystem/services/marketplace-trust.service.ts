import { Injectable } from "@nestjs/common";
import { TrustPolicy } from "../policies/trust.policy";
@Injectable()
export class MarketplaceTrustService {
  constructor(private readonly policy: TrustPolicy) {}
  evaluate(input: { verified: boolean; reviewAverage: number; completedTransactions: number; disputeCount: number }) {
    return this.policy.evaluate(input);
  }
}
