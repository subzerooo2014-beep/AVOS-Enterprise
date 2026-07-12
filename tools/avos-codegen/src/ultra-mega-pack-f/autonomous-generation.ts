import { randomUUID } from "node:crypto";
import { UltraFValue } from "./contracts";

export interface EnterpriseGenerationGoal {
  key: string;
  description: string;
  priority: number;
  constraints: string[];
  successMetrics: Record<string, number>;
}

export interface GeneratedEnterpriseModule {
  id: string;
  key: string;
  type: "service" | "workflow" | "agent" | "connector" | "policy";
  dependencies: string[];
  capabilities: string[];
  metadata: Record<string, UltraFValue>;
}

export interface AutonomousGenerationPlan {
  systemKey: string;
  goals: string[];
  modules: GeneratedEnterpriseModule[];
  dependencyDepth: number;
  generatedAt: string;
}

export class AutonomousEnterpriseGenerator {
  generate(
    systemKey: string,
    goals: readonly EnterpriseGenerationGoal[],
  ): AutonomousGenerationPlan {
    const orderedGoals = [...goals].sort(
      (left, right) => right.priority - left.priority,
    );

    const modules = orderedGoals.flatMap((goal, index) => {
      const baseKey = goal.key.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

      return [
        {
          id: randomUUID(),
          key: `${baseKey}-service`,
          type: "service" as const,
          dependencies: index === 0 ? [] : [`${orderedGoals[index - 1]?.key}-service`],
          capabilities: [`execute-${baseKey}`, `observe-${baseKey}`],
          metadata: {
            goal: goal.description,
            constraints: goal.constraints,
            successMetrics: goal.successMetrics,
          },
        },
        {
          id: randomUUID(),
          key: `${baseKey}-policy`,
          type: "policy" as const,
          dependencies: [`${baseKey}-service`],
          capabilities: [`govern-${baseKey}`],
          metadata: { priority: goal.priority },
        },
      ];
    });

    return {
      systemKey,
      goals: orderedGoals.map((goal) => goal.key),
      modules,
      dependencyDepth: Math.max(1, orderedGoals.length),
      generatedAt: new Date().toISOString(),
    };
  }
}
