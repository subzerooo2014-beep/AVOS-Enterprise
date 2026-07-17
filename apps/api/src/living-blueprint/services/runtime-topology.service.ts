import { Injectable } from "@nestjs/common";
import { RuntimeTopology } from "../contracts/living-blueprint.contracts";
import { LivingBlueprintRegistryService } from "./living-blueprint-registry.service";

@Injectable()
export class RuntimeTopologyService {
  constructor(private readonly registry: LivingBlueprintRegistryService) {}

  build(): RuntimeTopology {
    const nodes = this.registry.listNodes();
    const edges = this.registry.listEdges();

    return {
      id: `runtime-topology:${Date.now()}`,
      activeNodes: nodes.filter((node) => node.status === "active").length,
      degradedNodes: nodes.filter((node) => node.status === "degraded").length,
      offlineNodes: nodes.filter((node) => node.status === "offline").length,
      dependencyLinks: edges.length,
      criticalLinks: edges.filter((edge) => edge.critical).length,
      capabilityCount: new Set(nodes.flatMap((node) => node.capabilities)).size,
      contractCount: new Set(nodes.flatMap((node) => node.contracts)).size,
      policyCount: new Set(nodes.flatMap((node) => node.policies)).size,
      generatedAt: new Date().toISOString(),
    };
  }

  serviceMap() {
    return this.registry.listNodes().map((node) => ({
      id: node.id,
      key: node.key,
      name: node.name,
      type: node.type,
      layer: node.layer,
      status: node.status,
      runtime: node.runtime,
    }));
  }

  capabilityMap() {
    return this.registry.listNodes().map((node) => ({
      nodeId: node.id,
      nodeKey: node.key,
      capabilities: node.capabilities,
    }));
  }

  dependencyMap() {
    return this.registry.listEdges().map((edge) => ({
      ...edge,
      source: this.registry.getNode(edge.sourceId).key,
      target: this.registry.getNode(edge.targetId).key,
    }));
  }

  eventFlowMap() {
    return this.registry
      .listEdges()
      .filter((edge) => edge.type === "emits" || edge.type === "consumes" || edge.type === "orchestrates")
      .map((edge) => ({
        id: edge.id,
        source: this.registry.getNode(edge.sourceId).key,
        target: this.registry.getNode(edge.targetId).key,
        type: edge.type,
        critical: edge.critical,
      }));
  }
}