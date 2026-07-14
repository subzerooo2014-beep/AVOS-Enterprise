import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyFinanceService {
  submit(input: { journeyId: string; downPayment: number; termMonths: number; monthlyIncome: number; monthlyDebt: number }) {
    const financedAmount = Math.max(0, 1 - input.downPayment);
    const debtRatio = input.monthlyDebt / Math.max(1, input.monthlyIncome);
    return { id: `fin_${Date.now()}`, ...input, financedAmount, debtRatio, status: debtRatio <= 0.5 ? "PRE_APPROVED" : "REVIEW" };
  }
}
