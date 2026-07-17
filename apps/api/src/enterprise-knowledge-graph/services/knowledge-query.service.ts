import { Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgePath } from "../contracts/enterprise-knowledge-graph.contracts";
import { KnowledgeEntityRegistryService } from "./knowledge-entity-registry.service";
import { KnowledgeRelationRegistryService } from "./knowledge-relation-registry.service";

@Injectable()
export class KnowledgeQueryService {
  constructor(
    private readonly entities: KnowledgeEntityRegistryService,
    private readonly relations: KnowledgeRelationRegistryService,
  ) {}

  neighborhood(entityId: string, depth = 1) {
    this.entities.get(entityId);
    const safeDepth = Math.max(1, Math.min(depth, 5));
    const visited = new Set<string>([entityId]);
    let frontier = [entityId];

    for (let level = 0; level < safeDepth; level += 1) {
      const next = new Set<string>();

      for (const id of frontier) {
        for (const relation of [
          ...this.relations.outgoing(id),
          ...this.relations.incoming(id),
        ]) {
          next.add(relation.sourceId);
          next.add(relation.targetId);
        }
      }

      frontier = [...next].filter((id) => !visited.has(id));
      frontier.forEach((id) => visited.add(id));
      if (frontier.length === 0) break;
    }

    const entityIds = [...visited];
    return {
      root: this.entities.get(entityId),
      entities: entityIds.map((id) => this.entities.get(id)),
      relations: this.relations
        .list()
        .filter((relation) => visited.has(relation.sourceId) && visited.has(relation.targetId)),
      depth: safeDepth,
      generatedAt: new Date().toISOString(),
    };
  }

  findPath(sourceId: string, targetId: string): KnowledgePath {
    this.entities.get(sourceId);
    this.entities.get(targetId);

    const queue: Array<{ entityId: string; entityIds: string[]; relationIds: string[] }> = [
      { entityId: sourceId, entityIds: [sourceId], relationIds: [] },
    ];
    const visited = new Set<string>([sourceId]);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      if (current.entityId === targetId) {
        return {
          id: `knowledge-path:${Date.now()}`,
          sourceId,
          targetId,
          entityIds: current.entityIds,
          relationIds: current.relationIds,
          distance: current.relationIds.length,
          generatedAt: new Date().toISOString(),
        };
      }

      const adjacent = [
        ...this.relations.outgoing(current.entityId),
        ...this.relations.incoming(current.entityId),
      ];

      for (const relation of adjacent) {
        const nextId =
          relation.sourceId === current.entityId ? relation.targetId : relation.sourceId;

        if (visited.has(nextId)) continue;
        visited.add(nextId);
        queue.push({
          entityId: nextId,
          entityIds: [...current.entityIds, nextId],
          relationIds: [...current.relationIds, relation.id],
        });
      }
    }

    throw new NotFoundException("No knowledge path found");
  }

  graph() {
    return {
      entities: this.entities.list(),
      relations: this.relations.list(),
      generatedAt: new Date().toISOString(),
    };
  }
}