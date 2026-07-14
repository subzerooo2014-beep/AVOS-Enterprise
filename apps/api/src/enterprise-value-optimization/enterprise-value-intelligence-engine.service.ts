import { Injectable } from '@nestjs/common';
import {
  CostRecord,
  RevenueRecord,
} from './enterprise-value-optimization.types';

@Injectable()
export class EnterpriseValueIntelligenceEngineService {
  analyze(costs: CostRecord[], revenues: RevenueRecord[]) {
    const totalRevenue = revenues.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
    const totalCost = costs.reduce((sum, record) => sum + record.amount, 0);
    const grossValue = totalRevenue - totalCost;
    const avoidableCost = costs.reduce(
      (sum, record) =>
        sum + record.amount * (record.avoidablePercent / 100),
      0,
    );
    const weightedMargin =
      revenues.reduce(
        (sum, record) =>
          sum + record.amount * (record.marginPercent / 100),
        0,
      ) / Math.max(1, totalRevenue);

    return {
      totalRevenue,
      totalCost,
      grossValue,
      avoidableCost: Math.round(avoidableCost),
      weightedMarginPercent: Math.round(weightedMargin * 100),
      valueScore: Math.max(
        0,
        Math.min(
          100,
          Math.round(
            50 +
              weightedMargin * 30 +
              (grossValue / Math.max(1, totalRevenue)) * 20,
          ),
        ),
      ),
    };
  }
}