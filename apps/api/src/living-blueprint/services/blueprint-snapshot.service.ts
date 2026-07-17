import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import {
  LivingBlueprintDiff,
  LivingBlueprintSnapshot,
} from "../contracts/living-blueprint.contracts";
import { SynchronizeBlueprintDto } from "../dto/living-blueprint.dto";
import { LivingBlueprintRegistryService } from "./living-blueprint-registry.service";

@Injectable()
export class BlueprintSnapshotService {
  private readonly snapshots = new Map<string, LivingBlueprintSnapshot>();
  private version = 0;

  constructor(private readonly registry: LivingBlueprintRegistryService) {}

  createSnapshot(input: SynchronizeBlueprintDto = {}): LivingBlueprintSnapshot {
    const nodes = this.registry.listNodes();
    const edges = this.registry.listEdges();
    const checksum = createHash("sha256")
      .update(JSON.stringify({ nodes, edges, metadata: input.metadata ?? {} }))
      .digest("hex");

    const snapshot: LivingBlueprintSnapshot = {
      id: `living-blueprint-snapshot:${Date.now()}:${++this.version}`,
      version: this.version,
      nodes,
      edges,
      checksum,
      source: input.source ?? "synchronized",
      generatedAt: new Date().toISOString(),
    };

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  listSnapshots(): readonly LivingBlueprintSnapshot[] {
    return [...this.snapshots.values()].sort((a, b) => b.version - a.version);
  }

  getSnapshot(id: string): LivingBlueprintSnapshot {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) throw new NotFoundException(`Blueprint snapshot not found: ${id}`);
    return snapshot;
  }

  latest(): LivingBlueprintSnapshot {
    const existing = this.listSnapshots()[0];
    return existing ?? this.createSnapshot();
  }

  diff(fromSnapshotId: string, toSnapshotId: string): LivingBlueprintDiff {
    const from = this.getSnapshot(fromSnapshotId);
    const to = this.getSnapshot(toSnapshotId);

    const fromNodes = new Map(from.nodes.map((node) => [node.id, node]));
    const toNodes = new Map(to.nodes.map((node) => [node.id, node]));
    const fromEdges = new Map(from.edges.map((edge) => [edge.id, edge]));
    const toEdges = new Map(to.edges.map((edge) => [edge.id, edge]));

    const addedNodes = [...toNodes.keys()].filter((id) => !fromNodes.has(id));
    const removedNodes = [...fromNodes.keys()].filter((id) => !toNodes.has(id));
    const changedNodes = [...toNodes.keys()].filter((id) => {
      const previous = fromNodes.get(id);
      const current = toNodes.get(id);
      return previous && current && JSON.stringify(previous) !== JSON.stringify(current);
    });

    const addedEdges = [...toEdges.keys()].filter((id) => !fromEdges.has(id));
    const removedEdges = [...fromEdges.keys()].filter((id) => !toEdges.has(id));

    return {
      id: `living-blueprint-diff:${Date.now()}`,
      fromSnapshotId,
      toSnapshotId,
      addedNodes,
      removedNodes,
      changedNodes,
      addedEdges,
      removedEdges,
      generatedAt: new Date().toISOString(),
    };
  }
}