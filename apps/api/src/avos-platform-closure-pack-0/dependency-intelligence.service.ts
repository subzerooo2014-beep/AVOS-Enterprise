import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import {
  ArchitectureInventory,
  DependencyEdge,
} from './platform-closure-pack-0.types';

@Injectable()
export class DependencyIntelligenceService {
  analyze(inventory: ArchitectureInventory): {
    edges: DependencyEdge[];
    unresolved: DependencyEdge[];
    circularDependencies: string[][];
  } {
    const byPath = new Map(
      inventory.components.map((component) => [
        this.normalizePath(component.relativePath.replace(/\.(ts|tsx|js|jsx)$/i, '')),
        component.id,
      ]),
    );

    const edges: DependencyEdge[] = [];

    for (const component of inventory.components) {
      const sourceDirectory = path.posix.dirname(component.relativePath);

      for (const importExpression of component.imports) {
        if (!importExpression.startsWith('.')) continue;

        const targetPath = this.normalizePath(
          path.posix.normalize(path.posix.join(sourceDirectory, importExpression)),
        );

        const targetId =
          byPath.get(targetPath) ??
          byPath.get(`${targetPath}/index`) ??
          byPath.get(targetPath.replace(/\/index$/, ''));

        edges.push({
          from: component.id,
          to: targetId ?? targetPath,
          importExpression,
          resolved: Boolean(targetId),
        });
      }
    }

    const unresolved = edges.filter((edge) => !edge.resolved);
    const circularDependencies = this.findCycles(edges.filter((edge) => edge.resolved));

    return { edges, unresolved, circularDependencies };
  }

  private findCycles(edges: DependencyEdge[]): string[][] {
    const graph = new Map<string, string[]>();
    for (const edge of edges) {
      graph.set(edge.from, [...(graph.get(edge.from) ?? []), edge.to]);
    }

    const cycles = new Map<string, string[]>();
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const stack: string[] = [];

    const visit = (node: string): void => {
      if (visiting.has(node)) {
        const start = stack.indexOf(node);
        const cycle = [...stack.slice(start), node];
        const key = [...new Set(cycle)].sort().join('|');
        cycles.set(key, cycle);
        return;
      }

      if (visited.has(node)) return;

      visiting.add(node);
      stack.push(node);
      for (const next of graph.get(node) ?? []) visit(next);
      stack.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const node of graph.keys()) visit(node);
    return [...cycles.values()];
  }

  private normalizePath(value: string): string {
    return value.replace(/\\/g, '/').replace(/^\.\//, '');
  }
}