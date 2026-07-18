import { Injectable } from "@nestjs/common";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import {
  PlatformDependencyGraph,
  PlatformDependencyGraphNode
} from "../contracts/platform-dependency.contracts";
import { PlatformDependencyRegistryService } from "./platform-dependency-registry.service";

@Injectable()
export class PlatformDependencyGraphService {
  constructor(
    private readonly platformRegistry: PlatformRegistryService,
    private readonly dependencies: PlatformDependencyRegistryService
  ) {}

  build(): PlatformDependencyGraph {
    const services = this.platformRegistry.list();
    const edges = this.dependencies
      .list()
      .filter((dependency) => dependency.status === "active");

    const nodes: PlatformDependencyGraphNode[] = services.map((service) => ({
      serviceId: service.id,
      incoming: edges
        .filter((edge) => edge.targetServiceId === service.id)
        .map((edge) => edge.sourceServiceId),
      outgoing: edges
        .filter((edge) => edge.sourceServiceId === service.id)
        .map((edge) => edge.targetServiceId)
    }));

    return {
      nodes,
      edges,
      generatedAt: new Date().toISOString()
    };
  }

  detectCycles(): string[][] {
    const graph = this.build();
    const adjacency = new Map<string, string[]>(
      graph.nodes.map((node) => [node.serviceId, node.outgoing])
    );

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const stack: string[] = [];
    const cycles: string[][] = [];

    const walk = (node: string): void => {
      if (visiting.has(node)) {
        const start = stack.indexOf(node);
        if (start >= 0) {
          cycles.push([...stack.slice(start), node]);
        }
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      stack.push(node);

      for (const target of adjacency.get(node) ?? []) {
        walk(target);
      }

      stack.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const node of adjacency.keys()) {
      walk(node);
    }

    return cycles;
  }
}