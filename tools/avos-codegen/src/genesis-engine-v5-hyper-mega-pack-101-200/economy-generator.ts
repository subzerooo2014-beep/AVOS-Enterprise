import {
  V5EconomicFlow,
  V5HyperEnterpriseInput,
} from "./contracts";

export class V5AutonomousEnterpriseEconomyGenerator {
  flows(input: V5HyperEnterpriseInput): V5EconomicFlow[] {
    if (input.enableAutonomousEconomy === false) return [];

    return input.enterprises.flatMap((enterprise, index) =>
      input.capabilities.slice(0, 3).map((capability, capabilityIndex) => ({
        key: `${enterprise}.${capability}.flow`,
        source: enterprise,
        destination: capability,
        value: Math.round(
          input.annualInnovationBudget /
            Math.max(1, input.enterprises.length * 3) *
            (1 + capabilityIndex * 0.05),
        ),
        autonomous: true,
      })),
    );
  }

  capabilityExchange(input: V5HyperEnterpriseInput) {
    return {
      listedCapabilities: input.capabilities,
      matchingEnabled: true,
      dynamicPricingEnabled: true,
      qualityScoringEnabled: true,
      settlementModel: "usage-and-value-based",
    };
  }

  selfFunding(input: V5HyperEnterpriseInput) {
    return {
      budget: input.annualInnovationBudget,
      fundingPools: [
        "innovation",
        "resilience",
        "security",
        "knowledge",
        "growth",
      ],
      reinvestmentPercent: 25,
      reservePercent: 15,
      optimizationEnabled: true,
    };
  }
}
