import { Injectable } from "@nestjs/common";
import { BlueprintSnapshotService } from "./blueprint-snapshot.service";
import { LivingBlueprintRegistryService } from "./living-blueprint-registry.service";

@Injectable()
export class BlueprintEvolutionService {
  constructor(
    private readonly registry: LivingBlueprintRegistryService,
    private readonly snapshots: BlueprintSnapshotService,
  ) {}

  timeline() {
    return this.snapshots.listSnapshots().map((snapshot) => ({
      snapshotId: snapshot.id,
      version: snapshot.version,
      checksum: snapshot.checksum,
      source: snapshot.source,
      nodes: snapshot.nodes.length,
      edges: snapshot.edges.length,
      generatedAt: snapshot.generatedAt,
    }));
  }

  recommendations() {
    const nodes = this.registry.listNodes();
    const edges = this.registry.listEdges();
    const recommendations: string[] = [];

    if (nodes.some((node) => Object.keys(node.runtime).length === 0)) {
      recommendations.push("Synchronize missing runtime metadata for all blueprint nodes.");
    }

    if (nodes.some((node) => node.contracts.length === 0)) {
      recommendations.push("Increase contract coverage across the living blueprint.");
    }

    if (nodes.some((node) => node.policies.length === 0)) {
      recommendations.push("Attach governance policies to all active architecture nodes.");
    }

    if (edges.length < Math.max(1, nodes.length - 1)) {
      recommendations.push("Expand dependency and orchestration relationships to improve topology completeness.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Living Blueprint is synchronized and structurally complete.");
      recommendations.push("Continue creating snapshots before and after governed architecture changes.");
      recommendations.push("Preserve human approval for high-impact blueprint evolution.");
    }

    return recommendations;
  }
}