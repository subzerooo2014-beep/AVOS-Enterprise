import { Injectable } from '@nestjs/common';
import {
  KnowledgeEntity,
  KnowledgeRelation,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class KnowledgeFabricEngineService {
  build(
    entities: KnowledgeEntity[],
    relations: KnowledgeRelation[],
  ) {
    const ids = new Set(entities.map((entity) => entity.id));
    const validRelations = relations.filter(
      (relation) => ids.has(relation.from) && ids.has(relation.to),
    );

    const domains = [...new Set(entities.map((entity) => entity.domain))];
    const types = [...new Set(entities.map((entity) => entity.type))];

    return {
      entities,
      relations: validRelations,
      domains,
      types,
      fabricCoverage: Math.min(
        100,
        domains.length * 15 +
          types.length * 10 +
          validRelations.length * 2,
      ),
      invalidRelations: relations
        .filter((relation) => !validRelations.includes(relation))
        .map((relation) => relation.id),
    };
  }
}