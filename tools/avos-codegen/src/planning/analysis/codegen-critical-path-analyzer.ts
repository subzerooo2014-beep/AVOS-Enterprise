import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";
import {
  CodeGenCriticalPathResult,
} from "../graph/codegen-dependency-graph.contracts";
import {
  CodeGenTopologicalSorter,
} from "../algorithms/codegen-topological-sorter";

export class CodeGenCriticalPathAnalyzer {
  constructor(
    readonly sorter =
      new CodeGenTopologicalSorter(),
  ) {}

  analyze(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenCriticalPathResult {
    const sorted =
      this.sorter.sort(graph);

    if (!sorted.valid) {
      return {
        artifactKeys: [],
        totalWeight: 0,
        stages: 0,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const distances =
      new Map<string, number>();

    const previous =
      new Map<string, string>();

    for (
      const key of
      sorted.orderedKeys
    ) {
      const node =
        graph.getNode(key);

      const base =
        node.weight;

      if (
        node.incoming.length === 0
      ) {
        distances.set(
          key,
          base,
        );

        continue;
      }

      let bestDependency:
        string | undefined;

      let bestDistance = -1;

      for (
        const dependencyKey of
        node.incoming
      ) {
        const distance =
          distances.get(
            dependencyKey,
          ) ?? 0;

        if (
          distance >
          bestDistance
        ) {
          bestDistance =
            distance;
          bestDependency =
            dependencyKey;
        }
      }

      distances.set(
        key,
        bestDistance +
          base,
      );

      if (bestDependency) {
        previous.set(
          key,
          bestDependency,
        );
      }
    }

    const terminal =
      Array.from(
        distances.entries(),
      )
        .sort(
          (left, right) =>
            right[1] -
            left[1],
        )[0];

    if (!terminal) {
      return {
        artifactKeys: [],
        totalWeight: 0,
        stages: 0,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const path: string[] = [];

    let cursor:
      string | undefined =
      terminal[0];

    while (cursor) {
      path.unshift(cursor);
      cursor =
        previous.get(cursor);
    }

    return {
      artifactKeys:
        path,
      totalWeight:
        terminal[1],
      stages:
        path.length,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
