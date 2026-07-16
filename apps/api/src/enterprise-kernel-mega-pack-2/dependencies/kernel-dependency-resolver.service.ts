import { Injectable } from "@nestjs/common";
import { KernelDependencyResolution } from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyGraphService } from "./kernel-dependency-graph.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelDependencyResolverService {
  private readonly resolutions =
    new Map<string, KernelDependencyResolution>();

  constructor(
    private readonly graph: KernelDependencyGraphService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  list() {
    return Array.from(this.resolutions.values());
  }

  resolve(input: {
    requestedNodeIds?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const allNodes = this.graph.listNodes();

    const requested = Array.from(
      new Set(
        input.requestedNodeIds ??
        allNodes.map((node) => node.id)
      )
    );

    const selected = new Set<string>();
    const unresolvedDependencies: string[] = [];
    const optionalMissingDependencies: string[] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const activationOrder: string[] = [];
    const cycles: string[][] = [];

    const visit = (
      nodeId: string,
      path: string[]
    ) => {
      if (visiting.has(nodeId)) {
        const index = path.indexOf(nodeId);
        cycles.push([
          ...path.slice(index),
          nodeId
        ]);
        return;
      }

      if (visited.has(nodeId)) {
        return;
      }

      let node;

      try {
        node = this.graph.getNode(nodeId);
      }
      catch {
        unresolvedDependencies.push(nodeId);
        return;
      }

      if (!node.active) {
        unresolvedDependencies.push(
          `${nodeId}:inactive`
        );
        return;
      }

      visiting.add(nodeId);
      selected.add(nodeId);

      for (const edge of this.graph.outgoing(nodeId)) {
        try {
          this.graph.getNode(edge.toNodeId);
        }
        catch {
          if (
            edge.dependencyType === "optional"
          ) {
            optionalMissingDependencies.push(
              edge.toNodeId
            );
          }
          else {
            unresolvedDependencies.push(
              edge.toNodeId
            );
          }

          continue;
        }

        visit(edge.toNodeId, [
          ...path,
          nodeId
        ]);
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
      activationOrder.push(nodeId);
    };

    for (const nodeId of requested) {
      visit(nodeId, []);
    }

    const resolution: KernelDependencyResolution = {
      id: `kernel-dependency-resolution:${Date.now()}:${
        this.resolutions.size + 1
      }`,
      requestedNodeIds: requested,
      activationOrder,
      unresolvedDependencies:
        Array.from(
          new Set(unresolvedDependencies)
        ),
      optionalMissingDependencies:
        Array.from(
          new Set(optionalMissingDependencies)
        ),
      cycles,
      resolvable:
        unresolvedDependencies.length === 0 &&
        cycles.length === 0,
      resolvedAt: new Date().toISOString()
    };

    this.resolutions.set(
      resolution.id,
      resolution
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "dependency",
      action: "kernel-dependencies-resolved",
      subjectId: resolution.id,
      actorIdentityId: input.actorIdentityId,
      outcome: resolution.resolvable
        ? "success"
        : "blocked",
      metadata: {
        activationOrder:
          resolution.activationOrder,
        unresolvedDependencies:
          resolution.unresolvedDependencies,
        cycles: resolution.cycles
      }
    });

    return resolution;
  }

  detectCycles() {
    return this.resolve({
      actorIdentityId: "kernel:system",
      correlationId:
        `kernel-cycle-detection:${Date.now()}`
    }).cycles;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      resolvable: items.filter(
        (item) => item.resolvable
      ).length,
      blocked: items.filter(
        (item) => !item.resolvable
      ).length,
      latestResolvable:
        items.length === 0
          ? undefined
          : items[items.length - 1]
              ?.resolvable
    };
  }
}
