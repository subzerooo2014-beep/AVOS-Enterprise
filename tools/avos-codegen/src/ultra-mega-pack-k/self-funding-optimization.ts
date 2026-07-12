export interface FundingCandidate {
  key: string;
  requestedBudget: number;
  expectedReturn: number;
  paybackMonths: number;
  strategicPriority: number;
  riskPercent: number;
}

export interface FundingAllocation {
  key: string;
  allocatedBudget: number;
  expectedReturn: number;
  fundingScore: number;
  fullyFunded: boolean;
}

export interface SelfFundingOptimizationResult {
  allocations: FundingAllocation[];
  remainingBudget: number;
  projectedReturn: number;
  selfFundingRatio: number;
  optimizedAt: string;
}

export class SelfFundingOptimizer {
  optimize(
    availableBudget: number,
    candidates: readonly FundingCandidate[],
  ): SelfFundingOptimizationResult {
    let remainingBudget = Math.max(0, availableBudget);

    const ranked = candidates
      .map((candidate) => ({
        candidate,
        score: Math.max(
          0,
          Math.min(
            100,
            Math.round(
              candidate.strategicPriority * 0.4 +
                Math.min(
                  100,
                  (candidate.expectedReturn /
                    Math.max(1, candidate.requestedBudget)) *
                    50,
                ) *
                  0.35 +
                Math.max(0, 100 - candidate.riskPercent) * 0.15 +
                Math.max(0, 100 - candidate.paybackMonths * 4) * 0.1,
            ),
          ),
        ),
      }))
      .sort((a, b) => b.score - a.score);

    const allocations: FundingAllocation[] = [];

    for (const item of ranked) {
      const allocatedBudget = Math.min(
        remainingBudget,
        item.candidate.requestedBudget,
      );

      remainingBudget -= allocatedBudget;

      const fundedRatio =
        item.candidate.requestedBudget <= 0
          ? 0
          : allocatedBudget / item.candidate.requestedBudget;

      allocations.push({
        key: item.candidate.key,
        allocatedBudget,
        expectedReturn:
          Math.round(item.candidate.expectedReturn * fundedRatio * 100) / 100,
        fundingScore: item.score,
        fullyFunded: allocatedBudget >= item.candidate.requestedBudget,
      });
    }

    const projectedReturn = Math.round(
      allocations.reduce(
        (sum, allocation) => sum + allocation.expectedReturn,
        0,
      ) * 100,
    ) / 100;

    return {
      allocations,
      remainingBudget: Math.round(remainingBudget * 100) / 100,
      projectedReturn,
      selfFundingRatio:
        availableBudget <= 0
          ? 0
          : Math.round((projectedReturn / availableBudget) * 100),
      optimizedAt: new Date().toISOString(),
    };
  }
}
