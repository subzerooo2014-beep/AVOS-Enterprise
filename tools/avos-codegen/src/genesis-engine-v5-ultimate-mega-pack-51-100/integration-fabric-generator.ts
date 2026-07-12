import { V5UltimateInput } from "./contracts";

export class V5UniversalIntegrationFabricGenerator {
  generate(input: V5UltimateInput) {
    return {
      protocols: [
        "rest",
        "graphql",
        "grpc",
        "events",
        "webhooks",
        "sftp",
      ],
      cloudProviders: input.cloudProviders,
      regions: input.regions,
      adapters: input.legacySystems.map((system) => `${system}-adapter`),
      contractVersioningRequired: true,
      transformationRegistryEnabled: true,
      routingPolicy: "policy-aware-dynamic-routing",
    };
  }

  commandPlane(input: V5UltimateInput) {
    return {
      globalCommands: [
        "deploy",
        "rollback",
        "scale",
        "freeze",
        "failover",
        "recover",
      ],
      regions: input.regions,
      approvalRequiredFor: ["freeze", "failover", "recover"],
      evidenceRequired: true,
    };
  }
}
