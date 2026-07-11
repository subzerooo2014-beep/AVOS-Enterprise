import {
  CodeGenDependencyGraph,
} from "../graph/codegen-dependency-graph";
import {
  CodeGenGraphCycle,
} from "../graph/codegen-dependency-graph.contracts";

export class CodeGenGraphCycleDetector {
  detect(
    graph:
      CodeGenDependencyGraph,
  ): CodeGenGraphCycle[] {
    const nodes =
      graph.listNodes();

    const visited =
      new Set<string>();

    const active =
      new Set<string>();

    const stack: string[] = [];

    const cycles:
      CodeGenGraphCycle[] = [];

    const signatures =
      new Set<string>();

    const visit = (
      key: string,
    ): void => {
      if (active.has(key)) {
        const index =
          stack.indexOf(key);

        const path = [
          ...stack.slice(index),
          key,
        ];

        const signature =
          this.normalizeCycle(path);

        if (
          !signatures.has(
            signature,
          )
        ) {
          signatures.add(
            signature,
          );

          cycles.push({
            path,
            signature,
          });
        }

        return;
      }

      if (visited.has(key)) {
        return;
      }

      visited.add(key);
      active.add(key);
      stack.push(key);

      const node =
        graph.findNode(key);

      if (node) {
        for (
          const dependencyKey of
          node.incoming
        ) {
          visit(
            dependencyKey,
          );
        }
      }

      stack.pop();
      active.delete(key);
    };

    for (const node of nodes) {
      visit(node.key);
    }

    return cycles;
  }

  private normalizeCycle(
    path: string[],
  ): string {
    const cycle =
      path.slice(0, -1);

    if (cycle.length === 0) {
      return "";
    }

    const variants =
      cycle.map(
        (_, index) => [
          ...cycle.slice(index),
          ...cycle.slice(0, index),
        ].join("->"),
      );

    return variants.sort()[0] ?? "";
  }
}
