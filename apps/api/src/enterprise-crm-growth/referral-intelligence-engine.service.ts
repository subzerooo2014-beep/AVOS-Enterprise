import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferralIntelligenceEngineService {
  evaluate(input: Array<{
    referrerId: string;
    referrals: number;
    conversions: number;
    revenue: number;
  }>) {
    return input
      .map((item) => ({
        ...item,
        conversionRate:
          item.referrals === 0
            ? 0
            : Number(
                ((item.conversions / item.referrals) * 100).toFixed(2),
              ),
        valueScore: Math.round(
          item.conversions * 10 + item.revenue / 1000,
        ),
      }))
      .sort((a, b) => b.valueScore - a.valueScore);
  }
}