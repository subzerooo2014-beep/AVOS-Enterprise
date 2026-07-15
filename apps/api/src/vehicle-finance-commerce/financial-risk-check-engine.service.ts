import { Injectable } from '@nestjs/common';
import { FinancialRiskSignal } from './vehicle-finance-commerce.types';

@Injectable()
export class FinancialRiskCheckEngineService {
  evaluate(signals: FinancialRiskSignal[]) {
    const score = Math.min(
      100,
      Math.round(
        signals.reduce((sum, signal) => sum + signal.score, 0) /
          Math.max(1, signals.length),
      ),
    );

    return {
      signals,
      score,
      blocked: score >= 75,
      reviewRequired: score >= 45 && score < 75,
    };
  }
}