import { Injectable } from '@nestjs/common';
import {
  ArchitectureHealth,
  ArchitectureInventory,
  DependencyEdge,
  DuplicateGroup,
} from './platform-closure-pack-0.types';

@Injectable()
export class ArchitectureHealthService {
  calculate(
    inventory: ArchitectureInventory,
    duplicates: DuplicateGroup[],
    dependencies: {
      edges: DependencyEdge[];
      unresolved: DependencyEdge[];
      circularDependencies: string[][];
    },
  ): ArchitectureHealth {
    const componentCount = Math.max(inventory.totalComponents, 1);
    const duplicatePenalty = Math.min(30, duplicates.length * 2);
    const unresolvedPenalty = Math.min(25, dependencies.unresolved.length);
    const circularPenalty = Math.min(35, dependencies.circularDependencies.length * 7);
    const score = Math.max(0, 100 - duplicatePenalty - unresolvedPenalty - circularPenalty);

    const averageImportsPerComponent =
      Math.round((dependencies.edges.length / componentCount) * 100) / 100;
    const reuseRatio =
      Math.round(
        ((inventory.byKind.service ?? 0) / componentCount) * 10000,
      ) / 100;

    const findings: string[] = [];
    if (duplicates.length > 0) {
      findings.push(`${duplicates.length} potential duplicate component groups require review.`);
    }
    if (dependencies.unresolved.length > 0) {
      findings.push(`${dependencies.unresolved.length} relative imports could not be resolved.`);
    }
    if (dependencies.circularDependencies.length > 0) {
      findings.push(
        `${dependencies.circularDependencies.length} circular dependency paths were detected.`,
      );
    }
    if (findings.length === 0) {
      findings.push('No blocking architecture findings were detected by the Pack 0 baseline scan.');
    }

    return {
      score,
      status: score >= 85 ? 'healthy' : score >= 60 ? 'attention-required' : 'critical',
      metrics: {
        components: inventory.totalComponents,
        duplicateGroups: duplicates.length,
        unresolvedImports: dependencies.unresolved.length,
        circularDependencies: dependencies.circularDependencies.length,
        averageImportsPerComponent,
        reuseRatio,
      },
      findings,
    };
  }
}