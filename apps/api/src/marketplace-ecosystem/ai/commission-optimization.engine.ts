import { Injectable } from "@nestjs/common";
@Injectable()
export class CommissionOptimizationEngine {
  recommend(input: { transactionVolume: number; marginPercent: number; currentCommissionPercent: number }) {
    let recommended = input.currentCommissionPercent;
    if (input.transactionVolume > 100000 && input.marginPercent > 20) recommended += 1;
    if (input.marginPercent < 10) recommended -= 1;
    recommended = Math.max(1, Math.min(15, recommended));
    return { recommendedCommissionPercent: recommended };
  }
}
