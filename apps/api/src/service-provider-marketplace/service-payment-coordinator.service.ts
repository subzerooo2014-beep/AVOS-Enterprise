import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicePaymentCoordinatorService {
  calculate(input: {
    totalAmount: number;
    depositRate: number;
    platformFeeRate: number;
  }) {
    const deposit = input.totalAmount * input.depositRate;
    const platformFee = input.totalAmount * input.platformFeeRate;

    return {
      totalAmount: input.totalAmount,
      deposit: Number(deposit.toFixed(2)),
      platformFee: Number(platformFee.toFixed(2)),
      providerNet: Number(
        (input.totalAmount - platformFee).toFixed(2),
      ),
    };
  }
}