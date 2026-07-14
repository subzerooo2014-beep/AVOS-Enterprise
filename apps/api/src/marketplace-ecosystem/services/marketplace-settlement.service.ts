import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceSettlementService {
  settle(input: { orderId: string; grossAmount: number; commissionAmount: number }) {
    return {
      id: `settlement_${Date.now()}`,
      ...input,
      netAmount: input.grossAmount - input.commissionAmount,
      status: "COMPLETED",
    };
  }
}
