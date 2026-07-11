import { randomUUID } from "node:crypto";
import {
  ArchitectureCompatibilityReport,
  ArchitectureEvolutionSimulation,
  ArchitectureMutationPlan,
  ArchitectureSnapshot,
} from "./contracts";

export class MultiVersionArchitectureEvolutionSimulator {
  simulate(
    baseline: ArchitectureSnapshot,
    plan: ArchitectureMutationPlan,
    compatibility:
      ArchitectureCompatibilityReport,
  ): ArchitectureEvolutionSimulation {
    const candidate:
      ArchitectureSnapshot = {
      ...structuredClone(baseline),
      id: randomUUID(),
      version:
        this.incrementVersion(
          baseline.version,
        ),
      nodes:
        baseline.nodes.map(
          (node) => {
            const related =
              plan.mutations.filter(
                (mutation) =>
                  mutation.target ===
                  node.key,
              );

            return {
              ...structuredClone(node),
              complexity:
                this.clamp(
                  node.complexity +
                    related.reduce(
                      (total, mutation) =>
                        total +
                        mutation.complexityDelta,
                      0,
                    ),
                ),
              maintainability:
                this.clamp(
                  node.maintainability +
                    related.reduce(
                      (total, mutation) =>
                        total +
                        mutation.maintainabilityDelta,
                      0,
                    ),
                ),
              resilience:
                this.clamp(
                  node.resilience +
                    related.reduce(
                      (total, mutation) =>
                        total +
                        mutation.resilienceDelta,
                      0,
                    ),
                ),
            };
          },
        ),
      createdAt:
        new Date().toISOString(),
    };

    const risks =
      plan.mutations
        .filter(
          (mutation) =>
            mutation.expectedRisk >= 50,
        )
        .map(
          (mutation) =>
            `${mutation.key}: risk ${mutation.expectedRisk}`,
        );

    const benefits =
      plan.mutations.map(
        (mutation) =>
          `${mutation.key}: benefit ${mutation.expectedBenefit}`,
      );

    const projectedScore =
      Math.round(
        (
          plan.projectedMaintainability +
          plan.projectedResilience +
          compatibility.score +
          (100 -
            plan.projectedComplexity)
        ) /
          4,
      );

    const confidence =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            compatibility.score -
              risks.length * 5 +
              plan.mutations.filter(
                (mutation) =>
                  mutation.reversible,
              ).length *
                2,
          ),
        ),
      );

    return {
      baseline:
        structuredClone(baseline),
      candidate,
      plan:
        structuredClone(plan),
      compatibility:
        structuredClone(
          compatibility,
        ),
      projectedScore,
      confidence,
      risks,
      benefits,
      simulatedAt:
        new Date().toISOString(),
    };
  }

  private incrementVersion(
    version: string,
  ): string {
    const match =
      version.match(
        /^(\d+)\.(\d+)\.(\d+)/,
      );

    if (!match) {
      return `${version}.evolved`;
    }

    return [
      Number(match[1]),
      Number(match[2]) + 1,
      0,
    ].join(".");
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
