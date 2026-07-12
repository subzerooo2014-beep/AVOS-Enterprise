import {
  V5DataPlatformPlan,
  V5SupremeRuntimeInput,
} from "./contracts";

export class V5DataPlatformGenerator {
  generate(input: V5SupremeRuntimeInput): V5DataPlatformPlan {
    return {
      lakehouseZones: ["raw", "trusted", "curated", "serving"],
      streamingTopics: input.dataDomains
        .filter((domain) => domain.streamingRequired)
        .map((domain) => `${domain.key}.events`),
      featureStores: input.dataDomains
        .filter((domain) => domain.analyticsRequired)
        .map((domain) => `${domain.key}-feature-store`),
      retentionPolicies: input.dataDomains.map((domain) => ({
        domainKey: domain.key,
        retentionDays:
          domain.classification === "restricted"
            ? 2555
            : domain.classification === "confidential"
              ? 1825
              : 730,
      })),
    };
  }

  lineage(input: V5SupremeRuntimeInput) {
    return {
      enabled: true,
      domains: input.dataDomains.map((domain) => domain.key),
      requiredEdges: [
        "source-to-ingestion",
        "ingestion-to-transformation",
        "transformation-to-serving",
      ],
      qualityRules: [
        "freshness",
        "completeness",
        "uniqueness",
        "schema-conformance",
      ],
    };
  }
}
