import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from './vehicle-finance-commerce.types';

@Injectable()
export class RefundSettlementEngineService {
  process(
    payment: PaymentTransaction,
    refundAmount: number,
  ) {
    if (refundAmount < 0 || refundAmount > payment.amount) {
      throw new Error('Invalid refund amount');
    }

    return {
      paymentId: payment.id,
      refundAmount,
      remainingCaptured: Number(
        (payment.amount - refundAmount).toFixed(2),
      ),
      status:
        refundAmount === payment.amount
          ? 'refunded'
          : 'partially-refunded',
    };
  }
}