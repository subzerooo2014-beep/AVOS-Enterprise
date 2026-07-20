import { Injectable } from '@nestjs/common';
import {
  ConsolidationRecommendation,
  DependencyEdge,
  DuplicateGroup,
} from './platform-closure-pack-0.types';

@Injectable()
export class ConsolidationEngineService {
  recommend(
    duplicates: DuplicateGroup[],
    dependencies: {
      unresolved: DependencyEdge[];
      circularDependencies: string[][];
    },
  ): ConsolidationRecommendation[] {
    const recommendations: ConsolidationRecommendation[] = [];

    for (const duplicate of duplicates.slice(0, 50)) {
      recommendations.push({
        id: `consolidate:${duplicate.key}`,
        priority: duplicate.confidence >= 95 ? 'high' : 'medium',
        type: 'merge',
        title: `Review duplicate family: ${duplicate.key}`,
        rationale:
          'Multiple components share materially equivalent names. Confirm responsibility overlap before adding new implementation.',
        affectedComponents: duplicate.components.map((component) => component.relativePath),
        requiresHumanApproval: true,
      });
    }

    if (dependencies.circularDependencies.length > 0) {
      recommendations.push({
        id: 'consolidate:circular-dependencies',
        priority: 'critical',
        type: 'boundary-review',
        title: 'Break circular dependency boundaries',
        rationale:
          'Circular dependencies weaken module isolation and can produce unstable initialization behavior.',
        affectedComponents: [
          ...new Set(dependencies.circularDependencies.flat()),
        ],
        requiresHumanApproval: true,
      });
    }

    if (dependencies.unresolved.length > 0) {
      recommendations.push({
        id: 'consolidate:unresolved-imports',
        priority: 'high',
        type: 'dependency-repair',
        title: 'Repair unresolved internal imports',
        rationale:
          'Unresolved relative imports prevent Pack 0 from creating a fully reliable dependency graph.',
        affectedComponents: [
          ...new Set(dependencies.unresolved.map((edge) => edge.from)),
        ],
        requiresHumanApproval: true,
      });
    }

    return recommendations;
  }
}