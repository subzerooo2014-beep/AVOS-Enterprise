import { Injectable } from '@nestjs/common';
import { KnowledgeEntity } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class EnterpriseSemanticLayerService {
  map(entities: KnowledgeEntity[]) {
    const concepts = new Map<string, KnowledgeEntity[]>();

    for (const entity of entities) {
      const key = `${entity.domain}:${entity.type}`;
      const existing = concepts.get(key) ?? [];
      existing.push(entity);
      concepts.set(key, existing);
    }

    return {
      concepts: [...concepts.entries()].map(([concept, members]) => ({
        concept,
        members: members.map((member) => member.id),
        confidence: Number(
          (
            members.reduce(
              (sum, member) => sum + member.confidence,
              0,
            ) / Math.max(1, members.length)
          ).toFixed(3),
        ),
      })),
      semanticCoverage: Math.min(100, concepts.size * 12),
    };
  }
}