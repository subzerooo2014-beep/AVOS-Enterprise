import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenArtifactGraphV2,
  CodeGenArtifactGraphV2Node,
} from "./codegen-artifact-graph-v2.contracts";

export class CodeGenArtifactGraphBuilderV2 {
  build(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
  ): CodeGenArtifactGraphV2 {
    const byKey =
      new Map(
        artifacts.map(
          (artifact) => [
            artifact.key,
            artifact,
          ],
        ),
      );

    const unresolvedDependencies:
      Record<
        string,
        string[]
      > = {};

    const nodes:
      CodeGenArtifactGraphV2Node[] =
      artifacts.map(
        (artifact) => {
          const unresolved =
            artifact.dependencies
              .filter(
                (dependencyKey) =>
                  !byKey.has(
                    dependencyKey,
                  ),
              );

          if (
            unresolved.length >
            0
          ) {
            unresolvedDependencies[
              artifact.key
            ] =
              unresolved;
          }

          const dependents =
            artifacts
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
            root:
              artifact.dependencies.length ===
              0,
            leaf:
              dependents.length ===
              0,
          };
        },
      );

    const depthMemo =
      new Map<string, number>();

    const depthOf = (
      key: string,
      active =
        new Set<string>(),
    ): number => {
      const cached =
        depthMemo.get(key);

      if (
        cached !== undefined
      ) {
        return cached;
      }

      if (active.has(key)) {
        return 0;
      }

      active.add(key);

      const node =
        nodes.find(
          (candidate) =>
            candidate.key ===
            key,
        );

      if (!node) {
        return 0;
      }

      const depth =
        node.dependencies.length ===
        0
          ? 0
          : 1 +
            Math.max(
              ...node.dependencies.map(
                (dependencyKey) =>
                  depthOf(
                    dependencyKey,
                    new Set(active),
                  ),
              ),
            );

      depthMemo.set(
        key,
        depth,
      );

      return depth;
    };

    for (const node of nodes) {
      node.depth =
        depthOf(
          node.key,
        );
    }

    return {
      nodes,
      roots:
        nodes
          .filter(
            (node) =>
              node.root,
          )
          .map(
            (node) =>
              node.key,
          ),
      leaves:
        nodes
          .filter(
            (node) =>
              node.leaf,
          )
          .map(
            (node) =>
              node.key,
          ),
      unresolvedDependencies,
      cycles:
        this.detectCycles(
          nodes,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private detectCycles(
    nodes:
      readonly CodeGenArtifactGraphV2Node[],
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

    const cycles: string[][] = [];
    const signatures =
      new Set<string>();

    const visit = (
      key: string,
      stack: string[],
      active:
        Set<string>,
      visited:
        Set<string>,
    ): void => {
      if (active.has(key)) {
        const start =
          stack.indexOf(key);

        const cycle = [
          ...stack.slice(start),
          key,
        ];

        const signature =
          cycle.join("->");

        if (
          !signatures.has(
            signature,
          )
        ) {
          signatures.add(
            signature,
          );
          cycles.push(
            cycle,
          );
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
        byKey.get(key);

      if (node) {
        for (
          const dependencyKey of
          node.dependencies
        ) {
          if (
            byKey.has(
              dependencyKey,
            )
          ) {
            visit(
              dependencyKey,
              stack,
              active,
              visited,
            );
          }
        }
      }

      stack.pop();
      active.delete(key);
    };

    const visited =
      new Set<string>();

    for (const node of nodes) {
      visit(
        node.key,
        [],
        new Set<string>(),
        visited,
      );
    }

    return cycles;
  }
}
