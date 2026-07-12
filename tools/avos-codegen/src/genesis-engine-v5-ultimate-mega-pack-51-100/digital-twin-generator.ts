import {
  V5DigitalTwinNode,
  V5UltimateInput,
} from "./contracts";

export class V5EnterpriseDigitalTwinGenerator {
  generate(input: V5UltimateInput): V5DigitalTwinNode[] {
    return [
      ...input.capabilities.map((capability) => ({
        key: capability.key,
        type: "capability" as const,
        health: capability.maturity,
        relationships: capability.dependencies,
      })),
      ...input.strategicGoals.map((goal, index) => ({
        key: `goal-${index + 1}`,
        type: "goal" as const,
        health: 80,
        relationships: input.capabilities
          .slice(0, Math.max(1, Math.ceil(input.capabilities.length / 2)))
          .map((capability) => capability.key),
      })),
      ...input.legacySystems.map((system) => ({
        key: system,
        type: "system" as const,
        health: 60,
        relationships: [],
      })),
      ...input.governancePrinciples.map((principle, index) => ({
        key: `policy-${index + 1}`,
        type: "policy" as const,
        health: 100,
        relationships: input.capabilities.map((capability) => capability.key),
      })),
    ];
  }
}
