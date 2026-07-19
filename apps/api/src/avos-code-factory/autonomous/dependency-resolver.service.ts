import { Injectable } from "@nestjs/common";
import {
  CompiledFactoryBlueprint,
  DependencyResolution,
} from "../contracts/autonomous-factory.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryDependencyResolverService {
  resolve(blueprint: CompiledFactoryBlueprint): DependencyResolution {
    const graph: Record<string, string[]> = {};
    const known = new Set(
      blueprint.capabilities.map((capability) => capability.id),
    );
    const missingDependencies: string[] = [];

    for (const capability of blueprint.capabilities) {
      graph[capability.id] = [...capability.dependencies];

      for (const dependency of capability.dependencies) {
        if (!known.has(dependency)) {
          missingDependencies.push(
            `${capability.id} -> ${dependency}`,
          );
        }
      }
    }

    const cyclicDependencies = this.detectCycles(graph);
    const topologicalOrder =
      missingDependencies.length || cyclicDependencies.length
        ? []
        : this.topologicalSort(graph);

    return {
      id: createFactoryId("factory-dependency-resolution"),
      blueprintId: blueprint.id,
      valid:
        missingDependencies.length === 0 &&
        cyclicDependencies.length === 0,
      graph,
      topologicalOrder,
      missingDependencies,
      cyclicDependencies,
      resolvedAt: new Date().toISOString(),
    };
  }

  private detectCycles(graph: Record<string, string[]>) {
    const cycles: string[][] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const path: string[] = [];

    const visit = (node: string) => {
      if (visiting.has(node)) {
        const start = path.indexOf(node);
        cycles.push([...path.slice(start), node]);
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      path.push(node);

      for (const dependency of graph[node] ?? []) {
        if (graph[dependency]) {
          visit(dependency);
        }
      }

      path.pop();
      visiting.delete(node);
      visited.add(node);
    };

    Object.keys(graph).forEach(visit);
    return cycles;
  }

  private topologicalSort(graph: Record<string, string[]>) {
    const result: string[] = [];
    const visited = new Set<string>();

    const visit = (node: string) => {
      if (visited.has(node)) {
        return;
      }

      visited.add(node);

      for (const dependency of graph[node] ?? []) {
        visit(dependency);
      }

      result.push(node);
    };

    Object.keys(graph).forEach(visit);
    return result;
  }
}
