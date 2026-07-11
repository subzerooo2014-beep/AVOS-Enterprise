import { randomUUID } from "node:crypto";
import {
  SystemGenerationPlan,
  SystemGenerationPlanStep,
  SystemGenerationRequest,
} from "./contracts";
import {
  SystemGenerationDependencyGraphBuilder,
} from "./dependency-graph-builder";

export class SystemGenerationPlanBuilder {
  constructor(
    readonly graphBuilder =
      new SystemGenerationDependencyGraphBuilder(),
  ) {}

  build(
    request:
      SystemGenerationRequest,
  ): SystemGenerationPlan {
    const graph =
      this.graphBuilder.build(
        request.components,
      );

    const steps:
      SystemGenerationPlanStep[] =
      [
        this.step(
          "prepare-workspace",
          "Prepare Workspace",
          10,
          [],
        ),
        this.step(
          "resolve-blueprints",
          "Resolve Blueprints",
          20,
          ["prepare-workspace"],
        ),
        ...graph.nodes
          .sort(
            (left, right) =>
              left.depth -
              right.depth,
          )
          .map(
            (
              node,
              index,
            ) =>
              this.step(
                `generate-${node.key}`,
                `Generate ${node.key}`,
                100 + index,
                node.dependencies.map(
                  (dependency) =>
                    `generate-${dependency}`,
                ),
                node.key,
              ),
          ),
        this.step(
          "verify-system",
          "Verify Generated System",
          1000,
          graph.leaves.map(
            (leaf) =>
              `generate-${leaf}`,
          ),
        ),
      ];

    return {
      requestId:
        request.id,
      steps,
      graph,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private step(
    key: string,
    name: string,
    order: number,
    dependencies: string[],
    componentKey?: string,
  ): SystemGenerationPlanStep {
    return {
      id: randomUUID(),
      key,
      name,
      order,
      ...(componentKey
        ? { componentKey }
        : {}),
      dependencies,
      metadata: {},
    };
  }
}
