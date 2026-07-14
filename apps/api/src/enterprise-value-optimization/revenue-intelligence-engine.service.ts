import { Injectable } from '@nestjs/common';
import { RevenueRecord } from './enterprise-value-optimization.types';

@Injectable()
export class RevenueIntelligenceEngineService {
  analyze(revenues: RevenueRecord[]) {
    const ranked = [...revenues].sort(
      (left, right) => right.amount - left.amount,
    );
    const totalRevenue = ranked.reduce(
      (sum, revenue) => sum + revenue.amount,
      0,
    );
    const weightedGrowth =
      ranked.reduce(
        (sum, revenue) => sum + revenue.amount * revenue.growthRate,
        0,
      ) / Math.max(1, totalRevenue);

    return {
      totalRevenue,
      weightedGrowthRate: Number(weightedGrowth.toFixed(2)),
      ranked,
      strongestStream: ranked[0]?.stream ?? null,
    };
  }
}