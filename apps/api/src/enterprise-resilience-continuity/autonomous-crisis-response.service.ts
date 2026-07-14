import { Injectable } from '@nestjs/common';
import {
  CrisisIncident,
  RecoveryPlan,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class AutonomousCrisisResponseService {
  respond(
    incident: CrisisIncident,
    plan: RecoveryPlan,
  ) {
    const containmentActions = [
      `contain-domain:${incident.domain}`,
      ...incident.affectedDependencies.map(
        (dependency) => `freeze-writes:${dependency}`,
      ),
    ];

    return {
      incidentId: incident.id,
      containmentActions,
      recoveryActions: plan.actions,
      nextStatus: plan.escalationRequired ? 'escalated' : 'recovering',
      executiveEscalation: plan.escalationRequired,
    };
  }
}