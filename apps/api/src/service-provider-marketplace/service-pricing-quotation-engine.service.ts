import { Injectable } from '@nestjs/common';
import { ServiceQuote } from './service-provider-marketplace.types';

@Injectable()
export class ServicePricingQuotationEngineService {
  calculate(input: Omit<ServiceQuote, 'totalAmount'>): ServiceQuote {
    const totalAmount =
      input.partsCost +
      input.laborCost +
      input.taxAmount -
      input.discountAmount;

    return {
      ...input,
      totalAmount: Number(Math.max(0, totalAmount).toFixed(2)),
    };
  }
}