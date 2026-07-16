import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  KnowledgeEntityRecord,
  KnowledgeRelationRecord,
} from "./enterprise-intelligence-command.types";

@Injectable()
export class EnterpriseKnowledgeGraphService {
  private readonly entities = new Map<string, KnowledgeEntityRecord>();
  private readonly relations = new Map<string, KnowledgeRelationRecord>();

  upsertEntity(
    input: Omit<KnowledgeEntityRecord, "version" | "createdAt" | "updatedAt">,
  ): KnowledgeEntityRecord {
    const existing = this.entities.get(input.id);
    const now = new Date().toISOString();

    const entity: KnowledgeEntityRecord = {
      ...input,
      properties: { ...input.properties },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);
    return this.cloneEntity(entity);
  }

  connect(
    sourceId: string,
    targetId: string,
    relation: string,
    weight = 1,
  ): KnowledgeRelationRecord {
    this.requireEntity(sourceId);
    this.requireEntity(targetId);

    const link: KnowledgeRelationRecord = {
      id: `knowledge-relation-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      sourceId,
      targetId,
      relation,
      weight,
      createdAt: new Date().toISOString(),
    };

    this.relations.set(link.id, link);
    return { ...link };
  }

  neighbors(entityId: string): KnowledgeEntityRecord[] {
    const ids = new Set(
      this.listRelations()
        .filter(
          (link) => link.sourceId === entityId || link.targetId === entityId,
        )
        .map((link) =>
          link.sourceId === entityId ? link.targetId : link.sourceId,
        ),
    );

    return Array.from(ids)
      .map((id) => this.entities.get(id))
      .filter((item): item is KnowledgeEntityRecord => Boolean(item))
      .map((item) => this.cloneEntity(item));
  }

  listEntities(): KnowledgeEntityRecord[] {
    return Array.from(this.entities.values()).map((item) =>
      this.cloneEntity(item),
    );
  }

  listRelations(): KnowledgeRelationRecord[] {
    return Array.from(this.relations.values()).map((item) => ({ ...item }));
  }

  entityCount(): number {
    return this.entities.size;
  }

  relationCount(): number {
    return this.relations.size;
  }

  private requireEntity(id: string): KnowledgeEntityRecord {
    const entity = this.entities.get(id);

    if (!entity) {
      throw new NotFoundException(`Knowledge entity '${id}' was not found.`);
    }

    return entity;
  }

  private cloneEntity(item: KnowledgeEntityRecord): KnowledgeEntityRecord {
    return { ...item, properties: { ...item.properties } };
  }
}
