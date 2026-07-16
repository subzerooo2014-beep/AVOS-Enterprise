import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  FoundationKnowledgeEntityV1,
  FoundationKnowledgeRelationV1,
} from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationKnowledgeGraphV1Service {
  private readonly entities = new Map<string, FoundationKnowledgeEntityV1>();
  private readonly relations = new Map<string, FoundationKnowledgeRelationV1>();

  upsertEntity(
    id: string,
    type: string,
    name: string,
    properties: Record<string, unknown> = {},
  ): FoundationKnowledgeEntityV1 {
    const existing = this.entities.get(id);
    const now = new Date().toISOString();

    const entity: FoundationKnowledgeEntityV1 = {
      id,
      type,
      name,
      properties: { ...properties },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);
    return this.cloneEntity(entity);
  }

  connect(
    fromEntityId: string,
    toEntityId: string,
    relationType: string,
    properties: Record<string, unknown> = {},
  ): FoundationKnowledgeRelationV1 {
    if (!this.entities.has(fromEntityId) || !this.entities.has(toEntityId)) {
      throw new NotFoundException("Knowledge graph relation references a missing entity.");
    }

    const relation: FoundationKnowledgeRelationV1 = {
      id: `knowledge-relation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      fromEntityId,
      toEntityId,
      relationType,
      properties: { ...properties },
      createdAt: new Date().toISOString(),
    };

    this.relations.set(relation.id, relation);
    return this.cloneRelation(relation);
  }

  neighbors(entityId: string): FoundationKnowledgeEntityV1[] {
    const relatedIds = this.listRelations()
      .filter(
        (relation) =>
          relation.fromEntityId === entityId ||
          relation.toEntityId === entityId,
      )
      .map((relation) =>
        relation.fromEntityId === entityId
          ? relation.toEntityId
          : relation.fromEntityId,
      );

    return relatedIds
      .map((id) => this.entities.get(id))
      .filter(
        (entity): entity is FoundationKnowledgeEntityV1 =>
          entity !== undefined,
      )
      .map((entity) => this.cloneEntity(entity));
  }

  listEntities(): FoundationKnowledgeEntityV1[] {
    return Array.from(this.entities.values()).map((item) => this.cloneEntity(item));
  }

  listRelations(): FoundationKnowledgeRelationV1[] {
    return Array.from(this.relations.values()).map((item) => this.cloneRelation(item));
  }

  entityCount(): number {
    return this.entities.size;
  }

  relationCount(): number {
    return this.relations.size;
  }

  private cloneEntity(item: FoundationKnowledgeEntityV1): FoundationKnowledgeEntityV1 {
    return { ...item, properties: { ...item.properties } };
  }

  private cloneRelation(
    item: FoundationKnowledgeRelationV1,
  ): FoundationKnowledgeRelationV1 {
    return { ...item, properties: { ...item.properties } };
  }
}
