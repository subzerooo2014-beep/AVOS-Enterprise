import {
  CodeGenExecutionPlan,
} from "../contracts/codegen-planning.contracts";

export interface CodeGenParallelGroup {
  stageIndex: number;
  groupIndex: number;
  artifactKeys: string[];
  totalWeight: number;
}

export class CodeGenParallelGroupPlanner {
  plan(
    executionPlan:
      CodeGenExecutionPlan,
    maxParallel: number,
  ): CodeGenParallelGroup[] {
    const groups:
      CodeGenParallelGroup[] = [];

    for (
      const stage of
      executionPlan.stages
    ) {
      const nodes =
        stage.artifactKeys
          .map(
            (key) =>
              executionPlan.nodes.find(
                (node) =>
                  node.key === key,
              ),
          )
          .filter(
            (
              node,
            ): node is NonNullable<
              typeof node
            > =>
              Boolean(node),
          )
          .sort(
            (left, right) =>
              right.artifact.content.length -
              left.artifact.content.length,
          );

      const buckets:
        Array<{
          keys: string[];
          weight: number;
        }> =
        Array.from(
          {
            length:
              Math.max(
                1,
                Math.min(
                  maxParallel,
                  nodes.length,
                ),
              ),
          },
          () => ({
            keys: [],
            weight: 0,
          }),
        );

      for (const node of nodes) {
        const bucket =
          buckets
            .slice()
            .sort(
              (left, right) =>
                left.weight -
                right.weight,
            )[0]!;

        bucket.keys.push(
          node.key,
        );

        bucket.weight +=
          Math.max(
            1,
            Math.ceil(
              node.artifact.content.length /
              1000,
            ),
          );
      }

      buckets.forEach(
        (bucket, groupIndex) => {
          if (
            bucket.keys.length >
            0
          ) {
            groups.push({
              stageIndex:
                stage.index,
              groupIndex,
              artifactKeys:
                bucket.keys,
              totalWeight:
                bucket.weight,
            });
          }
        },
      );
    }

    return groups;
  }
}
