import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenExecutionPlan,
  CodeGenExecutionStage,
  CodeGenExecutionStageType,
  CodeGenPlanningContext,
  CodeGenPlanningNode,
  CodeGenPlanningStatus,
} from "../contracts/codegen-planning.contracts";

export class CodeGenExecutionPlanBuilder {
  build(
    context:
      CodeGenPlanningContext,
  ): CodeGenExecutionPlan {
    const nodes =
      this.createNodes(
        context,
      );

    const stages =
      this.createStages(
        nodes,
      );

    const orderedArtifactKeys =
      stages.flatMap(
        (stage) =>
          stage.artifactKeys,
      );

    return {
      id:
        randomUUID(),
      executionId:
        context.executionId,
      status:
        CodeGenPlanningStatus.COMPLETED,
      nodes,
      stages,
      orderedArtifactKeys,
      warnings: [],
      errors: [],
      metadata:
        structuredClone(
          context.metadata,
        ),
      createdAt:
        new Date().toISOString(),
      completedAt:
        new Date().toISOString(),
    };
  }

  private createNodes(
    context:
      CodeGenPlanningContext,
  ): CodeGenPlanningNode[] {
    const byKey =
      new Map(
        context.artifacts.map(
          (artifact) => [
            artifact.key,
            artifact,
          ],
        ),
      );

    return context.artifacts.map(
      (artifact) => {
        const blockedBy =
          artifact.dependencies
            .filter(
              (dependencyKey) =>
                !byKey.has(
                  dependencyKey,
                ),
            );

        const dependents =
          context.artifacts
            .filter(
              (candidate) =>
                candidate.dependencies.includes(
                  artifact.key,
                ),
            )
            .map(
              (candidate) =>
                candidate.key,
            );

        return {
          key:
            artifact.key,
          artifact:
            structuredClone(
              artifact,
            ),
          dependencies:
            [...artifact.dependencies],
          dependents,
          depth: 0,
          stage: 0,
          ready:
            blockedBy.length ===
            0,
          blockedBy,
        };
      },
    );
  }

  private createStages(
    nodes:
      CodeGenPlanningNode[],
  ): CodeGenExecutionStage[] {
    const remaining =
      new Map(
        nodes.map(
          (node) => [
            node.key,
            structuredClone(node),
          ],
        ),
      );

    const completed =
      new Set<string>();

    const stages:
      CodeGenExecutionStage[] = [];

    let stageIndex = 0;

    while (
      remaining.size > 0
    ) {
      const ready =
        Array.from(
          remaining.values(),
        )
          .filter(
            (node) =>
              node.dependencies.every(
                (dependencyKey) =>
                  completed.has(
                    dependencyKey,
                  ) ||
                  !remaining.has(
                    dependencyKey,
                  ),
              ),
          )
          .sort(
            (left, right) =>
              left.key.localeCompare(
                right.key,
              ),
          );

      if (
        ready.length === 0
      ) {
        break;
      }

      const artifactKeys =
        ready.map(
          (node) =>
            node.key,
        );

      stages.push({
        index:
          stageIndex,
        type:
          ready.length > 1
            ? CodeGenExecutionStageType.PARALLEL
            : CodeGenExecutionStageType.SERIAL,
        artifactKeys,
        dependsOnStages:
          stageIndex === 0
            ? []
            : [
                stageIndex - 1,
              ],
        canRunInParallel:
          ready.length > 1,
      });

      for (const node of ready) {
        const original =
          nodes.find(
            (candidate) =>
              candidate.key ===
              node.key,
          );

        if (original) {
          original.stage =
            stageIndex;
          original.depth =
            stageIndex;
        }

        remaining.delete(
          node.key,
        );

        completed.add(
          node.key,
        );
      }

      stageIndex += 1;
    }

    return stages;
  }
}
