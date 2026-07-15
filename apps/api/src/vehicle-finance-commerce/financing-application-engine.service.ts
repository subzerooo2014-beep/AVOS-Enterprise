import { Injectable } from '@nestjs/common';
import { FinancingApplication } from './vehicle-finance-commerce.types';

@Injectable()
export class FinancingApplicationEngineService {
  evaluate(
    input: Omit<
      FinancingApplication,
      'requestedAmount' | 'status'
    >,
  ): FinancingApplication & {
    affordabilityRatio: number;
    decision: 'approve' | 'review' | 'reject';
  } {
    const requestedAmount = Math.max(
      0,
      input.vehiclePrice - input.downPayment,
    );
    const estimatedMonthly =
      requestedAmount / Math.max(1, input.termMonths);
    const affordabilityRatio =
      input.monthlyIncome === 0
        ? 1
        : estimatedMonthly / input.monthlyIncome;

    const decision =
      affordabilityRatio <= 0.35
        ? 'approve'
        : affordabilityRatio <= 0.5
          ? 'review'
          : 'reject';

    return {
      ...input,
      requestedAmount,
      status:
        decision === 'approve'
          ? 'approved'
          : decision === 'reject'
            ? 'rejected'
            : 'submitted',
      affordabilityRatio: Number(
        affordabilityRatio.toFixed(3),
      ),
      decision,
    };
  }
}