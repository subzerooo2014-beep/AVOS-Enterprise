import { Injectable } from '@nestjs/common';

@Injectable()
export class CommissionFeeCalculatorService {
  calculate(input: {
    amount: number;
    commissionRate: number;
    paymentFeeRate: number;
    fixedFee?: number;
  }) {
    const commission = input.amount * input.commissionRate;
    const paymentFee = input.amount * input.paymentFeeRate;
    const fixedFee = input.fixedFee ?? 0;
    const totalFees = commission + paymentFee + fixedFee;

    return {
      amount: input.amount,
      commission: Number(commission.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      fixedFee: Number(fixedFee.toFixed(2)),
      totalFees: Number(totalFees.toFixed(2)),
      sellerNet: Number((input.amount - totalFees).toFixed(2)),
    };
  }
}