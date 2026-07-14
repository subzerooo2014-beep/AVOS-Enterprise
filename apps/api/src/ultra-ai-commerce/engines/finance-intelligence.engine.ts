import { Injectable } from "@nestjs/common";
import { clamp, round } from "../ultra-ai-commerce.utils";

@Injectable()
export class FinanceIntelligenceEngine {
  evaluate(input: { vehiclePrice: number; downPayment: number; monthlyIncome: number; monthlyDebt: number; termMonths: number }) {
    const financed = Math.max(0, input.vehiclePrice - input.downPayment);
    const monthly = financed / Math.max(1, input.termMonths);
    const debtRatio = (input.monthlyDebt + monthly) / Math.max(1, input.monthlyIncome);
    const score = clamp(100 - debtRatio * 100);
    return { financedAmount: round(financed), estimatedMonthly: round(monthly), debtRatio: round(debtRatio), approvalScore: score, decision: score >= 65 ? "APPROVE" : score >= 45 ? "REVIEW" : "DECLINE" };
  }
}
