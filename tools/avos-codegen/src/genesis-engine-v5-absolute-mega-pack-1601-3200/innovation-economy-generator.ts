import {
  V5AbsoluteInput,
  V5InnovationFlow,
} from "./contracts";

export class V5RecursiveInnovationEconomyGenerator {
  generate(input: V5AbsoluteInput): V5InnovationFlow[] {
    if (input.enableRecursiveInnovation === false) return [];

    const count = Math.max(1, input.innovationDomains.length);
    const allocation = Math.round(input.annualMetaBudget / count);

    return input.innovationDomains.map((domain, index) => ({
      domain,
      allocation,
      autonomousRebalancing: true,
      expectedImpact: 98 - Math.min(index, 10),
    }));
  }

  portfolio(input: V5AbsoluteInput) {
    return {
      domains: input.innovationDomains,
      fundingModel: "impact-risk-value-balanced",
      recursiveReinvestmentPercent: 30,
      reservePercent: 15,
      evidenceRequired: true,
    };
  }
}
