import { randomUUID } from "node:crypto";
import {
  ArchitectureMutation,
  ArchitectureMutationType,
  ArchitectureRefactoringRecommendation,
  ArchitectureSnapshot,
} from "./contracts";

export class IntelligentArchitectureRefactoringPlanner {
  recommend(
    snapshot: ArchitectureSnapshot,
  ): ArchitectureRefactoringRecommendation[] {
    return snapshot.nodes
      .filter(
        (node) =>
          node.complexity >= 70 ||
          node.maintainability <= 50,
      )
      .map(
        (node) => {
          const mutations:
            ArchitectureMutation[] = [
            {
              id: randomUUID(),
              key:
                `refactor-${node.key}`,
              type:
                node.complexity >= 85
                  ? ArchitectureMutationType.SPLIT
                  : ArchitectureMutationType.REPLACE,
              target:
                node.key,
              description:
                `Refactor architecture node ${node.key}.`,
              expectedBenefit:
                Math.max(
                  50,
                  100 -
                    node.maintainability,
                ),
              expectedRisk:
                Math.min(
                  70,
                  node.criticality * 7,
                ),
              complexityDelta:
                -Math.min(
                  30,
                  Math.round(
                    node.complexity * 0.25,
                  ),
                ),
              maintainabilityDelta:
                Math.min(
                  35,
                  Math.round(
                    (
                      100 -
                      node.maintainability
                    ) *
                      0.4,
                  ),
                ),
              resilienceDelta: 10,
              reversible: true,
              dependencies: [],
              metadata: {},
            },
          ];

          return {
            key:
              `recommend-${node.key}`,
            target:
              node.key,
            priority:
              Math.round(
                (
                  node.complexity +
                  (100 -
                    node.maintainability) +
                  node.criticality * 10
                ) /
                  3,
              ),
            description:
              `Improve complexity and maintainability for ${node.key}.`,
            expectedBenefit:
              mutations[0]!.expectedBenefit,
            expectedRisk:
              mutations[0]!.expectedRisk,
            mutations,
          };
        },
      )
      .sort(
        (left, right) =>
          right.priority -
          left.priority,
      );
  }
}
