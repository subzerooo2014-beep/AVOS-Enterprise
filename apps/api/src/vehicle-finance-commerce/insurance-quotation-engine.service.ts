import { Injectable } from '@nestjs/common';
import { InsuranceQuote } from './vehicle-finance-commerce.types';

@Injectable()
export class InsuranceQuotationEngineService {
  rank(quotes: InsuranceQuote[]) {
    return [...quotes]
      .map((quote) => ({
        ...quote,
        valueScore: Number(
          (
            quote.coverageScore * 0.7 +
            Math.max(0, 100 - quote.annualPremium / 100) * 0.3
          ).toFixed(2),
        ),
      }))
      .sort((a, b) => b.valueScore - a.valueScore);
  }
}