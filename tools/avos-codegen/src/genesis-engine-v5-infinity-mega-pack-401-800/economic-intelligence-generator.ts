import {
  V5EconomicIntelligenceModel,
  V5InfinityInput,
} from "./contracts";

export class V5GlobalEconomicIntelligenceGenerator {
  generate(input: V5InfinityInput): V5EconomicIntelligenceModel[] {
    return input.economies.map((economy) => ({
      economy,
      forecastHorizonYears: 25,
      autonomousAllocation: true,
      interventionThreshold: 80,
    }));
  }

  resourceEconomy(input: V5InfinityInput) {
    const perPool =
      input.resourcePools.length === 0
        ? 0
        : Math.round(
            input.annualAutonomyBudget / input.resourcePools.length,
          );

    return input.resourcePools.map((pool) => ({
      pool,
      allocation: perPool,
      pricingMode: "dynamic-impact-based",
      autonomousRebalancing: true,
      reservePercent: 20,
    }));
  }
}
