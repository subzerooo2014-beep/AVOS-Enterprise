import { Injectable } from "@nestjs/common";
import { SettlementPolicy } from "../policies/settlement.policy";
@Injectable()
export class AuctionSettlementService {
  constructor(private readonly policy: SettlementPolicy) {}
  settle(input: { auctionId: string; winnerId?: string; paymentReference: string; amount: number }) {
    this.policy.validate(input.winnerId, input.paymentReference);
    return {
      id: `settlement_${Date.now()}`,
      ...input,
      status: "COMPLETED",
      settledAt: new Date().toISOString(),
    };
  }
}
