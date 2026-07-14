import { Injectable } from '@nestjs/common';
import { CostRecord } from './enterprise-value-optimization.types';

@Injectable()
export class EnterpriseCostIntelligenceService {
  analyze(costs: CostRecord[]) {
    const categoryTotals = new Map<string, number>();

    for (const cost of costs) {
      categoryTotals.set(
        cost.category,
        (categoryTotals.get(cost.category) ?? 0) + cost.amount,
      );
    }

    const categories = [...categoryTotals.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount);

    return {
      totalCost: costs.reduce((sum, cost) => sum + cost.amount, 0),
      avoidableCost: Math.round(
        costs.reduce(
          (sum, cost) =>
            sum + cost.amount * (cost.avoidablePercent / 100),
          0,
        ),
      ),
      categories,
    };
  }
}