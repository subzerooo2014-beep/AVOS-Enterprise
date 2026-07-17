import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgeRelation } from "../contracts/enterprise-knowledge-graph.contracts";
import { CreateKnowledgeRelationDto } from "../dto/enterprise-knowledge-graph.dto";
import { KnowledgeEntityRegistryService } from "./knowledge-entity-registry.service";

@Injectable()
export class KnowledgeRelationRegistryService {
  private readonly relations = new Map<string, KnowledgeRelation>();
  private sequence = 0;

  constructor(private readonly entities: KnowledgeEntityRegistryService) {
    this.seed();
  }

  create(input: CreateKnowledgeRelationDto): KnowledgeRelation {
    if (input.sourceId === input.targetId) {
      throw new BadRequestException("Self relations are not allowed");
    }

    this.entities.get(input.sourceId);
    this.entities.get(input.targetId);

    const duplicate = [...this.relations.values()].find(
      (relation) =>
        relation.sourceId === input.sourceId &&
        relation.targetId === input.targetId &&
        relation.type === input.type,
    );

    if (duplicate) {
      throw new BadRequestException("Knowledge relation already exists");
    }

    const strength = input.strength ?? 100;
    const confidence = input.confidence ?? 100;

    if (strength < 0 || strength > 100 || confidence < 0 || confidence > 100) {
      throw new BadRequestException("strength and confidence must be between 0 and 100");
    }

    const relation: KnowledgeRelation = {
      id: `knowledge-relation:${Date.now()}:${++this.sequence}`,
      sourceId: input.sourceId,
      targetId: input.targetId,
      type: input.type,
      strength,
      confidence,
      critical: input.critical ?? false,
      metadata: { ...(input.metadata ?? {}) },
      createdAt: new Date().toISOString(),
    };

    this.relations.set(relation.id, relation);
    return relation;
  }

  get(id: string): KnowledgeRelation {
    const relation = this.relations.get(id);
    if (!relation) throw new NotFoundException(`Knowledge relation not found: ${id}`);
    return relation;
  }

  list(): readonly KnowledgeRelation[] {
    return [...this.relations.values()];
  }

  outgoing(entityId: string): readonly KnowledgeRelation[] {
    return this.list().filter((relation) => relation.sourceId === entityId);
  }

  incoming(entityId: string): readonly KnowledgeRelation[] {
    return this.list().filter((relation) => relation.targetId === entityId);
  }

  private seed(): void {
    const platform = this.entities.findByKey("avos-enterprise");
    const kernel = this.entities.findByKey("enterprise-kernel");
    const identity = this.entities.findByKey("digital-identity-os");
    const metadata = this.entities.findByKey("enterprise-metadata-graph");
    const architecture = this.entities.findByKey("architecture-intelligence");
    const blueprint = this.entities.findByKey("living-blueprint");

    if (!platform || !kernel || !identity || !metadata || !architecture || !blueprint) {
      throw new Error("Knowledge graph seed entities are missing");
    }

    this.create({ sourceId: kernel.id, targetId: platform.id, type: "contains", critical: true });
    this.create({ sourceId: identity.id, targetId: kernel.id, type: "depends-on", critical: true });
    this.create({ sourceId: metadata.id, targetId: kernel.id, type: "depends-on", critical: true });
    this.create({ sourceId: architecture.id, targetId: metadata.id, type: "consumes", critical: true });
    this.create({ sourceId: blueprint.id, targetId: architecture.id, type: "consumes", critical: true });
  }
}