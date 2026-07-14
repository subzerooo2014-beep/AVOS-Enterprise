import { Injectable } from '@nestjs/common';
import {
  CostRecord,
  RevenueRecord,
} from './enterprise-value-optimization.types';

@Injectable()
export class ProfitabilityIntelligenceService {
  analyze(costs: CostRecord[], revenues: RevenueRecord[]) {
    const revenue = revenues.reduce((sum, item) => sum + item.amount, 0);
    const cost = costs.reduce((sum, item) => sum + item.amount, 0);
    const profit = revenue - cost;
    const marginPercent =
      revenue === 0 ? 0 : (profit / revenue) * 100;

    return {
      revenue,
      cost,
      profit,
      marginPercent: Number(marginPercent.toFixed(2)),
      profitabilityScore: Math.max(
        0,
        Math.min(100, Math.round(50 + marginPercent)),
      ),
    };
  }
}