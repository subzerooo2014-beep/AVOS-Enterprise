import { Injectable } from '@nestjs/common';
import { ShippingQuote } from './auction-export-logistics.types';

@Injectable()
export class ShippingQuotationEngineService {
  rank(quotes: ShippingQuote[]) {
    return [...quotes]
      .map((quote) => ({
        ...quote,
        totalAmount: Number(
          (
            quote.freightAmount +
            quote.insuranceAmount +
            quote.handlingAmount
          ).toFixed(2),
        ),
      }))
      .sort(
        (a, b) =>
          a.totalAmount - b.totalAmount ||
          a.transitDays - b.transitDays,
      );
  }
}