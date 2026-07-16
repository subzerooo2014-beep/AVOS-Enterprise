import { Injectable } from "@nestjs/common";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import { KnowledgeRelationshipEngineV2Service } from "./knowledge-relationship-engine-v2.service";
import type { KnowledgeInferenceV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeInferenceEngineV2Service {
  private readonly inferences: KnowledgeInferenceV2[] = [];

  constructor(
    private readonly entities: KnowledgeEntityRegistryV2Service,
    private readonly relations: KnowledgeRelationshipEngineV2Service,
  ) {}

  infer(entityId: string): KnowledgeInferenceV2[] {
    const entity = this.entities.get(entityId);
    const neighbors = this.relations.neighbors(entityId);
    const generated: KnowledgeInferenceV2[] = [];

    if (neighbors.length > 0) {
      generated.push(
        this.create(
          entityId,
          "CONNECTED_ENTITY_INFERENCE",
          `${entity.name} is connected to ${neighbors.length} knowledge entities.`,
          Math.min(0.95, 0.5 + neighbors.length * 0.05),
          neighbors.map((neighbor) => neighbor.id),
        ),
      );
    }

    if (entity.tags.length > 1) {
      generated.push(
        this.create(
          entityId,
          "MULTI_TAG_CONTEXT_INFERENCE",
          `${entity.name} participates in multiple semantic contexts.`,
          0.75,
          [...entity.tags],
        ),
      );
    }

    return generated;
  }

  list(): KnowledgeInferenceV2[] {
    return this.inferences.map((inference) => ({
      ...inference,
      evidence: [...inference.evidence],
    }));
  }

  count(): number {
    return this.inferences.length;
  }

  private create(
    entityId: string,
    rule: string,
    conclusion: string,
    confidence: number,
    evidence: string[],
  ): KnowledgeInferenceV2 {
    const inference: KnowledgeInferenceV2 = {
      id: `kg-inference-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      entityId,
      rule,
      conclusion,
      confidence,
      evidence: [...evidence],
      createdAt: new Date().toISOString(),
    };

    this.inferences.unshift(inference);
    return {
      ...inference,
      evidence: [...inference.evidence],
    };
  }
}
