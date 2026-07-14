import { Injectable } from '@nestjs/common';
import {
  CriticalDependency,
  ResilienceSimulationScenario,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class ResilienceSimulationLaboratoryService {
  simulate(
    scenarios: ResilienceSimulationScenario[],
    dependencies: CriticalDependency[],
  ) {
    const dependencyMap = new Map(
      dependencies.map((dependency) => [dependency.id, dependency]),
    );

    const results = scenarios.map((scenario) => {
      const affected = scenario.failedDependencies
        .map((id) => dependencyMap.get(id))
        .filter(
          (dependency): dependency is CriticalDependency =>
            dependency !== undefined,
        );

      const recoveryMinutes = affected.reduce(
        (max, dependency) =>
          Math.max(max, dependency.recoveryTimeObjectiveMinutes),
        0,
      );

      const impactScore = Math.min(
        100,
        affected.reduce(
          (sum, dependency) => sum + dependency.criticality,
          0,
        ) /
          Math.max(1, affected.length) +
          scenario.trafficMultiplier * 5 +
          scenario.dataLossMinutes / 2,
      );

      return {
        ...scenario,
        affectedDependencies: affected.length,
        recoveryMinutes,
        impactScore: Math.round(impactScore),
        survivable:
          impactScore < 80 &&
          recoveryMinutes <= 240 &&
          scenario.dataLossMinutes <= 60,
      };
    });

    return {
      results,
      survivableScenarios: results
        .filter((scenario) => scenario.survivable)
        .map((scenario) => scenario.id),
    };
  }
}