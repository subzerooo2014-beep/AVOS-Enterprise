import {
  CodeGenPlanningNode,
} from "../contracts/codegen-planning.contracts";

export class CodeGenArtifactPriorityCalculator {
  calculate(
    node:
      CodeGenPlanningNode,
  ): number {
    const dependencyBoost =
      node.dependencies.length *
      10;

    const dependentBoost =
      node.dependents.length *
      20;

    const depthPenalty =
      node.depth *
      5;

    return Math.max(
      0,
      100 +
      dependentBoost +
      dependencyBoost -
      depthPenalty,
    );
  }
}
