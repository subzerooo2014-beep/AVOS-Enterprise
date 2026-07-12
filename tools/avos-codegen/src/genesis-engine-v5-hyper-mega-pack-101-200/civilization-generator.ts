import {
  V5CivilizationNode,
  V5HyperEnterpriseInput,
} from "./contracts";

export class V5EnterpriseCivilizationGenerator {
  generate(input: V5HyperEnterpriseInput): V5CivilizationNode[] {
    return [
      ...input.enterprises.map((enterprise, index) => ({
        key: enterprise,
        type: "enterprise" as const,
        influenceScore: 90 - index,
        dependencies: input.capabilities.slice(0, 3),
      })),
      ...input.capabilities.map((capability, index) => ({
        key: capability,
        type: "capability" as const,
        influenceScore: 85 - Math.min(index, 20),
        dependencies: [],
      })),
      ...input.knowledgeDomains.map((domain, index) => ({
        key: domain,
        type: "knowledge" as const,
        influenceScore: 88 - Math.min(index, 15),
        dependencies: input.capabilities.slice(0, 2),
      })),
      ...input.regions.map((region, index) => ({
        key: region,
        type: "region" as const,
        influenceScore: 80 - index,
        dependencies: input.enterprises,
      })),
    ];
  }

  coordination(input: V5HyperEnterpriseInput) {
    return {
      councils: [
        "strategy-council",
        "security-council",
        "innovation-council",
        "economy-council",
        "knowledge-council",
      ],
      enterprises: input.enterprises,
      consensusThreshold: 75,
      emergencyOverrideEnabled: true,
      evidenceRequired: true,
    };
  }
}
