import { Injectable } from '@nestjs/common';
import { SecurityIncident } from './enterprise-zero-trust-security.types';

@Injectable()
export class AutonomousIncidentResponseService {
  respond(incident: SecurityIncident) {
    const containmentActions = incident.affectedAssets.map(
      (asset) => `isolate:${asset}`,
    );
    const investigationActions = [
      `collect-evidence:${incident.source}`,
      `correlate-events:${incident.id}`,
      `preserve-audit-trail:${incident.id}`,
    ];

    return {
      incidentId: incident.id,
      containmentActions,
      investigationActions,
      executiveEscalation:
        incident.severity === 'critical' ||
        incident.severity === 'high',
      nextStatus:
        incident.severity === 'critical'
          ? 'contained'
          : 'investigating',
    };
  }
}