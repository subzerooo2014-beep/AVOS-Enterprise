import {
  GenesisBlueprintComposition,
  GenesisCapabilityGraph,
  GenesisCapabilityNode,
  GenesisSystemSpecification,
} from "./contracts";

export class GenesisCapabilityGraphBuilder {
  build(
    specification:
      GenesisSystemSpecification,
    composition:
      GenesisBlueprintComposition,
  ): GenesisCapabilityGraph {
    const nodes:
      GenesisCapabilityNode[] =
      specification.capabilities.map(
        (capability) => ({
          key: capability.key,
          required: capability.required,
          dependencies: [
            ...capability.dependencies,
          ],
          providers: [
            ...(
              composition.capabilityCoverage[
                capability.key
              ] ?? []
            ),
          ],
        }),
      );

    const edges =
      nodes.flatMap((node) =>
        node.dependencies.map(
          (dependency) => ({
            from: node.key,
            to: dependency,
          }),
        ),
      );

    return {
      systemId: specification.id,
      nodes,
      edges,
      cycles:
        this.detectCycles(nodes),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private detectCycles(
    nodes:
      readonly GenesisCapabilityNode[],
  ): string[][] {
    const byKey =
      new Map(
        nodes.map((node) => [
          node.key,
          node,
        ]),
      );

    const cycles: string[][] = [];
    const visited = new Set<string>();
    const active = new Set<string>();

    const visit = (
      key: string,
      path: string[],
    ): void => {
      if (active.has(key)) {
        const start =
          path.indexOf(key);

        cycles.push(
          start >= 0
            ? [
                ...path.slice(start),
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

      const node = byKey.get(key);

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
