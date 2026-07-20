import { Injectable } from "@nestjs/common";
import { AeosPlan } from "./aeos.contracts";

@Injectable()
export class ResourceOptimizationService {
  optimize(plan: AeosPlan) {
    const ordered = [...plan.steps].sort((a, b) => {
      const aRatio = a.estimatedValue / Math.max(a.estimatedCost, 1);
      const bRatio = b.estimatedValue / Math.max(b.estimatedCost, 1);
      return bRatio - aRatio;
    });

    const totalCost = ordered.reduce(
      (sum, step) => sum + step.estimatedCost,
      0,
    );
    const totalValue = ordered.reduce(
      (sum, step) => sum + step.estimatedValue,
      0,
    );

    return {
      planId: plan.id,
      recommendedOrder: ordered.map((step) => step.id),
      totalCost,
      totalValue,
      valueCostRatio: Number(
        (totalValue / Math.max(totalCost, 1)).toFixed(4),
      ),
      optimizationScore: Math.min(
        100,
        Math.round((totalValue / Math.max(totalCost, 1)) * 40),
      ),
      optimizedAt: new Date().toISOString(),
    };
  }
}