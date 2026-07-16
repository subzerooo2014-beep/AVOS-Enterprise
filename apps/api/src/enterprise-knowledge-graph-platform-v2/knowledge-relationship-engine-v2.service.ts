import { Injectable } from "@nestjs/common";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import type { KnowledgeGraphEntityV2, KnowledgeGraphRelationV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeRelationshipEngineV2Service {
  private readonly relations = new Map<string, KnowledgeGraphRelationV2>();

  constructor(private readonly entities: KnowledgeEntityRegistryV2Service) {}

  connect(
    sourceId: string,
    targetId: string,
    relationType: string,
    weight = 1,
    properties: Record<string, unknown> = {},
  ): KnowledgeGraphRelationV2 {
    this.entities.get(sourceId);
    this.entities.get(targetId);

    const relation: KnowledgeGraphRelationV2 = {
      id: `kg-relation-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      sourceId,
      targetId,
      relationType,
      weight,
      properties: { ...properties },
      createdAt: new Date().toISOString(),
    };

    this.relations.set(relation.id, relation);
    return this.clone(relation);
  }

  neighbors(entityId: string): KnowledgeGraphEntityV2[] {
    const ids = new Set(
      this.list()
        .filter((relation) => relation.sourceId === entityId || relation.targetId === entityId)
        .map((relation) =>
          relation.sourceId === entityId ? relation.targetId : relation.sourceId,
        ),
    );

    return Array.from(ids).map((id) => this.entities.get(id));
  }

  list(): KnowledgeGraphRelationV2[] {
    return Array.from(this.relations.values()).map((relation) => this.clone(relation));
  }

  count(): number {
    return this.relations.size;
  }

  connectedEntityIds(): Set<string> {
    const ids = new Set<string>();
    for (const relation of this.relations.values()) {
      ids.add(relation.sourceId);
      ids.add(relation.targetId);
    }
    return ids;
  }

  private clone(relation: KnowledgeGraphRelationV2): KnowledgeGraphRelationV2 {
    return {
      ...relation,
      properties: { ...relation.properties },
    };
  }
}

