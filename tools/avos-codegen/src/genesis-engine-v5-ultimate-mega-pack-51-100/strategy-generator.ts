import {
  V5StrategicInitiative,
  V5UltimateInput,
} from "./contracts";

export class V5StrategicPlannerGenerator {
  generate(input: V5UltimateInput): V5StrategicInitiative[] {
    return input.strategicGoals.map((goal, index) => ({
      key: `initiative-${index + 1}`,
      goal,
      priority: 10 - Math.min(index, 8),
      requiredCapabilities: input.capabilities
        .filter((capability) => capability.maturity < 90)
        .map((capability) => capability.key),
      expectedImpact: Math.max(70, 95 - index * 3),
    }));
  }

  decisionGraph(input: V5UltimateInput) {
    return {
      nodes: [
        ...input.strategicGoals.map((goal) => ({
          key: goal,
          type: "goal",
        })),
        ...input.capabilities.map((capability) => ({
          key: capability.key,
          type: "capability",
        })),
      ],
      edges: input.strategicGoals.flatMap((goal) =>
        input.capabilities.map((capability) => ({
          source: goal,
          target: capability.key,
          relation: "requires",
        })),
      ),
    };
  }
}
