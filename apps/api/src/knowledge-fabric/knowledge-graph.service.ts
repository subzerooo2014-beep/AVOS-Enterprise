import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeRegistryService } from "./knowledge-registry.service";
import {
  CreateKnowledgeRelationInput,
  KnowledgeRecord,
} from "./knowledge.types";

@Injectable()
export class KnowledgeGraphService {
  constructor(private readonly registry: KnowledgeRegistryService) {}

  connect(input: CreateKnowledgeRelationInput): KnowledgeRecord {
    if (input.fromKnowledgeId === input.toKnowledgeId) {
      throw new BadRequestException(
        "Knowledge cannot be related to itself.",
      );
    }

    const source = this.registry.getById(input.fromKnowledgeId);
    const target = this.registry.getById(input.toKnowledgeId);

    if (!source || !target) {
      throw new NotFoundException(
        "Both source and target knowledge records must exist.",
      );
    }

    const duplicate = source.relations.some(
      (relation) =>
        relation.toKnowledgeId === input.toKnowledgeId &&
        relation.type === input.type,
    );

    if (!duplicate) {
      source.relations.push({
        id: randomUUID(),
        fromKnowledgeId: input.fromKnowledgeId,
        toKnowledgeId: input.toKnowledgeId,
        type: input.type,
        weight: Math.max(0, Math.min(1, input.weight ?? 1)),
        createdAt: new Date().toISOString(),
        metadata: input.metadata ?? {},
      });
      this.registry.replaceRecord(source);
    }

    return this.registry.getById(source.dna.identity.id)!;
  }

  dependenciesOf(knowledgeId: string): KnowledgeRecord[] {
    const source = this.registry.getById(knowledgeId);
    if (!source) {
      throw new NotFoundException(
        `Knowledge record not found: ${knowledgeId}`,
      );
    }

    return source.relations
      .filter((relation) => relation.type === "DEPENDS_ON")
      .map((relation) => this.registry.getById(relation.toKnowledgeId))
      .filter((record): record is KnowledgeRecord => Boolean(record));
  }

  dependentsOf(knowledgeId: string): KnowledgeRecord[] {
    return this.registry
      .list()
      .filter((record) =>
        record.relations.some(
          (relation) =>
            relation.type === "DEPENDS_ON" &&
            relation.toKnowledgeId === knowledgeId,
        ),
      );
  }
}