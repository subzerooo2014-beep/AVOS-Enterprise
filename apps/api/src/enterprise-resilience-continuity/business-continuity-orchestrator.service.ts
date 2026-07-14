import { Injectable } from '@nestjs/common';
import {
  CrisisIncident,
  CriticalDependency,
  RecoveryPlan,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class BusinessContinuityOrchestratorService {
  createPlan(
    incident: CrisisIncident,
    dependencies: CriticalDependency[],
  ): RecoveryPlan {
    const affected = dependencies.filter((dependency) =>
      incident.affectedDependencies.includes(dependency.id),
    );

    const estimatedRecoveryMinutes = affected.reduce(
      (max, dependency) =>
        Math.max(max, dependency.recoveryTimeObjectiveMinutes),
      0,
    );

    const actions = affected.flatMap((dependency) => [
      `isolate:${dependency.id}`,
      `activate-redundancy:${dependency.id}`,
      `restore:${dependency.id}`,
      `validate:${dependency.id}`,
    ]);

    return {
      incidentId: incident.id,
      actions,
      estimatedRecoveryMinutes,
      escalationRequired:
        incident.severity === 'critical' ||
        estimatedRecoveryMinutes > 120,
      targetStatus: 'recovering',
    };
  }
}