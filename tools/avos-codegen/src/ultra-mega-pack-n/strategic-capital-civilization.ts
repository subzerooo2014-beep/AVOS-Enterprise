export interface CapitalDomain {
  key: string;
  availableCapital: number;
  reserveRequirement: number;
  expectedReturnPercent: number;
  civilizationPriority: number;
  riskPercent: number;
}

export interface CapitalCivilizationAllocation {
  domainKey: string;
  deployableCapital: number;
  projectedReturn: number;
  allocationScore: number;
}

export interface StrategicCapitalCivilizationResult {
  allocations: CapitalCivilizationAllocation[];
  totalDeployableCapital: number;
  projectedReturn: number;
  capitalScore: number;
  optimizedAt: string;
}

export class StrategicCapitalCivilization {
  optimize(
    domains: readonly CapitalDomain[],
  ): StrategicCapitalCivilizationResult {
    const allocations = domains.map(
      (domain): CapitalCivilizationAllocation => {
        const deployableCapital = Math.max(
          0,
          domain.availableCapital - domain.reserveRequirement,
        );

        const projectedReturn =
          Math.round(
            deployableCapital *
              (domain.expectedReturnPercent / 100) *
              (1 - domain.riskPercent / 100) *
              100,
          ) / 100;

        const allocationScore = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              domain.civilizationPriority * 0.45 +
                Math.min(100, domain.expectedReturnPercent * 4) * 0.35 +
                Math.max(0, 100 - domain.riskPercent) * 0.2,
            ),
          ),
        );

        return {
          domainKey: domain.key,
          deployableCapital,
          projectedReturn,
          allocationScore,
        };
      },
    );

    return {
      allocations,
      totalDeployableCapital:
        Math.round(
          allocations.reduce(
            (sum, allocation) => sum + allocation.deployableCapital,
            0,
          ) * 100,
        ) / 100,
      projectedReturn:
        Math.round(
          allocations.reduce(
            (sum, allocation) => sum + allocation.projectedReturn,
            0,
          ) * 100,
        ) / 100,
      capitalScore:
        allocations.length === 0
          ? 100
          : Math.round(
              allocations.reduce(
                (sum, allocation) => sum + allocation.allocationScore,
                0,
              ) / allocations.length,
            ),
      optimizedAt: new Date().toISOString(),
    };
  }
}
