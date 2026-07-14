import { Injectable } from '@nestjs/common';
import {
  KnowledgeEntity,
  KnowledgeRelation,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class KnowledgeDiscoveryEngineService {
  discover(
    entities: KnowledgeEntity[],
    relations: KnowledgeRelation[],
  ) {
    const adjacency = new Map<string, string[]>();

    for (const relation of relations) {
      adjacency.set(
        relation.from,
        [...(adjacency.get(relation.from) ?? []), relation.to],
      );
    }

    const opportunities = entities
      .map((entity) => ({
        entityId: entity.id,
        connections: adjacency.get(entity.id)?.length ?? 0,
        opportunityScore: Math.round(
          entity.confidence * 70 +
            Math.min(30, (adjacency.get(entity.id)?.length ?? 0) * 5),
        ),
      }))
      .sort(
        (left, right) =>
          right.opportunityScore - left.opportunityScore,
      );

    return {
      opportunities,
      topDiscoveries: opportunities.slice(0, 5),
    };
  }
}