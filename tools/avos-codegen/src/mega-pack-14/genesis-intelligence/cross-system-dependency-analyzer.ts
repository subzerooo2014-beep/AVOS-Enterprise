import {
  GenesisDependencyAnalysis,
  GenesisDependencyFinding,
  GenesisDependencyNode,
  GenesisIntelligenceSeverity,
} from "./contracts";

export class CrossSystemDependencyAnalyzer {
  analyze(
    nodes:
      readonly GenesisDependencyNode[],
  ): GenesisDependencyAnalysis {
    const byKey =
      new Map(
        nodes.map(
          (node) => [
            node.key,
            node,
          ],
        ),
      );

    const edges =
      nodes.flatMap(
        (node) =>
          node.dependencies.map(
            (dependency) => ({
              from: node.key,
              to: dependency,
              type: "depends_on",
            }),
          ),
      );

    const missingDependencies =
      Array.from(
        new Set(
          edges
            .filter(
              (edge) =>
                !byKey.has(edge.to),
            )
            .map(
              (edge) =>
                edge.to,
            ),
        ),
      );

    const cycles =
      this.detectCycles(
        nodes,
      );

    const findings:
      GenesisDependencyFinding[] = [];

    if (
      missingDependencies.length > 0
    ) {
      findings.push({
        code:
          "MISSING_DEPENDENCIES",
        severity:
          GenesisIntelligenceSeverity.ERROR,
        message:
          `Dependency graph contains ${missingDependencies.length} missing dependency reference(s).`,
        subjects:
          missingDependencies,
        metadata: {},
      });
    }

    if (cycles.length > 0) {
      findings.push({
        code:
          "DEPENDENCY_CYCLES",
        severity:
          GenesisIntelligenceSeverity.CRITICAL,
        message:
          `Dependency graph contains ${cycles.length} cycle(s).`,
        subjects:
          cycles.flat(),
        metadata: {
          cycles,
        },
      });
    }

    return {
      nodes:
        nodes.map(
          (node) =>
            structuredClone(node),
        ),
      edges,
      cycles,
      missingDependencies,
      findings,
      analyzedAt:
        new Date().toISOString(),
    };
  }

  private detectCycles(
    nodes:
      readonly GenesisDependencyNode[],
  ): string[][] {
    const byKey =
      new Map(
        nodes.map(
          (node) => [
            node.key,
            node,
          ],
        ),
      );

    const visited =
      new Set<string>();

    const active =
      new Set<string>();

    const cycles: string[][] = [];

    const visit = (
      key: string,
      path: string[],
    ): void => {
      if (active.has(key)) {
        const index =
          path.indexOf(key);

        cycles.push(
          index >= 0
            ? [
                ...path.slice(index),
                key,
              ]
            : [...path, key],
        );

        return;
      }

      if (visited.has(key)) {
        return;
      }

      visited.add(key);
      active.add(key);

      const node =
        byKey.get(key);

      if (node) {
        for (
          const dependency of
          node.dependencies
        ) {
          visit(
            dependency,
            [...path, key],
          );
        }
      }

      active.delete(key);
    };

    for (const node of nodes) {
      visit(node.key, []);
    }

    return cycles;
  }
}
