import { Injectable } from '@nestjs/common';
import {
  KnowledgeEntity,
  KnowledgeRelation,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class KnowledgeGraphGovernanceService {
  govern(
    entities: KnowledgeEntity[],
    relations: KnowledgeRelation[],
  ) {
    const duplicateLabels = entities
      .filter(
        (entity, index, list) =>
          list.findIndex(
            (candidate) =>
              candidate.label === entity.label &&
              candidate.domain === entity.domain,
          ) !== index,
      )
      .map((entity) => entity.id);

    const weakRelations = relations
      .filter((relation) => relation.weight < 0.5)
      .map((relation) => relation.id);

    const averageConfidence =
      entities.reduce(
        (sum, entity) => sum + entity.confidence,
        0,
      ) / Math.max(1, entities.length);

    return {
      governed: duplicateLabels.length === 0 && weakRelations.length === 0,
      duplicateLabels,
      weakRelations,
      graphHealth: Math.round(
        Math.max(
          0,
          Math.min(
            100,
            averageConfidence * 100 -
              duplicateLabels.length * 10 -
              weakRelations.length * 5,
          ),
        ),
      ),
    };
  }
}