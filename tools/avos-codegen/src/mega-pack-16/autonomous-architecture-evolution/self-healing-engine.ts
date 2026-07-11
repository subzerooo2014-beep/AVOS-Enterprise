import { randomUUID } from "node:crypto";
import {
  ArchitectureHealingPlan,
  ArchitectureSnapshot,
} from "./contracts";

export class SelfHealingArchitectureEngine {
  createPlan(
    snapshot: ArchitectureSnapshot,
  ): ArchitectureHealingPlan {
    const actions =
      snapshot.nodes
        .filter(
          (node) =>
            node.resilience < 60 ||
            node.maintainability < 50,
        )
        .map(
          (node, index) => ({
            id: randomUUID(),
            key:
              `heal-${node.key}`,
            target:
              node.key,
            description:
              `Heal architecture node ${node.key} using isolation, restart, and dependency validation.`,
            automated:
              node.criticality < 9,
            order:
              (index + 1) * 10,
            dependencies:
              node.dependencies.map(
                (dependency) =>
                  `verify-${dependency}`,
              ),
            controls: [
              "health-check",
              "dependency-validation",
              "rollback-on-failure",
            ],
          }),
        );

    const automationCoverage =
      actions.length === 0
        ? 100
        : Math.round(
            (
              actions.filter(
                (action) =>
                  action.automated,
              ).length /
              actions.length
            ) *
              100,
          );

    return {
      systemKey:
        snapshot.systemKey,
      actions,
      automationCoverage,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
