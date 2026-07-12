import { V5BusinessRuntimeInput } from "./contracts";

export class V5RiskGovernanceGenerator {
  fraudPolicies(input: V5BusinessRuntimeInput) {
    if (input.enableFraudControls === false) return [];

    return input.marketplaceDomains.map((domain) => ({
      key: `${domain.key}.fraud-policy`,
      domainKey: domain.key,
      checks: [
        "identity risk",
        "payment risk",
        "velocity risk",
        "content risk",
        "device risk",
      ],
      decision:
        domain.riskLevel === "high"
          ? "manual-review-on-medium-or-high"
          : "block-high-review-medium",
      evidenceRequired: true,
    }));
  }

  dataGovernance(input: V5BusinessRuntimeInput) {
    return {
      enabled: input.enableDataGovernance !== false,
      classificationLevels: [
        "public",
        "internal",
        "confidential",
        "restricted",
      ],
      lineageRequired: true,
      retentionPolicies: [
        {
          category: "financial",
          retentionYears: 7,
        },
        {
          category: "security",
          retentionYears: 7,
        },
        {
          category: "operational",
          retentionYears: 2,
        },
      ],
      deletionApprovalRequired: true,
    };
  }
}
