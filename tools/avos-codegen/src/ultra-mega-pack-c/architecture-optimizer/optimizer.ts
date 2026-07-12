import {
  UltraCFinding,
  UltraCSeverity,
} from "../contracts";
import {
  ArchitectureOptimizationAction,
  ArchitectureOptimizationInput,
  ArchitectureOptimizationResult,
} from "./contracts";

export class AiArchitectureOptimizer {
  optimize(
    input: ArchitectureOptimizationInput,
  ): ArchitectureOptimizationResult {
    const actions: ArchitectureOptimizationAction[] = [];
    const findings: UltraCFinding[] = [];

    for (const node of input.nodes) {
      if (node.complexity >= 75) {
        actions.push({
          key: `reduce-complexity-${node.key}`,
          target: node.key,
          type: "refactor",
          description: `Reduce complexity of ${node.key}.`,
          expectedBenefit: 75,
          expectedRisk: 35,
          controls: ["regression-tests", "rollback-plan"],
        });
      }

      if (node.maintainability <= 45) {
        actions.push({
          key: `improve-maintainability-${node.key}`,
          target: node.key,
          type: "replace",
          description: `Improve maintainability of ${node.key}.`,
          expectedBenefit: 70,
          expectedRisk: 45,
          controls: ["compatibility-check"],
        });
      }

      if (node.resilience <= 45) {
        actions.push({
          key: `increase-resilience-${node.key}`,
          target: node.key,
          type: "isolate",
          description: `Increase resilience of ${node.key}.`,
          expectedBenefit: 65,
          expectedRisk: 30,
          controls: ["health-check", "failure-injection-test"],
        });
      }

      if (node.dependencies.includes(node.key)) {
        findings.push({
          code: "SELF_DEPENDENCY",
          severity: UltraCSeverity.ERROR,
          message: `Node ${node.key} depends on itself.`,
          subject: node.key,
          metadata: {},
        });
      }
    }

    const scoreBefore = this.score(input.nodes);
    const gain =
      actions.reduce(
        (sum, action) =>
          sum + Math.max(0, action.expectedBenefit - action.expectedRisk),
        0,
      ) / Math.max(1, input.nodes.length);

    return {
      systemKey: input.systemKey,
      scoreBefore,
      scoreAfter: Math.max(
        0,
        Math.min(100, Math.round(scoreBefore + gain * 0.25)),
      ),
      actions,
      findings,
      optimizedAt: new Date().toISOString(),
    };
  }

  private score(nodes: readonly ArchitectureOptimizationInput["nodes"][number][]): number {
    if (nodes.length === 0) return 0;

    const total = nodes.reduce(
      (sum, node) =>
        sum +
        (100 -
          node.complexity +
          node.maintainability +
          node.resilience +
          (100 - node.cost)) /
          4,
      0,
    );

    return Math.round(total / nodes.length);
  }
}
