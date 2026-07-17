import { Injectable } from '@nestjs/common';
import { CapabilityDescriptor } from '../contracts/runtime.contracts';
import { RuntimeInvariantError } from '../shared/runtime.errors';

@Injectable()
export class DependencyGraphService {
  build(capabilities: CapabilityDescriptor[]): Map<string, string[]> {
    return new Map(
      capabilities.map((item) => [item.id, [...item.dependencies]]),
    );
  }

  validate(capabilities: CapabilityDescriptor[]): {
    valid: boolean;
    missing: Array<{ capability: string; dependency: string }>;
    cycles: string[][];
  } {
    const ids = new Set(capabilities.map((item) => item.id));
    const missing = capabilities.flatMap((item) =>
      item.dependencies
        .filter((dependency) => !ids.has(dependency))
        .map((dependency) => ({
          capability: item.id,
          dependency,
        })),
    );

    const cycles = this.detectCycles(capabilities);

    return {
      valid: missing.length === 0 && cycles.length === 0,
      missing,
      cycles,
    };
  }

  topologicalSort(capabilities: CapabilityDescriptor[]): string[] {
    const validation = this.validate(capabilities);
    if (!validation.valid) {
      throw new RuntimeInvariantError(
        `Invalid dependency graph. Missing=${validation.missing.length}, cycles=${validation.cycles.length}`,
      );
    }

    const graph = this.build(capabilities);
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      visited.add(id);
      for (const dependency of graph.get(id) ?? []) {
        visit(dependency);
      }
      result.push(id);
    };

    for (const capability of capabilities) {
      visit(capability.id);
    }

    return result;
  }

  private detectCycles(
    capabilities: CapabilityDescriptor[],
  ): string[][] {
    const graph = this.build(capabilities);
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const stack: string[] = [];
    const cycles: string[][] = [];

    const visit = (id: string): void => {
      if (visiting.has(id)) {
        const start = stack.indexOf(id);
        cycles.push([...stack.slice(start), id]);
        return;
      }

      if (visited.has(id)) return;

      visiting.add(id);
      stack.push(id);

      for (const dependency of graph.get(id) ?? []) {
        visit(dependency);
      }

      stack.pop();
      visiting.delete(id);
      visited.add(id);
    };

    for (const capability of capabilities) {
      visit(capability.id);
    }

    return cycles;
  }
}