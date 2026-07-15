import { Injectable } from '@nestjs/common';
import { PricingSignal } from './vehicle-marketplace-operations.types';

@Injectable()
export class SmartPricingCoordinatorService {
  analyze(signals: PricingSignal[]) {
    const evaluated = signals.map((signal) => {
      const delta = signal.askingPrice - signal.marketPrice;
      const deltaPercent =
        signal.marketPrice === 0
          ? 0
          : (delta / signal.marketPrice) * 100;

      return {
        ...signal,
        delta,
        deltaPercent: Number(deltaPercent.toFixed(2)),
        recommendation:
          deltaPercent > 10
            ? 'reduce-price'
            : deltaPercent < -10
              ? 'raise-price'
              : 'market-aligned',
      };
    });

    return {
      signals: evaluated,
      averageConfidence: Number(
        (
          evaluated.reduce(
            (sum, signal) => sum + signal.confidence,
            0,
          ) / Math.max(1, evaluated.length)
        ).toFixed(3),
      ),
    };
  }
}