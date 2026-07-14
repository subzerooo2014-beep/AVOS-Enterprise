import { Injectable } from '@nestjs/common';
import { CriticalDependency } from './enterprise-resilience-continuity.types';

@Injectable()
export class DisasterRecoveryIntelligenceService {
  assess(dependencies: CriticalDependency[]) {
    const readiness = dependencies.map((dependency) => {
      const score = Math.max(
        0,
        Math.min(
          100,
          100 -
            dependency.recoveryTimeObjectiveMinutes / 3 -
            dependency.recoveryPointObjectiveMinutes / 5 +
            dependency.criticality * 0.2,
        ),
      );

      return {
        dependencyId: dependency.id,
        readinessScore: Math.round(score),
        ready: score >= 65,
      };
    });

    return {
      readiness,
      overallReadiness: Math.round(
        readiness.reduce(
          (sum, dependency) => sum + dependency.readinessScore,
          0,
        ) / Math.max(1, readiness.length),
      ),
      notReady: readiness
        .filter((dependency) => !dependency.ready)
        .map((dependency) => dependency.dependencyId),
    };
  }
}