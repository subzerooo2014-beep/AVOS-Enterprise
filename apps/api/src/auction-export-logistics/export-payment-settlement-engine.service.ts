import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportPaymentSettlementEngineService {
  settle(input: {
    auctionAmount: number;
    shippingAmount: number;
    customsAmount: number;
    platformFeeRate: number;
  }) {
    const platformFee = input.auctionAmount * input.platformFeeRate;
    const totalPayable =
      input.auctionAmount +
      input.shippingAmount +
      input.customsAmount +
      platformFee;

    return {
      ...input,
      platformFee: Number(platformFee.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2)),
      sellerNet: Number(
        (input.auctionAmount - platformFee).toFixed(2),
      ),
    };
  }
}