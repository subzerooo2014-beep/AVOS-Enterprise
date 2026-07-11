import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";

export interface CodeGenTopologicalSortResult {
  valid: boolean;
  orderedKeys: string[];
  levels: string[][];
  unresolved: string[];
  generatedAt: string;
}

export class CodeGenTopologicalSorter {
  sort(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenTopologicalSortResult {
    const nodes =
      graph.listNodes();

    const indegree =
      new Map<string, number>();

    for (const node of nodes) {
      indegree.set(
        node.key,
        node.indegree,
      );
    }

    let ready =
      nodes
        .filter(
          (node) =>
            node.indegree === 0,
        )
        .map(
          (node) =>
            node.key,
        )
        .sort();

    const orderedKeys: string[] = [];
    const levels: string[][] = [];

    while (ready.length > 0) {
      const currentLevel =
        [...ready];

      levels.push(
        currentLevel,
      );

      orderedKeys.push(
        ...currentLevel,
      );

      const nextReady: string[] = [];

      for (
        const key of
        currentLevel
      ) {
        const node =
          graph.getNode(key);

        for (
          const dependentKey of
          node.outgoing
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

    const unresolved =
      nodes
        .map(
          (node) =>
            node.key,
        )
        .filter(
          (key) =>
            !orderedKeys.includes(
              key,
            ),
        );

    return {
      valid:
        unresolved.length === 0,
      orderedKeys,
      levels,
      unresolved,
      generatedAt:
        new Date().toISOString(),
    };
  }

  requireValid(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenTopologicalSortResult {
    const result =
      this.sort(graph);

    if (!result.valid) {
      throw new CodeGenValidationError(
        `Dependency graph cannot be sorted. Unresolved nodes: ${result.unresolved.join(", ")}`,
      );
    }

    return result;
  }
}
