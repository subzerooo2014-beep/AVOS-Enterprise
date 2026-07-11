import { randomUUID } from "node:crypto";
import {
  ArchitectureMutation,
  ArchitectureMutationPlan,
  ArchitectureMutationType,
  ArchitectureSnapshot,
} from "./contracts";

export class AutonomousArchitectureMutationPlanner {
  plan(
    snapshot: ArchitectureSnapshot,
  ): ArchitectureMutationPlan {
    const mutations: ArchitectureMutation[] = [];

    for (const node of snapshot.nodes) {
      if (node.complexity >= 80) {
        mutations.push({
          id: randomUUID(),
          key: `split-${node.key}`,
          type: ArchitectureMutationType.SPLIT,
          target: node.key,
          description:
            `Split highly complex architecture node ${node.key}.`,
          expectedBenefit: 75,
          expectedRisk: 45,
          complexityDelta: -25,
          maintainabilityDelta: 20,
          resilienceDelta: 5,
          reversible: true,
          dependencies: [],
          metadata: {
            currentComplexity: node.complexity,
          },
        });
      }

      if (node.maintainability <= 40) {
        mutations.push({
          id: randomUUID(),
          key: `refactor-${node.key}`,
          type: ArchitectureMutationType.REPLACE,
          target: node.key,
          description:
            `Replace low-maintainability implementation of ${node.key}.`,
          expectedBenefit: 70,
          expectedRisk: 50,
          complexityDelta: -10,
          maintainabilityDelta: 30,
          resilienceDelta: 10,
          reversible: true,
          dependencies: [],
          metadata: {
            currentMaintainability:
              node.maintainability,
          },
        });
      }

      if (node.resilience <= 40) {
        mutations.push({
          id: randomUUID(),
          key: `isolate-${node.key}`,
          type: ArchitectureMutationType.ISOLATE,
          target: node.key,
          description:
            `Isolate fragile architecture node ${node.key}.`,
          expectedBenefit: 65,
          expectedRisk: 30,
          complexityDelta: 5,
          maintainabilityDelta: 5,
          resilienceDelta: 30,
          reversible: true,
          dependencies: [],
          metadata: {
            currentResilience: node.resilience,
          },
        });
      }
    }

    const rollbackMutations =
      [...mutations]
        .reverse()
        .map(
          (mutation) => ({
            ...mutation,
            id: randomUUID(),
            key: `rollback-${mutation.key}`,
            description:
              `Rollback mutation ${mutation.key}.`,
          }),
        );

    const nodeCount =
      Math.max(
        1,
        snapshot.nodes.length,
      );

    const baselineComplexity =
      snapshot.nodes.reduce(
        (total, node) =>
          total + node.complexity,
        0,
      ) / nodeCount;

    const baselineMaintainability =
      snapshot.nodes.reduce(
        (total, node) =>
          total + node.maintainability,
        0,
      ) / nodeCount;

    const baselineResilience =
      snapshot.nodes.reduce(
        (total, node) =>
          total + node.resilience,
        0,
      ) / nodeCount;

    return {
      systemKey: snapshot.systemKey,
      mutations,
      rollbackMutations,
      projectedComplexity:
        this.clamp(
          baselineComplexity +
            mutations.reduce(
              (total, mutation) =>
                total +
                mutation.complexityDelta,
              0,
            ) /
              nodeCount,
        ),
      projectedMaintainability:
        this.clamp(
          baselineMaintainability +
            mutations.reduce(
              (total, mutation) =>
                total +
                mutation.maintainabilityDelta,
              0,
            ) /
              nodeCount,
        ),
      projectedResilience:
        this.clamp(
          baselineResilience +
            mutations.reduce(
              (total, mutation) =>
                total +
                mutation.resilienceDelta,
              0,
            ) /
              nodeCount,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private clamp(value: number): number {
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(value),
      ),
    );
  }
}
