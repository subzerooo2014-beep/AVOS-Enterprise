import { Injectable } from '@nestjs/common';
import { CriticalDependency } from './enterprise-resilience-continuity.types';

@Injectable()
export class CriticalDependencyMapperService {
  map(dependencies: CriticalDependency[]) {
    const nodes = dependencies.map((dependency) => ({
      id: dependency.id,
      name: dependency.name,
      domain: dependency.domain,
      criticality: dependency.criticality,
      recoveryTimeObjectiveMinutes:
        dependency.recoveryTimeObjectiveMinutes,
    }));

    const edges = dependencies.flatMap((dependency) =>
      dependency.dependencies.map((target) => ({
        from: dependency.id,
        to: target,
      })),
    );

    const criticalPath = [...dependencies]
      .sort(
        (left, right) =>
          right.criticality - left.criticality ||
          left.recoveryTimeObjectiveMinutes -
            right.recoveryTimeObjectiveMinutes,
      )
      .slice(0, 5)
      .map((dependency) => dependency.id);

    return {
      nodes,
      edges,
      criticalPath,
      orphanDependencies: dependencies
        .filter(
          (dependency) =>
            dependency.dependencies.length === 0 &&
            dependency.criticality >= 80,
        )
        .map((dependency) => dependency.id),
    };
  }
}