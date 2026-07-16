import { Injectable } from "@nestjs/common";
import {
  KnowledgeGraphReplayResult
} from "../foundation-pack-13.types";
import { KnowledgeGraphSnapshotService } from "../snapshots/knowledge-graph-snapshot.service";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphReplayService {
  private readonly replays =
    new Map<string, KnowledgeGraphReplayResult>();

  constructor(
    private readonly snapshots: KnowledgeGraphSnapshotService,
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.replays.values());
  }

  replay(input: {
    snapshotId: string;
    replayedByIdentityId: string;
    correlationId: string;
  }) {
    const snapshot = this.snapshots.get(
      input.snapshotId
    );

    const replayedNodeIds: string[] = [];
    const replayedRelationshipIds: string[] = [];
    const conflicts: string[] = [];

    for (const node of snapshot.nodes) {
      const existing = this.nodes.resolve(
        node.canonicalName
      );

      if (existing && existing.id !== node.id) {
        conflicts.push(
          `Node conflict for canonical name ${node.canonicalName}.`
        );
        continue;
      }

      if (!existing) {
        this.nodes.register({
          id: node.id,
          type: node.type,
          canonicalName: node.canonicalName,
          displayName: node.displayName,
          description: node.description,
          identityId: node.identityId,
          sourceSystem: node.sourceSystem,
          domain: node.domain,
          tags: node.tags,
          attributes: node.attributes,
          confidence: node.confidence,
          correlationId: input.correlationId,
          actorIdentityId: input.replayedByIdentityId
        });
      }

      replayedNodeIds.push(node.id);
    }

    for (const relationship of snapshot.relationships) {
      try {
        const replayed = this.relationships.register({
          fromNodeId: relationship.fromNodeId,
          toNodeId: relationship.toNodeId,
          type: relationship.type,
          label: relationship.label,
          strength: relationship.strength,
          confidence: relationship.confidence,
          bidirectional: relationship.bidirectional,
          metadata: relationship.metadata,
          correlationId: input.correlationId,
          actorIdentityId: input.replayedByIdentityId
        });

        replayedRelationshipIds.push(replayed.id);
      }
      catch {
        conflicts.push(
          `Relationship replay failed: ${relationship.id}.`
        );
      }
    }

    const result: KnowledgeGraphReplayResult = {
      id: `knowledge-graph-replay:${Date.now()}:${
        this.replays.size + 1
      }`,
      snapshotId: snapshot.id,
      replayedNodeIds,
      replayedRelationshipIds,
      conflicts,
      replayedByIdentityId: input.replayedByIdentityId,
      replayedAt: new Date().toISOString()
    };

    this.replays.set(result.id, result);

    this.audit.record({
      correlationId: input.correlationId,
      category: "replay",
      action: "knowledge-graph-replayed",
      subjectId: result.id,
      actorIdentityId: input.replayedByIdentityId,
      outcome:
        conflicts.length > 0
          ? "warning"
          : "success",
      metadata: {
        snapshotId: snapshot.id,
        nodes: replayedNodeIds.length,
        relationships: replayedRelationshipIds.length,
        conflicts
      }
    });

    return result;
  }

  summary() {
    const replays = this.list();

    return {
      total: replays.length,
      conflicts: replays.reduce(
        (sum, replay) => sum + replay.conflicts.length,
        0
      )
    };
  }
}
