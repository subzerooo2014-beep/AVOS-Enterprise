export interface TreasuryAccount {
  key: string;
  balance: number;
  minimumReserve: number;
  expectedOutflow: number;
  expectedInflow: number;
  riskPercent: number;
}

export interface TreasuryAllocationTarget {
  key: string;
  requestedCapital: number;
  expectedYieldPercent: number;
  strategicPriority: number;
  liquidityClass: "high" | "medium" | "low";
}

export interface TreasuryAllocation {
  targetKey: string;
  allocatedCapital: number;
  expectedYield: number;
  score: number;
  fullyFunded: boolean;
}

export interface AutonomousTreasuryIntelligenceResult {
  availableLiquidity: number;
  allocations: TreasuryAllocation[];
  projectedYield: number;
  liquidityScore: number;
  optimizedAt: string;
}

export class AutonomousTreasuryIntelligence {
  optimize(
    accounts: readonly TreasuryAccount[],
    targets: readonly TreasuryAllocationTarget[],
  ): AutonomousTreasuryIntelligenceResult {
    const availableLiquidity = Math.max(
      0,
      accounts.reduce(
        (sum, account) =>
          sum +
          account.balance +
          account.expectedInflow -
          account.expectedOutflow -
          account.minimumReserve,
        0,
      ),
    );

    let remaining = availableLiquidity;

    const ranked = targets
      .map((target) => ({
        target,
        score: Math.max(
          0,
          Math.min(
            100,
            Math.round(
              target.strategicPriority * 0.45 +
                Math.min(100, target.expectedYieldPercent * 4) * 0.35 +
                (target.liquidityClass === "high"
                  ? 100
                  : target.liquidityClass === "medium"
                    ? 75
                    : 50) *
                  0.2,
            ),
          ),
        ),
      }))
      .sort((a, b) => b.score - a.score);

    const allocations: TreasuryAllocation[] = [];

    for (const item of ranked) {
      const allocatedCapital = Math.min(
        remaining,
        item.target.requestedCapital,
      );

      remaining -= allocatedCapital;

      allocations.push({
        targetKey: item.target.key,
        allocatedCapital,
        expectedYield:
          Math.round(
            allocatedCapital *
              (item.target.expectedYieldPercent / 100) *
              100,
          ) / 100,
        score: item.score,
        fullyFunded: allocatedCapital >= item.target.requestedCapital,
      });
    }

    const projectedYield = Math.round(
      allocations.reduce(
        (sum, allocation) => sum + allocation.expectedYield,
        0,
      ) * 100,
    ) / 100;

    const liquidityScore =
      accounts.length === 0
        ? 100
        : Math.max(
            0,
            Math.min(
              100,
              Math.round(
                accounts.reduce((sum, account) => {
                  const net =
                    account.balance +
                    account.expectedInflow -
                    account.expectedOutflow;
                  const reserveRatio =
                    account.minimumReserve <= 0
                      ? 100
                      : (net / account.minimumReserve) * 100;
                  return sum + Math.min(100, reserveRatio - account.riskPercent);
                }, 0) / accounts.length,
              ),
            ),
          );

    return {
      availableLiquidity: Math.round(availableLiquidity * 100) / 100,
      allocations,
      projectedYield,
      liquidityScore,
      optimizedAt: new Date().toISOString(),
    };
  }
}
