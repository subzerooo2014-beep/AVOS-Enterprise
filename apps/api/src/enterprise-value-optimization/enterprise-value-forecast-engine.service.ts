import { Injectable } from '@nestjs/common';
import { ValueForecast } from './enterprise-value-optimization.types';

@Injectable()
export class EnterpriseValueForecastEngineService {
  forecast(
    currentValue: number,
    monthlyGrowthRate: number,
    horizonDays: number,
    confidence = 0.8,
  ): ValueForecast {
    const months = horizonDays / 30;
    const projectedValue =
      currentValue * Math.pow(1 + monthlyGrowthRate / 100, months);
    const projectedGrowthPercent =
      currentValue === 0
        ? 0
        : ((projectedValue - currentValue) / currentValue) * 100;

    return {
      horizonDays,
      currentValue,
      projectedValue: Math.round(projectedValue),
      projectedGrowthPercent: Number(projectedGrowthPercent.toFixed(2)),
      confidence: Math.max(0, Math.min(1, confidence)),
    };
  }
}