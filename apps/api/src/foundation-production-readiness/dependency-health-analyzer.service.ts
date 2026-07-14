import { Injectable } from '@nestjs/common';
import { DependencyHealth } from './foundation-production-readiness.types';

@Injectable()
export class DependencyHealthAnalyzerService {
  analyze(dependencies: DependencyHealth[]) {
    const evaluated = dependencies.map((dependency) => ({
      ...dependency,
      healthy:
        dependency.available &&
        dependency.healthScore >= 70,
    }));

    return {
      dependencies: evaluated,
      healthScore: Math.round(
        evaluated.reduce(
          (sum, dependency) => sum + dependency.healthScore,
          0,
        ) / Math.max(1, evaluated.length),
      ),
      blockers: evaluated
        .filter(
          (dependency) =>
            dependency.required && !dependency.healthy,
        )
        .map((dependency) => dependency.id),
    };
  }
}