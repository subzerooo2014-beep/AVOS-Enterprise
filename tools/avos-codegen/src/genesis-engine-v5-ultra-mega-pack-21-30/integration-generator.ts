import {
  V5BusinessRuntimeInput,
  V5IntegrationContract,
} from "./contracts";

export class V5EnterpriseIntegrationGenerator {
  contracts(
    input: V5BusinessRuntimeInput,
  ): V5IntegrationContract[] {
    return input.partners.map((partner, index) => ({
      partnerKey: partner,
      protocol:
        index % 3 === 0
          ? "rest"
          : index % 3 === 1
            ? "event"
            : "file",
      authentication:
        index % 2 === 0 ? "oauth2" : "mtls",
      operations: [
        "submit-transaction",
        "query-status",
        "receive-settlement",
        "submit-reconciliation",
      ],
    }));
  }

  apiProducts(input: V5BusinessRuntimeInput) {
    return input.marketplaceDomains.map((domain) => ({
      key: `${domain.key}-api-product`,
      audience: ["partner", "seller", "internal"],
      rateLimitPerMinute: domain.riskLevel === "high" ? 300 : 1000,
      monetizationEnabled: true,
      versioningStrategy: "semantic-versioning",
    }));
  }
}
