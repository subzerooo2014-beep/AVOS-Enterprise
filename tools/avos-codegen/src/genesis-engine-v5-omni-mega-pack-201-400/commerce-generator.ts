import {
  V5CommerceNetwork,
  V5OmniInput,
} from "./contracts";

export class V5AutonomousCommerceGenerator {
  generate(input: V5OmniInput): V5CommerceNetwork[] {
    if (input.enableAutonomousCommerce === false) return [];

    return input.markets.map((market) => ({
      market,
      participants: input.enterpriseNetworks,
      settlementMode: "real-time-multi-currency",
      dynamicPricing: true,
    }));
  }

  capitalAllocation(input: V5OmniInput) {
    const perDomain =
      input.resourceDomains.length === 0
        ? 0
        : Math.round(
            input.annualCapitalPool / input.resourceDomains.length,
          );

    return input.resourceDomains.map((domain) => ({
      domain,
      allocation: perDomain,
      optimization: "impact-risk-balanced",
      autonomousRebalancing: true,
    }));
  }
}
