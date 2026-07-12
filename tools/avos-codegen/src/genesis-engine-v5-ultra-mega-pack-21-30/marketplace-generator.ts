import {
  V5BusinessRuntimeInput,
  V5CatalogPolicy,
  V5CommissionPolicy,
} from "./contracts";

export class V5MarketplaceRuntimeGenerator {
  catalogs(input: V5BusinessRuntimeInput): V5CatalogPolicy[] {
    return input.marketplaceDomains.map((domain) => ({
      domainKey: domain.key,
      publishRequirements: [
        "validated title and description",
        "verified seller or provider",
        "pricing policy compliance",
        "fraud screening completed",
        "audit evidence recorded",
      ],
      moderationRequired:
        domain.riskLevel !== "low" ||
        domain.type === "advertising",
      versioningEnabled: true,
    }));
  }

  commissions(input: V5BusinessRuntimeInput): V5CommissionPolicy[] {
    return input.marketplaceDomains.map((domain) => ({
      domainKey: domain.key,
      commissionPercent: domain.commissionPercent,
      settlementDays: domain.settlementDays,
      reservePercent:
        domain.riskLevel === "high"
          ? 15
          : domain.riskLevel === "medium"
            ? 7
            : 2,
    }));
  }

  providerRuntime(input: V5BusinessRuntimeInput) {
    return {
      onboardingStates: [
        "draft",
        "verification",
        "approved",
        "active",
        "suspended",
      ],
      requiredChecks: [
        "identity verification",
        "business verification",
        "bank account verification",
        "risk assessment",
        "terms acceptance",
      ],
      domains: input.marketplaceDomains.map((domain) => domain.key),
    };
  }
}
