import {
  SystemGenerationComponentRequest,
  SystemGenerationDependencyGraph,
  SystemGenerationDependencyNode,
} from "./contracts";

export class SystemGenerationDependencyGraphBuilder {
  build(
    components:
      readonly SystemGenerationComponentRequest[],
  ): SystemGenerationDependencyGraph {
    const byKey =
      new Map(
        components.map(
          (component) => [
            component.key,
            component,
          ],
        ),
      );

    const dependents =
      new Map<
        string,
        Set<string>
      >();

    for (const component of components) {
      dependents.set(
        component.key,
        new Set<string>(),
      );
    }

    for (const component of components) {
      for (
        const dependency of
        component.dependencies
      ) {
        dependents
          .get(dependency)
          ?.add(component.key);
      }
    }

    const cycles =
      this.detectCycles(
        components,
        byKey,
      );

    const nodes:
      SystemGenerationDependencyNode[] =
      components.map(
        (component) => ({
          key:
            component.key,
          dependencies: [
            ...component.dependencies,
          ],
          dependents: [
            ...(
              dependents.get(
                component.key,
              ) ??
              new Set<string>()
            ),
          ],
          depth:
            this.calculateDepth(
              component.key,
              byKey,
              new Set<string>(),
            ),
        }),
      );

    return {
      nodes,
      roots:
        nodes
          .filter(
            (node) =>
              node.dependencies.length ===
              0,
          )
          .map(
            (node) =>
              node.key,
          ),
      leaves:
        nodes
          .filter(
            (node) =>
              node.dependents.length ===
              0,
          )
          .map(
            (node) =>
              node.key,
          ),
      hasCycles:
        cycles.length > 0,
      cycles,
    };
  }

  private calculateDepth(
    key: string,
    byKey:
      ReadonlyMap<
        string,
        SystemGenerationComponentRequest
      >,
    visiting:
      Set<string>,
  ): number {
    if (
      visiting.has(key)
    ) {
      return 0;
    }

    const component =
      byKey.get(key);

    if (
      !component ||
      component.dependencies.length ===
        0
    ) {
      return 0;
    }

    const next =
      new Set(visiting);

    next.add(key);

    return (
      1 +
      Math.max(
        ...component.dependencies.map(
          (dependency) =>
            this.calculateDepth(
              dependency,
              byKey,
              next,
            ),
        ),
      )
    );
  }

  private detectCycles(
    components:
      readonly SystemGenerationComponentRequest[],
    byKey:
      ReadonlyMap<
        string,
        SystemGenerationComponentRequest
      >,
  ): string[][] {
    const cycles: string[][] = [];
    const visited =
      new Set<string>();
    const active =
      new Set<string>();

    const walk = (
      key: string,
      path: string[],
    ): void => {
      if (
        active.has(key)
      ) {
        const start =
          path.indexOf(key);

        cycles.push(
          start >= 0
            ? [
                ...path.slice(start),
                key,
              ]
            : [
                ...path,
                key,
              ],
        );

        return;
      }

      if (
        visited.has(key)
      ) {
        return;
      }

      active.add(key);

      const component =
        byKey.get(key);

      for (
        const dependency of
        component?.dependencies ??
        []
      ) {
        walk(
          dependency,
          [
            ...path,
            key,
          ],
        );
      }

      active.delete(key);
      visited.add(key);
    };

    for (const component of components) {
      walk(
        component.key,
        [],
      );
    }

    return cycles;
  }
}
