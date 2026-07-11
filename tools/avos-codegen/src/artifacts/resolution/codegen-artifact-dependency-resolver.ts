import {
  CodeGenArtifactGraph,
} from "../graph/codegen-artifact-graph";
import {
  CodeGenResolvedArtifactPlan,
} from "../codegen-artifact.contracts";

export class CodeGenArtifactDependencyResolver {
  resolve(
    graph: CodeGenArtifactGraph,
  ): CodeGenResolvedArtifactPlan {
    const nodes = graph.list();

    const unresolvedDependencies =
      nodes.flatMap((node) =>
        node.artifact.dependencies
          .filter(
            (dependencyKey) =>
              !graph.find(
                dependencyKey,
              ),
          )
          .map((dependencyKey) => ({
            artifactKey:
              node.artifact.key,
            dependencyKey,
          })),
      );

    const circularDependencies =
      this.findCycles(graph);

    if (
      unresolvedDependencies.length >
        0 ||
      circularDependencies.length > 0
    ) {
      return {
        orderedArtifacts: [],
        levels: [],
        unresolvedDependencies,
        circularDependencies,
        valid: false,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const indegree =
      new Map<string, number>();

    const dependents =
      new Map<string, string[]>();

    for (const node of nodes) {
      indegree.set(
        node.artifact.key,
        node.artifact.dependencies
          .length,
      );

      for (
        const dependencyKey of
        node.artifact.dependencies
      ) {
        const list =
          dependents.get(
            dependencyKey,
          ) ?? [];

        list.push(
          node.artifact.key,
        );

        dependents.set(
          dependencyKey,
          list,
        );
      }
    }

    let ready =
      Array.from(
        indegree.entries(),
      )
        .filter(
          ([, count]) =>
            count === 0,
        )
        .map(([key]) => key)
        .sort();

    const levels: string[][] = [];
    const orderedKeys: string[] = [];

    while (ready.length > 0) {
      const level = [...ready];

      levels.push(level);
      orderedKeys.push(...level);

      const nextReady: string[] = [];

      for (const key of level) {
        for (
          const dependentKey of
          dependents.get(key) ?? []
        ) {
          const next =
            (indegree.get(
              dependentKey,
            ) ?? 0) - 1;

          indegree.set(
            dependentKey,
            next,
          );

          if (next === 0) {
            nextReady.push(
              dependentKey,
            );
          }
        }
      }

      ready =
        Array.from(
          new Set(nextReady),
        ).sort();
    }

    return {
      orderedArtifacts:
        orderedKeys.map(
          (key) =>
            graph.get(key)
              .artifact,
        ),
      levels,
      unresolvedDependencies,
      circularDependencies,
      valid:
        orderedKeys.length ===
        nodes.length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private findCycles(
    graph: CodeGenArtifactGraph,
  ): string[][] {
    const cycles: string[][] = [];
    const visited =
      new Set<string>();
    const active =
      new Set<string>();
    const stack: string[] = [];

    const visit = (
      key: string,
    ): void => {
      if (active.has(key)) {
        const index =
          stack.indexOf(key);

        cycles.push([
          ...stack.slice(index),
          key,
        ]);

        return;
      }

      if (visited.has(key)) {
        return;
      }

      visited.add(key);
      active.add(key);
      stack.push(key);

      const node =
        graph.find(key);

      if (node) {
        for (
          const dependencyKey of
          node.artifact.dependencies
        ) {
          if (
            graph.find(
              dependencyKey,
            )
          ) {
            visit(
              dependencyKey,
            );
          }
        }
      }

      stack.pop();
      active.delete(key);
    };

    for (const node of graph.list()) {
      visit(
        node.artifact.key,
      );
    }

    return cycles;
  }
}
